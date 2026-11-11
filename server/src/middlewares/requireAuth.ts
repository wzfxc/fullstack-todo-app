import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { AuthenticatedRequest, AuthTokenPayload } from '../types';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    res.status(401).json({ status: 'error', message: 'Unauthorized: no token provided' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthTokenPayload;
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ status: 'error', message: 'Unauthorized: token has expired' });
      return;
    }
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ status: 'error', message: 'Unauthorized: invalid token' });
      return;
    }
    next(err);
  }
};

