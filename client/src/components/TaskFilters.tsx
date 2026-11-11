'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TaskStatus } from '@/types';

interface FilterOption {
  label: string;
  value: string;
}

const filters: FilterOption[] = [
  { label: 'All', value: '' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in progress' },
  { label: 'Done', value: 'done' },
];

export default function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('status') ?? '';

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => handleFilter(filter.value)}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1',
            current === filter.value
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

