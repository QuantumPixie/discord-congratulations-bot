import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userController } from '../../src/controllers/userController';
import { userRepository } from '../../src/repositories/userRepository';
import { parseInsertable, parseUpdatable } from '../../src/schemas/userSchema';
import {
  BadRequestError,
  NotFoundError,
  CustomError,
} from '../../src/utils/errors/CustomError';
import { z } from 'zod';

vi.mock('../../src/repositories/userRepository');
vi.mock('../../src/schemas/userSchema');

describe('User Controller Tests', () => {
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

  it('should create a user', async () => {
    const validatedData = { username: 'john_doe' };
    vi.mocked(parseInsertable).mockReturnValue(validatedData);
    vi.mocked(userRepository.create).mockResolvedValue({
      id: 1,
      user_name: 'john_doe',
    });

    req.body = { username: 'john_doe' };

    await userController.createUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: { id: 1, user_name: 'john_doe' },
    });
  });

  it('should handle validation error during user creation', async () => {
    const validationError = new BadRequestError('Invalid request');
    vi.mocked(parseInsertable).mockImplementation(() => {
      throw new z.ZodError([]);
    });

    req.body = { username: '' }; // Invalid data

    await userController.createUser(req, res, next);
    expect(next).toHaveBeenCalledWith(validationError);
  });

  it('should get all users', async () => {
    const users = [{ id: 1, user_name: 'john_doe' }];
    vi.mocked(userRepository.findAll).mockResolvedValue(users);

    await userController.getAllUsers(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it('should update a user', async () => {
    const validatedData = { id: 1, username: 'john_doe' };
    vi.mocked(parseUpdatable).mockReturnValue(validatedData);
    vi.mocked(userRepository.update).mockResolvedValue(true);

    req.params.id = '1';
    req.body = { username: 'john_doe' };

    await userController.updateUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User updated successfully',
    });
  });

  it('should handle not found error during user update', async () => {
    const validatedData = { id: 1, username: 'john_doe' };
    vi.mocked(parseUpdatable).mockReturnValue(validatedData);
    vi.mocked(userRepository.update).mockResolvedValue(false);

    req.params.id = '1';
    req.body = { username: 'john_doe' };

    await userController.updateUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new NotFoundError('User not found'));
  });

  it('should delete a user', async () => {
    vi.mocked(userRepository.delete).mockResolvedValue(true);

    req.params.id = '1';

    await userController.deleteUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User deleted successfully',
    });
  });

  it('should handle not found error during user deletion', async () => {
    vi.mocked(userRepository.delete).mockResolvedValue(false);

    req.params.id = '1';

    await userController.deleteUser(req, res, next);
    expect(next).toHaveBeenCalledWith(new NotFoundError('User not found'));
  });
});
