import { z } from 'zod';

const taskStatusEnum = z.enum(['todo', 'in progress', 'done']);

export const createTaskSchema = z.object({
  title: z.string().min(1, { message: 'Title must not be empty' }),
  description: z.string().optional(),
  status: taskStatusEnum.optional().default('todo'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, { message: 'Title must not be empty' }).optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

