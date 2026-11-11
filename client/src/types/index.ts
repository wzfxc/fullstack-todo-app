export type TaskStatus = 'todo' | 'in progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
}

export interface ApiSuccess<T> {
  status: 'success';
  data: T;
}

export interface ApiError {
  status: 'error';
  message: string;
  validationErrors?: { field: string; message: string }[];
}

export interface ApiMessage {
  status: 'success';
  message: string;
}

