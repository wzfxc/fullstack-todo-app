'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useRef } from 'react';

let clientSideQueryClient: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return new QueryClient({
      defaultOptions: { queries: { staleTime: 60 * 1000, retry: false } },
    });
  }
  if (!clientSideQueryClient) {
    clientSideQueryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: 60 * 1000, retry: false } },
    });
  }
  return clientSideQueryClient;
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000, retry: false } },
      }),
  );

  const ref = useRef<QueryClient>(queryClient);
  clientSideQueryClient = ref.current;

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

