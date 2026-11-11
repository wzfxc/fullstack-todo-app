'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { createTaskSchema, CreateTaskInput, CreateTaskFormInput } from '@/schemas';
import { useCreateTask, extractErrorMessage } from '@/hooks/useTasks';
import Button from './ui/Button';
import Input from './ui/Input';

export default function TaskForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormInput, unknown, CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: '', description: '', status: 'todo' },
  });

  const createTask = useCreateTask();

  const onSubmit = (data: CreateTaskInput) => {
    createTask.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-sm font-semibold text-gray-900">Add New Task</h2>

      <div className="flex flex-col gap-3">
        <Input
          id="title"
          label="Title"
          placeholder="What needs to be done?"
          error={errors.title?.message}
          {...register('title')}
        />

        <Input
          id="description"
          label="Description (optional)"
          placeholder="Add more details…"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="todo">Todo</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {createTask.isError && (
          <p className="text-xs text-red-600">{extractErrorMessage(createTask.error)}</p>
        )}

        <Button type="submit" isPending={createTask.isPending} className="mt-1 self-start">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>
    </form>
  );
}
