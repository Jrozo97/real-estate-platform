'use client';

import { useQuery } from '@tanstack/react-query';
import { qk } from '@/lib/queryKeys';
import { fetchProperties, fetchPropertyById } from './api';
import type { ListParams } from '@/types/properties';

export function useProperties(params: ListParams) {
  return useQuery({
    queryKey: qk.properties.list(params),
    queryFn: () => fetchProperties(params),
    // Mantén la página previa visible mientras carga la nueva
    placeholderData: (prev) => prev,
    select: (data) => ({
      ...data,
      hasMore: data.page * data.pageSize < data.total,
    }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: qk.properties.detail(id),
    queryFn: () => fetchPropertyById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
