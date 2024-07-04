import request from 'supertest';
import { app } from '../../app';

describe('Template Controller', () => {
  it('should create a template and return 201 status', async () => {
    const response = await request(app)
      .post('/api/templates')
      .send({ message_template: 'Hello {username}!' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        message_template: 'Hello {username}!',
      })
    );
  });

  it('should return 400 if request is invalid', async () => {
    const response = await request(app)
      .post('/api/templates')
      .send({ invalid_field: 'value' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid request' });
  });
});
