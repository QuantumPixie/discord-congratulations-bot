import {
  getAllMessages,
  getMessagesByUsername,
  getMessagesBySprint,
} from '../../src/controllers/messageController';
import { messageRepository } from '../../src/repositories/messageRepository';

jest.mock('../../src/repositories/messageRepository');

describe('Message Controller Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should get all messages', async () => {
    (messageRepository.findAll as jest.Mock).mockResolvedValue([]);

    await getAllMessages(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should get messages by username', async () => {
    req.query.username = 'john_doe';
    (messageRepository.findByUsername as jest.Mock).mockResolvedValue([]);

    await getMessagesByUsername(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should get messages by sprint', async () => {
    req.query.sprint = 'S1';
    (messageRepository.findBySprint as jest.Mock).mockResolvedValue([]);

    await getMessagesBySprint(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
