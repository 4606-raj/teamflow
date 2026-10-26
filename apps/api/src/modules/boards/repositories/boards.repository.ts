import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { DEFAULT_BOARD_NAMES } from '@teamflow/types';
import { taskListSelect } from '@/modules/tasks/types/tasks.types';

@Injectable()
export class BoardsRepository {
	constructor(private readonly prisma: PrismaService) {}

	findMembership(projectId: string, userId: string) {
		return this.prisma.projectUser.findUnique({
			where: { projectId_userId: { projectId, userId } },
			select: { role: true },
		});
	}

	findById(boardId: string) {
		return this.prisma.board.findUnique({
			where: { id: boardId },
			select: {
				id: true,
				projectId: true,
				position: true,
				_count: { select: { tasks: true } },
			},
		});
	}

	countByProject(projectId: string) {
		return this.prisma.board.count({ where: { projectId } });
	}

	findByName(projectId: string, name: string) {
		return this.prisma.board.findFirst({
			where: { projectId, name },
			select: { id: true },
		});
	}

	findFirstOfProject(projectId: string) {
		return this.prisma.board.findFirst({
			where: { projectId },
			orderBy: { position: 'asc' },
			select: { id: true },
		});
	}

	countTasksOnBoard(boardId: string) {
		return this.prisma.taskBoard.count({ where: { boardId } });
	}

	createDefaults(projectId: string) {
		return this.prisma.board.createMany({
			data: DEFAULT_BOARD_NAMES.map((name, position) => ({
				projectId,
				name,
				position,
			})),
		});
	}

	// Tasks created before boards existed have no TaskBoard row.
	findUnplacedTaskIds(projectId: string) {
		return this.prisma.task.findMany({
			where: { projectId, boards: { none: {} } },
			orderBy: { createdAt: 'asc' },
			select: { id: true },
		});
	}

	placeTasks(boardId: string, taskIds: string[], startPosition: number) {
		return this.prisma.taskBoard.createMany({
			data: taskIds.map((taskId, index) => ({
				boardId,
				taskId,
				position: startPosition + index,
			})),
			skipDuplicates: true,
		});
	}

	listWithTasks(projectId: string) {
		return this.prisma.board.findMany({
			where: { projectId },
			orderBy: { position: 'asc' },
			select: {
				id: true,
				name: true,
				position: true,
				tasks: {
					orderBy: { position: 'asc' },
					select: { task: { select: taskListSelect } },
				},
			},
		});
	}

	async create(projectId: string, name: string) {
		const last = await this.prisma.board.aggregate({
			where: { projectId },
			_max: { position: true },
		});

		return this.prisma.board.create({
			data: {
				projectId,
				name,
				position: (last._max.position ?? -1) + 1,
			},
			select: { id: true, name: true, position: true },
		});
	}

	rename(boardId: string, name: string) {
		return this.prisma.board.update({
			where: { id: boardId },
			data: { name },
			select: { id: true, name: true, position: true },
		});
	}

	delete(boardId: string) {
		return this.prisma.board.delete({ where: { id: boardId } });
	}

	/**
	 * Puts the task at `position` of `boardId`, closing the gap it leaves behind.
	 * Positions stay dense (0..n-1) on every board touched.
	 */
	moveTask(taskId: string, projectId: string, boardId: string, position: number) {
		return this.prisma.$transaction(async (tx) => {
			const projectBoards = await tx.board.findMany({
				where: { projectId },
				select: { id: true },
			});

			const placements = await tx.taskBoard.findMany({
				where: { taskId, boardId: { in: projectBoards.map((b) => b.id) } },
				select: { id: true, boardId: true, position: true },
			});

			const current = placements.find((p) => p.boardId === boardId);
			const stale = placements.filter((p) => p.boardId !== boardId);

			if (stale.length > 0) {
				await tx.taskBoard.deleteMany({
					where: { id: { in: stale.map((p) => p.id) } },
				});
			}

			const siblings = await tx.taskBoard.findMany({
				where: { boardId, taskId: { not: taskId } },
				orderBy: { position: 'asc' },
				select: { id: true, position: true },
			});

			const index = Math.min(position, siblings.length);
			const movedId =
				current?.id ??
				(
					await tx.taskBoard.create({
						data: { taskId, boardId, position: index },
						select: { id: true },
					})
				).id;

			const ordered = [
				...siblings.slice(0, index),
				{ id: movedId, position: current?.position ?? index },
				...siblings.slice(index),
			];

			for (const [slot, row] of ordered.entries()) {
				if (row.position !== slot) {
					await tx.taskBoard.update({ where: { id: row.id }, data: { position: slot } });
				}
			}

			for (const sourceBoardId of new Set(stale.map((p) => p.boardId))) {
				const remaining = await tx.taskBoard.findMany({
					where: { boardId: sourceBoardId },
					orderBy: { position: 'asc' },
					select: { id: true, position: true },
				});

				for (const [slot, row] of remaining.entries()) {
					if (row.position !== slot) {
						await tx.taskBoard.update({ where: { id: row.id }, data: { position: slot } });
					}
				}
			}

			return { id: taskId, boardId, position: index };
		});
	}
}
