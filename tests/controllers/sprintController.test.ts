import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sprintController } from '../../src/controllers/sprintController';
import { sprintRepository } from '../../src/repositories/sprintRepository';
import {
  parseInsertable,
  parseUpdatable,
} from '../../src/schemas/sprintSchema';
import {
  BadRequestError,
  NotFoundError,
} from '../../src/utils/errors/CustomError';
import { z } from 'zod';

vi.mock('../../src/repositories/sprintRepository');
vi.mock('../../src/schemas/sprintSchema');

describe('Sprint Controller Tests', () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it('should create a sprint', async () => {
    const validatedData = { sprint_code: 'S1', sprint_name: 'Sprint 1' };
    vi.mocked(parseInsertable).mockReturnValue(validatedData);
    vi.mocked(sprintRepository.create).mockResolvedValue();

    req.body = { sprint_code: 'S1', sprint_name: 'Sprint 1' };

    await sprintController.createSprint(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Sprint created successfully',
    });
  });

  it('should handle validation error during sprint creation', async () => {
    const validationError = new BadRequestError('Invalid request');
    vi.mocked(parseInsertable).mockImplementation(() => {
      throw new z.ZodError([]);
    });

    req.body = { sprint_code: '', sprint_name: '' }; // Invalid data

    await sprintController.createSprint(req, res, next);
    expect(next).toHaveBeenCalledWith(validationError);
  });

  it('should get all sprints', async () => {
    vi.mocked(sprintRepository.findAll).mockResolvedValue([]);

    await sprintController.getAllSprints(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should update a sprint', async () => {
    const validatedData = { sprint_code: 'S1', sprint_name: 'Sprint 1' };
    vi.mocked(parseUpdatable).mockReturnValue(validatedData);
    vi.mocked(sprintRepository.update).mockResolvedValue(true);

    req.params.id = '1';
    req.body = { sprint_code: 'S1', sprint_name: 'Sprint 1' };

    await sprintController.updateSprint(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Sprint updated successfully',
    });
  });

  it('should handle not found error during sprint update', async () => {
    const validatedData = { sprint_code: 'S1', sprint_name: 'Sprint 1' };
    vi.mocked(parseUpdatable).mockReturnValue(validatedData);
    vi.mocked(sprintRepository.update).mockResolvedValue(false);

    req.params.id = '1';
    req.body = { sprint_code: 'S1', sprint_name: 'Sprint 1' };

    await sprintController.updateSprint(req, res, next);
    expect(next).toHaveBeenCalledWith(new NotFoundError('Sprint not found'));
  });

  it('should delete a sprint', async () => {
    vi.mocked(sprintRepository.delete).mockResolvedValue(true);

    req.params.id = '1';

    await sprintController.deleteSprint(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Sprint deleted successfully',
    });
  });

  it('should handle not found error during sprint deletion', async () => {
    vi.mocked(sprintRepository.delete).mockResolvedValue(false);

    req.params.id = '1';

    await sprintController.deleteSprint(req, res, next);
    expect(next).toHaveBeenCalledWith(new NotFoundError('Sprint not found'));
  });
});
