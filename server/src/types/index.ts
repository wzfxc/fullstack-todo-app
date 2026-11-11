import { Request } from 'express';

export interface AuthTokenPayload {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthTokenPayload;
}

