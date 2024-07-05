import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../src/middleware/errorHandler';
import { CustomError } from '../../src/utils/errors/CustomError';

describe('Middleware Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn() as unknown as NextFunction;
  });

  it('should handle known errors and send the correct response', () => {
    const err = new CustomError('Bad Request', 400);
    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Bad Request' });
  });

  it('should handle unknown errors and send a 500 response', () => {
    const err = new Error('Unknown error');
    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
