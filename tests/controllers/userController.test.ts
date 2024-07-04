import request from 'supertest';
import { app } from '../../app';
import { userRepository } from '../../src/repositories/userRepository';

jest.mock('../../src/repositories/userRepository');

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a user and return 200 status', async () => {
    const mockUser = { id: 1, user_name: 'john_doe_updated' };
    (userRepository.update as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app)
      .put('/api/users/1')
      .send({ user_name: 'john_doe_updated' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User updated successfully' });
    expect(userRepository.update).toHaveBeenCalledWith(1, {
      user_name: 'john_doe_updated',
    });
  });

  it('should return 400 if request is invalid', async () => {
    const response = await request(app)
      .put('/api/users/1')
      .send({ invalid_field: 'value' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid request' });
  });
});
