'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogOut, CheckSquare, Loader2 } from 'lucide-react';
import { useMe, useLogout } from '@/hooks/useAuth';
import { useGetTasks } from '@/hooks/useTasks';
import { TaskStatus } from '@/types';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import TaskFilters from '@/components/TaskFilters';
import Button from '@/components/ui/Button';

const VALID_STATUSES: TaskStatus[] = ['todo', 'in progress', 'done'];

function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');

  const activeStatus: TaskStatus | null =
    statusParam && statusParam !== 'all' && VALID_STATUSES.includes(statusParam as TaskStatus)
      ? (statusParam as TaskStatus)
      : null;

  const { data: user, isLoading: authLoading, isError: authError } = useMe();
  const { data: allTasks, isLoading: tasksLoading } = useGetTasks();
  const logout = useLogout();

  const tasks = activeStatus
    ? (allTasks ?? []).filter((task) => task.status === activeStatus)
    : allTasks;

  useEffect(() => {
    if (!authLoading && authError) {
      router.push('/login');
    }
  }, [authLoading, authError, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <CheckSquare className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-gray-900">Todo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:block">{user.email}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => logout.mutate()}
              isPending={logout.isPending}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-500">
            {tasks?.length ?? 0} task{tasks?.length !== 1 ? 's' : ''}
            {activeStatus ? ` · ${activeStatus}` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <TaskForm />

          <div>
            <TaskFilters />
          </div>

          {tasksLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : tasks && tasks.length > 0 ? (
            <div className="grid gap-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <CheckSquare className="mb-3 h-10 w-10 text-gray-300" />
              <p className="font-medium text-gray-500">No tasks here yet</p>
              <p className="mt-1 text-sm text-gray-400">Add your first task above</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <Dashboard />
    </Suspense>
  );
}
