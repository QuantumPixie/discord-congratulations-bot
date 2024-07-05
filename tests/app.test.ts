import request from 'supertest';
import express from 'express';
import { createServer } from 'http';
import { AddressInfo } from 'net';

const app = express();
app.use(express.json());

app.post('/api/complete-sprint', (req, res) => {
  // Your route handler logic
  res.status(200).send();
});

describe('App Tests', () => {
  let server: ReturnType<typeof createServer>;
  let port: number;

  beforeAll(async () => {
    server = createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        port = (server.address() as AddressInfo).port;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('should respond with 200 for POST /api/complete-sprint', async () => {
    const response = await request(server)
      .post('/api/complete-sprint')
      .send({ sprint_code: 'S1' });
    expect(response.status).toBe(200);
  });
});
