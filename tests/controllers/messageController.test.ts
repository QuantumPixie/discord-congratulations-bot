import { describe, it, expect, beforeEach, vi } from 'vitest';
import { messageController } from '../../src/controllers/messageController';
import { messageRepository } from '../../src/repositories/messageRepository';

vi.mock('../../src/repositories/messageRepository');

describe('Message Controller Tests', () => {
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

  it('should get all messages', async () => {
    vi.mocked(messageRepository.findAll).mockResolvedValue([]);

    await messageController.getAllMessages(req, res, next);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should get messages by username', async () => {
    req.body.username = '1'; // Ensure it's a string representing a number
    vi.mocked(messageRepository.findByUserId).mockResolvedValue([]);

    await messageController.getMessagesByUsername(req, res, next);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should get messages by sprint', async () => {
    req.body.sprint = '1'; // Ensure it's a string representing a number
    vi.mocked(messageRepository.findBySprintId).mockResolvedValue([]);

    await messageController.getMessagesBySprint(req, res, next);
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
