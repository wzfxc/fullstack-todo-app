'use client';

import { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { Task, TaskStatus } from '@/types';
import { useUpdateTask, useDeleteTask, extractErrorMessage } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';
import Button from './ui/Button';

interface TaskCardProps {
  task: Task;
}

const statusConfig: Record<TaskStatus, { label: string; classes: string }> = {
  todo: { label: 'Todo', classes: 'bg-gray-100 text-gray-700' },
  'in progress': { label: 'In Progress', classes: 'bg-amber-100 text-amber-700' },
  done: { label: 'Done', classes: 'bg-green-100 text-green-700' },
};

const statusOptions: TaskStatus[] = ['todo', 'in progress', 'done'];

export default function TaskCard({ task }: TaskCardProps) {
  const [rollbackError, setRollbackError] = useState<string | null>(null);

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleStatusChange = (newStatus: TaskStatus) => {
    setRollbackError(null);
    updateTask.mutate(
      { id: task.id, data: { status: newStatus } },
      {
        onError: (err) => {
          setRollbackError(extractErrorMessage(err));
        },
      },
    );
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id);
  };

  const cfg = statusConfig[task.status];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="truncate font-medium text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          isPending={deleteTask.isPending}
          className="shrink-0 text-gray-400 hover:text-red-500"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.classes)}>
          {cfg.label}
        </span>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          disabled={updateTask.isPending}
          className="ml-auto rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {statusConfig[s].label}
            </option>
          ))}
        </select>
      </div>

      {rollbackError && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>Update failed and was rolled back: {rollbackError}</span>
        </div>
      )}
    </div>
  );
}

