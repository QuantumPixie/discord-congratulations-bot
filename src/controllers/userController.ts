import { Request, Response, NextFunction } from 'express';
import { parseInsertable, parseUpdatable } from '../schemas/userSchema';
import { userRepository } from '../repositories/userRepository';
import {
  BadRequestError,
  NotFoundError,
  CustomError,
} from '../utils/errors/CustomError';
import { z } from 'zod';

export const userController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = parseInsertable(req.body);
      await userRepository.create({
        ...validatedData,
        user_name: validatedData.username, // Map to correct field name
      });
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new BadRequestError('Invalid request'));
      } else {
        next(new CustomError('Failed to create user', 500));
      }
    }
  },

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userRepository.findAll();
      res.json(users);
    } catch (error) {
      next(new CustomError('Failed to fetch users', 500));
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id); // Ensure `id` is correctly typed
      const validatedData = parseUpdatable({
        ...req.body,
        id,
      });
      const result = await userRepository.update(id, {
        ...validatedData,
        user_name: validatedData.username, // Map to correct field name
      });
      if (result) {
        res.status(200).json({ message: 'User updated successfully' });
      } else {
        next(new NotFoundError('User not found'));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new BadRequestError('Invalid request'));
      } else {
        next(new CustomError('Failed to update user', 500));
      }
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await userRepository.delete(id);
      if (result) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        next(new NotFoundError('User not found'));
      }
    } catch (error) {
      next(new CustomError('Failed to delete user', 500));
    }
  },
};
