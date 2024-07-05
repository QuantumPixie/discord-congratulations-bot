import { describe, it, expect, beforeEach, vi } from 'vitest';
import { templateController } from '../../src/controllers/templateController';
import { templateRepository } from '../../src/repositories/templateRepository';
import {
  parseInsertable,
  parseUpdatable,
} from '../../src/schemas/templateSchema';
import {
  BadRequestError,
  NotFoundError,
  CustomError,
} from '../../src/utils/errors/CustomError';
import { z } from 'zod';

vi.mock('../../src/repositories/templateRepository');
vi.mock('../../src/schemas/templateSchema');

describe('Template Controller Tests', () => {
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

  it('should create a template', async () => {
    const validatedData = { message_template: 'Congratulations!' };
    vi.mocked(parseInsertable).mockReturnValue(validatedData);
    vi.mocked(templateRepository.create).mockResolvedValue();

    req.body = { message_template: 'Congratulations!' };

    await templateController.createTemplate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Template created successfully',
    });
  });

  it('should handle validation error during template creation', async () => {
    const validationError = new BadRequestError('Invalid request');
    vi.mocked(parseInsertable).mockImplementation(() => {
      throw new z.ZodError([]);
    });

    req.body = { message_template: '' }; // Invalid data

    await templateController.createTemplate(req, res, next);
    expect(next).toHaveBeenCalledWith(validationError);
  });

  it('should get all templates', async () => {
    vi.mocked(templateRepository.findAll).mockResolvedValue([]);

    await templateController.getAllTemplates(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should update a template', async () => {
    const validatedData = { id: 1, message_template: 'Congratulations!' };
    vi.mocked(parseUpdatable).mockReturnValue(validatedData);
    vi.mocked(templateRepository.update).mockResolvedValue(true);

    req.params.id = '1';
    req.body = { message_template: 'Congratulations!' };

    await templateController.updateTemplate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Template updated successfully',
    });
  });

  it('should handle not found error during template update', async () => {
    const validatedData = { id: 1, message_template: 'Congratulations!' };
    vi.mocked(parseUpdatable).mockReturnValue(validatedData);
    vi.mocked(templateRepository.update).mockResolvedValue(false);

    req.params.id = '1';
    req.body = { message_template: 'Congratulations!' };

    await templateController.updateTemplate(req, res, next);
    expect(next).toHaveBeenCalledWith(new NotFoundError('Template not found'));
  });

  it('should delete a template', async () => {
    vi.mocked(templateRepository.delete).mockResolvedValue(true);

    req.params.id = '1';

    await templateController.deleteTemplate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Template deleted successfully',
    });
  });

  it('should handle not found error during template deletion', async () => {
    vi.mocked(templateRepository.delete).mockResolvedValue(false);

    req.params.id = '1';

    await templateController.deleteTemplate(req, res, next);
    expect(next).toHaveBeenCalledWith(new NotFoundError('Template not found'));
  });
});
