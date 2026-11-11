import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email format' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
});

export const registerSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email format' }),
  password: z.string().trim().min(6, { message: 'Password must be at least 6 characters' }),
});

const taskStatusEnum = z.enum(['todo', 'in progress', 'done']);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title must not be empty' })
    .max(255, { message: 'Maximum length is 255 characters' }),
  description: z
    .string()
    .trim()
    .max(255, { message: 'Maximum length is 255 characters' })
    .optional(),
  status: taskStatusEnum.default('todo'),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title must not be empty' })
    .max(255, { message: 'Maximum length is 255 characters' })
    .optional(),
  description: z
    .string()
    .trim()
    .max(255, { message: 'Maximum length is 255 characters' })
    .optional(),
  status: taskStatusEnum.optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateTaskInput = z.output<typeof createTaskSchema>;
export type CreateTaskFormInput = z.input<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
