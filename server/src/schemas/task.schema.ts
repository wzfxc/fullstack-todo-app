import { z } from 'zod';

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
  status: taskStatusEnum.optional().default('todo'),
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

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
