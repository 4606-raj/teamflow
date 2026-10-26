import {
	ConflictException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
// @teamflow/types ships as ESM, which Jest's CJS runtime can't load.
jest.mock('@teamflow/types', () => ({
	MAX_BOARDS_PER_PROJECT: 20,
	DEFAULT_BOARD_NAMES: ['Todo', 'In Progress', 'Blocked', 'Done'],
}));

import { BoardsService } from './boards.service';
import { BoardsRepository } from './repositories/boards.repository';

describe('BoardsService', () => {
	let service: BoardsService;
	let repo: jest.Mocked<Record<keyof BoardsRepository, jest.Mock>>;

	beforeEach(async () => {
		repo = {
			findMembership: jest.fn().mockResolvedValue({ role: 'Maintainer' }),
			findById: jest.fn(),
			countByProject: jest.fn().mockResolvedValue(4),
			findByName: jest.fn().mockResolvedValue(null),
			findFirstOfProject: jest.fn().mockResolvedValue({ id: 'b1' }),
			countTasksOnBoard: jest.fn().mockResolvedValue(0),
			createDefaults: jest.fn(),
			findUnplacedTaskIds: jest.fn().mockResolvedValue([]),
			placeTasks: jest.fn(),
			listWithTasks: jest.fn().mockResolvedValue([]),
			create: jest.fn().mockResolvedValue({ id: 'b5', name: 'QA', position: 4 }),
			rename: jest.fn(),
			delete: jest.fn(),
			moveTask: jest.fn(),
		} as never;

		const module = await Test.createTestingModule({
			providers: [BoardsService, { provide: BoardsRepository, useValue: repo }],
		}).compile();

		service = module.get(BoardsService);
	});

	it('hides the project from non-members', async () => {
		repo.findMembership.mockResolvedValue(null);

		await expect(service.list('p1', 'u1')).rejects.toBeInstanceOf(NotFoundException);
		expect(repo.listWithTasks).not.toHaveBeenCalled();
	});

	it('creates the default boards for a project that has none', async () => {
		repo.countByProject.mockResolvedValue(0);

		await service.list('p1', 'u1');

		expect(repo.createDefaults).toHaveBeenCalledWith('p1');
	});

	it('moves legacy tasks without a board into the first board', async () => {
		repo.findUnplacedTaskIds.mockResolvedValue([{ id: 't1' }, { id: 't2' }]);

		await service.list('p1', 'u1');

		expect(repo.placeTasks).toHaveBeenCalledWith('b1', ['t1', 't2'], 0);
	});

	it('only lets Maintainers and Admins add boards', async () => {
		repo.findMembership.mockResolvedValue({ role: 'Developer' });

		await expect(service.create('p1', { name: 'QA' }, 'u1')).rejects.toBeInstanceOf(
			ForbiddenException,
		);
	});

	it('rejects duplicate board names', async () => {
		repo.findByName.mockResolvedValue({ id: 'other' });

		await expect(service.create('p1', { name: 'Todo' }, 'u1')).rejects.toBeInstanceOf(
			ConflictException,
		);
	});

	it('refuses to delete a board that still has tasks', async () => {
		repo.findById.mockResolvedValue({ id: 'b1', projectId: 'p1', _count: { tasks: 2 } });

		await expect(service.delete('b1', 'u1')).rejects.toBeInstanceOf(ConflictException);
		expect(repo.delete).not.toHaveBeenCalled();
	});

	it('refuses to delete the last board', async () => {
		repo.findById.mockResolvedValue({ id: 'b1', projectId: 'p1', _count: { tasks: 0 } });
		repo.countByProject.mockResolvedValue(1);

		await expect(service.delete('b1', 'u1')).rejects.toBeInstanceOf(ConflictException);
	});

	it('rejects a task placement on a board from another project', async () => {
		repo.findById.mockResolvedValue({ id: 'bX', projectId: 'other', _count: { tasks: 0 } });

		await expect(
			service.resolvePlacementForNewTask('p1', 'u1', 'bX'),
		).rejects.toBeInstanceOf(NotFoundException);
	});

	it('places a new task at the end of the first board by default', async () => {
		repo.countTasksOnBoard.mockResolvedValue(3);

		await expect(service.resolvePlacementForNewTask('p1', 'u1')).resolves.toEqual({
			boardId: 'b1',
			position: 3,
		});
	});

	it('lets read-only roles view but not move tasks', async () => {
		repo.findMembership.mockResolvedValue({ role: 'Guest' });

		await expect(
			service.moveTask('t1', 'p1', { boardId: 'b1', position: 0 }, 'u1'),
		).rejects.toBeInstanceOf(ForbiddenException);
		expect(repo.moveTask).not.toHaveBeenCalled();
	});

	it('rejects moving a task onto a board of another project', async () => {
		repo.findMembership.mockResolvedValue({ role: 'Developer' });
		repo.findById.mockResolvedValue({ id: 'bX', projectId: 'other', _count: { tasks: 0 } });

		await expect(
			service.moveTask('t1', 'p1', { boardId: 'bX', position: 0 }, 'u1'),
		).rejects.toBeInstanceOf(NotFoundException);
		expect(repo.moveTask).not.toHaveBeenCalled();
	});

	it('moves a task for a Developer', async () => {
		repo.findMembership.mockResolvedValue({ role: 'Developer' });
		repo.findById.mockResolvedValue({ id: 'b2', projectId: 'p1', _count: { tasks: 0 } });
		repo.moveTask.mockResolvedValue({ id: 't1', boardId: 'b2', position: 1 });

		await expect(
			service.moveTask('t1', 'p1', { boardId: 'b2', position: 1 }, 'u1'),
		).resolves.toEqual({ id: 't1', boardId: 'b2', position: 1 });
		expect(repo.moveTask).toHaveBeenCalledWith('t1', 'p1', 'b2', 1);
	});
});
