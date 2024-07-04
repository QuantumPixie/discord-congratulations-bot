import request from 'supertest';
import { app } from '../app';

describe('App Tests', () => {
  it('should respond with 200 for POST /api/complete-sprint', async () => {
    const response = await request(app)
      .post('/api/complete-sprint')
      .send({ sprint_code: 'S1' });

    expect(response.status).toBe(200);
  });
});
