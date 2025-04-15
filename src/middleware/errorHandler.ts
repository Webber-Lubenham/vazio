import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({ error: 'Not Found' });
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
}; 