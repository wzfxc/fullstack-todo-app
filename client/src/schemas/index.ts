import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const taskStatusEnum = z.enum(['todo', 'in progress', 'done']);

export const createTaskSchema = z.object({
  title: z.string().min(1, { message: 'Title must not be empty' }),
  description: z.string().optional(),
  status: taskStatusEnum.default('todo'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, { message: 'Title must not be empty' }).optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateTaskInput = z.output<typeof createTaskSchema>;
export type CreateTaskFormInput = z.input<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
