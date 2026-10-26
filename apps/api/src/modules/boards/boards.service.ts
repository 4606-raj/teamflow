import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import {
	MAX_BOARDS_PER_PROJECT,
	type CreateBoardRequest,
	type MoveTaskRequest,
	type UpdateBoardRequest,
} from '@teamflow/types';
import { BoardsRepository } from './repositories/boards.repository';
import { TaskMapper } from '../tasks/mappers/task-response.mapper';

// Project roles allowed to add, rename or delete boards. Every member can read.
const MANAGE_ROLES: readonly string[] = ['Maintainer', 'Admin'];
// Project roles allowed to move tasks between boards (Guest and Client are read-only).
const EDIT_ROLES: readonly string[] = ['Developer', 'Maintainer', 'Admin'];

@Injectable()
export class BoardsService {
	constructor(private readonly boardsRepo: BoardsRepository) {}

	async list(projectId: string, userId: string) {
		await this.assertMember(projectId, userId);
		await this.ensureProjectBoards(projectId);

		const boards = await this.boardsRepo.listWithTasks(projectId);

		return boards.map((board) => ({
			id: board.id,
			name: board.name,
			position: board.position,
			tasks: board.tasks.map(({ task }) => TaskMapper.toListItem(task)),
		}));
	}

	async create(projectId: string, data: CreateBoardRequest, userId: string) {
		await this.assertCanManage(projectId, userId);
		await this.ensureProjectBoards(projectId);

		if ((await this.boardsRepo.countByProject(projectId)) >= MAX_BOARDS_PER_PROJECT) {
			throw new ConflictException(
				`A project can have at most ${MAX_BOARDS_PER_PROJECT} boards`,
			);
		}

		await this.assertNameFree(projectId, data.name);

		const board = await this.boardsRepo.create(projectId, data.name);

		return { ...board, tasks: [] };
	}

	async rename(boardId: string, data: UpdateBoardRequest, userId: string) {
		const board = await this.getManageableBoard(boardId, userId);

		await this.assertNameFree(board.projectId, data.name, board.id);

		return this.boardsRepo.rename(board.id, data.name);
	}

	async delete(boardId: string, userId: string) {
		const board = await this.getManageableBoard(boardId, userId);

		if (board._count.tasks > 0) {
			throw new ConflictException('Move or delete this board\'s tasks before deleting it');
		}

		if ((await this.boardsRepo.countByProject(board.projectId)) <= 1) {
			throw new ConflictException('A project needs at least one board');
		}

		await this.boardsRepo.delete(board.id);

		return { id: board.id };
	}

	async moveTask(
		taskId: string,
		projectId: string,
		data: MoveTaskRequest,
		userId: string,
	) {
		const membership = await this.assertMember(projectId, userId);

		if (!EDIT_ROLES.includes(membership.role)) {
			throw new ForbiddenException('You do not have permission to move tasks');
		}

		const board = await this.boardsRepo.findById(data.boardId);

		if (!board || board.projectId !== projectId) {
			throw new NotFoundException('Board not found');
		}

		return this.boardsRepo.moveTask(taskId, projectId, data.boardId, data.position);
	}

	/**
	 * Resolves where a new task lands: the requested board (must belong to the
	 * project) or the project's first board. Also enforces project membership.
	 */
	async resolvePlacementForNewTask(
		projectId: string,
		userId: string,
		boardId?: string,
	) {
		await this.assertMember(projectId, userId);
		await this.ensureProjectBoards(projectId);

		let targetId = boardId;

		if (targetId) {
			const board = await this.boardsRepo.findById(targetId);

			if (!board || board.projectId !== projectId) {
				throw new NotFoundException('Board not found');
			}
		} else {
			targetId = (await this.boardsRepo.findFirstOfProject(projectId))?.id;
		}

		if (!targetId) {
			throw new NotFoundException('Board not found');
		}

		return {
			boardId: targetId,
			position: await this.boardsRepo.countTasksOnBoard(targetId),
		};
	}

	/**
	 * Projects created before boards existed get the default set on first
	 * access, and their tasks (which have no board yet) land in the first one.
	 */
	private async ensureProjectBoards(projectId: string) {
		if ((await this.boardsRepo.countByProject(projectId)) === 0) {
			await this.boardsRepo.createDefaults(projectId);
		}

		const unplaced = await this.boardsRepo.findUnplacedTaskIds(projectId);

		if (unplaced.length === 0) {
			return;
		}

		const first = await this.boardsRepo.findFirstOfProject(projectId);

		if (first) {
			await this.boardsRepo.placeTasks(
				first.id,
				unplaced.map((task) => task.id),
				await this.boardsRepo.countTasksOnBoard(first.id),
			);
		}
	}

	private async getManageableBoard(boardId: string, userId: string) {
		const board = await this.boardsRepo.findById(boardId);

		if (!board) {
			throw new NotFoundException('Board not found');
		}

		await this.assertCanManage(board.projectId, userId);

		return board;
	}

	private async assertNameFree(projectId: string, name: string, exceptId?: string) {
		const existing = await this.boardsRepo.findByName(projectId, name);

		if (existing && existing.id !== exceptId) {
			throw new ConflictException('A board with this name already exists');
		}
	}

	// Non-members get a 404 so project ids can't be probed.
	private async assertMember(projectId: string, userId: string) {
		const membership = await this.boardsRepo.findMembership(projectId, userId);

		if (!membership) {
			throw new NotFoundException('Project not found');
		}

		return membership;
	}

	private async assertCanManage(projectId: string, userId: string) {
		const membership = await this.assertMember(projectId, userId);

		if (!MANAGE_ROLES.includes(membership.role)) {
			throw new ForbiddenException('You do not have permission to manage boards');
		}
	}
}
