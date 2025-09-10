'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function QueryClientProviderWrapper({ children }: PropsWithChildren) {
  // Un QueryClient por montaje del árbol del cliente
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,      // 1min: evita refetch innecesarios
            gcTime: 5 * 60_000,     // 5min: tiempo en cache
            refetchOnWindowFocus: false,
            retry: 1,               // baja la agresividad de reintentos
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
