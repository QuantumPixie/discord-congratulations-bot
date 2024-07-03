import { Request, Response, NextFunction } from 'express';
import { createAndSendMessage } from '../services/messageService';
import { messageRepository } from '../repositories/messageRepository';
import {
  BadRequestError,
  NotFoundError,
  CustomError,
} from '../utils/errors/CustomError';

export const messageController = {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    const { username, sprintCode } = req.body;
    try {
      if (!username || !sprintCode) {
        throw new BadRequestError('Username and sprint code are required');
      }
      await createAndSendMessage(username, sprintCode);
      res.status(201).json({ message: 'Congratulatory message sent!' });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      if (error instanceof NotFoundError) {
        next(new NotFoundError(error.message));
      } else if (error instanceof BadRequestError) {
        next(new BadRequestError(error.message));
      } else {
        next(new CustomError('Failed to send congratulatory message', 500));
      }
    }
  },

  async getAllMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await messageRepository.findAll();
      res.json(messages);
    } catch (error) {
      next(new CustomError('Failed to fetch messages', 500));
    }
  },

  async getMessagesByUsername(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body;
    try {
      const messages = await messageRepository.findByUserId(Number(username));
      res.json(messages);
    } catch (error) {
      next(new CustomError('Failed to fetch messages', 500));
    }
  },

  async getMessagesBySprint(req: Request, res: Response, next: NextFunction) {
    const { sprint } = req.body;
    try {
      const messages = await messageRepository.findBySprintId(Number(sprint));
      res.json(messages);
    } catch (error) {
      next(new CustomError('Failed to fetch messages', 500));
    }
  },
};
