import { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { CustomError } from '../utils/errors/CustomError';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  // check if error is instance of CustomError
  const statusCode =
    err instanceof CustomError
      ? err.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;
  const message =
    err instanceof CustomError
      ? err.message
      : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);

  res.status(statusCode).json({ error: message });
}
