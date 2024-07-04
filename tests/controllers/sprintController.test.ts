import request from 'supertest';
import { app } from '../../app';
import { sprintRepository } from '../../src/repositories/sprintRepository';

jest.mock('../../src/repositories/sprintRepository');

describe('Sprint Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a sprint and return 201 status', async () => {
    const mockSprint = { id: 1, sprint_code: 'S1', sprint_name: 'Sprint 1' };
    (sprintRepository.create as jest.Mock).mockResolvedValue(mockSprint);

    const response = await request(app)
      .post('/api/sprints')
      .send({ sprint_code: 'S1', sprint_name: 'Sprint 1' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockSprint);
    expect(sprintRepository.create).toHaveBeenCalledWith({
      sprint_code: 'S1',
      sprint_name: 'Sprint 1',
    });
  });

  it('should return 400 if request is invalid', async () => {
    const response = await request(app)
      .post('/api/sprints')
      .send({ invalid_field: 'value' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid request' });
  });
});
