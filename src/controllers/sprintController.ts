import { Request, Response, NextFunction } from 'express';
import {
  sprintRepository,
  PartialSprint,
} from '../repositories/sprintRepository';
import { parseInsertable, parseUpdatable } from '../schemas/sprintSchema';
import {
  BadRequestError,
  NotFoundError,
  CustomError,
} from '../utils/errors/CustomError';
import { z } from 'zod';

export const sprintController = {
  async createSprint(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = parseInsertable(req.body);
      await sprintRepository.create(validatedData);
      res.status(201).json({ message: 'Sprint created successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new BadRequestError('Invalid request'));
      } else {
        next(new CustomError('Failed to create sprint', 500));
      }
    }
  },

  async getAllSprints(req: Request, res: Response, next: NextFunction) {
    try {
      const sprints = await sprintRepository.findAll();
      res.json(sprints);
    } catch (error) {
      next(new CustomError('Failed to fetch sprints', 500));
    }
  },

  async updateSprint(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const validatedData = parseUpdatable(req.body) as PartialSprint;
      const result = await sprintRepository.update(id, validatedData);
      if (result) {
        res.status(200).json({ message: 'Sprint updated successfully' });
      } else {
        next(new NotFoundError('Sprint not found'));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new BadRequestError('Invalid request'));
      } else {
        next(new CustomError('Failed to update sprint', 500));
      }
    }
  },

  async deleteSprint(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await sprintRepository.delete(id);
      if (result) {
        res.status(200).json({ message: 'Sprint deleted successfully' });
      } else {
        next(new NotFoundError('Sprint not found'));
      }
    } catch (error) {
      next(new CustomError('Failed to delete sprint', 500));
    }
  },
};
