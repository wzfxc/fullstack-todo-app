'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '@/lib/axios';
import { CreateTaskInput, UpdateTaskInput } from '@/schemas';
import { ApiSuccess, ApiMessage, Task, TaskStatus } from '@/types';

export const TASKS_KEY = ['tasks'] as const;

export function useGetTasks(status?: TaskStatus | null) {
  return useQuery<Task[]>({
    queryKey: status ? [...TASKS_KEY, status] : TASKS_KEY,
    queryFn: async () => {
      const params = status ? { status } : {};
      const res = await api.get<ApiSuccess<Task[]>>('/tasks', { params });
      return res.data.data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskInput>({
    mutationFn: async (data) => {
      const res = await api.post<ApiSuccess<Task>>('/tasks', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

interface UpdateTaskVars {
  id: string;
  data: UpdateTaskInput;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskVars, { previousTasks: Task[] | undefined }>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put<ApiSuccess<Task>>(`/tasks/${id}`, data);
      return res.data.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_KEY);

      queryClient.setQueryData<Task[]>(TASKS_KEY, (old = []) =>
        old.map((task) =>
          task.id === id
            ? {
                ...task,
                ...data,
                status: data.status ?? task.status,
                title: data.title ?? task.title,
                description: data.description !== undefined ? data.description : task.description,
              }
            : task,
        ),
      );

      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(TASKS_KEY, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation<ApiMessage, Error, string>({
    mutationFn: async (id) => {
      const res = await api.delete<ApiMessage>(`/tasks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? 'Something went wrong';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

