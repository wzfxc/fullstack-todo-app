import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { AuthenticatedRequest } from '../types';

const SALT_ROUNDS = 12;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as RegisterInput;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      res.status(400).json({ status: 'error', message: 'User with this email already exists' });
      return;
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ email, password: hashed });

    const secret = process.env.JWT_SECRET as string;
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'];
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn });

    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({ status: 'success', data: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET as string;
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'];
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn });

    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(200).json({ status: 'success', data: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

export const me = (req: Request, res: Response): void => {
  const user = (req as AuthenticatedRequest).user;
  res.status(200).json({ status: 'success', data: { id: user.id, email: user.email } });
};
