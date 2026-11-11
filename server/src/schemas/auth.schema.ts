import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email format' }),
  password: z.string().trim().min(6, { message: 'Password must be at least 6 characters' }),
});

export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email format' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
