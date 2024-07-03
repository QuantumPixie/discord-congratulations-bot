import { Request, Response, NextFunction } from 'express';
import { templateRepository } from '../repositories/templateRepository';
import { parseInsertable, parseUpdatable } from '../schemas/templateSchema';
import {
  BadRequestError,
  NotFoundError,
  CustomError,
} from '../utils/errors/CustomError';
import { z } from 'zod';

export const templateController = {
  async createTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = parseInsertable(req.body);
      await templateRepository.create(validatedData);
      res.status(201).json({ message: 'Template created successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new BadRequestError('Invalid request'));
      } else {
        next(new CustomError('Failed to create template', 500));
      }
    }
  },

  async getAllTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await templateRepository.findAll();
      res.json(templates);
    } catch (error) {
      next(new CustomError('Failed to fetch templates', 500));
    }
  },

  async updateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = parseUpdatable({
        ...req.body,
        id: Number(req.params.id),
      });
      const result = await templateRepository.update(
        validatedData.id!,
        validatedData
      );
      if (result) {
        res.status(200).json({ message: 'Template updated successfully' });
      } else {
        next(new NotFoundError('Template not found'));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new BadRequestError('Invalid request'));
      } else {
        next(new CustomError('Failed to update template', 500));
      }
    }
  },

  async deleteTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await templateRepository.delete(id);
      if (result) {
        res.status(200).json({ message: 'Template deleted successfully' });
      } else {
        next(new NotFoundError('Template not found'));
      }
    } catch (error) {
      next(new CustomError('Failed to delete template', 500));
    }
  },
};
