'use client';

import { useQuery } from '@tanstack/react-query';
import { qk } from '@/lib/queryKeys';
import { fetchPropertiesGet, fetchPropertiesPost, fetchPropertyById } from './api';
import type { ListParams } from '@/modules/properties/types/properties';


export function useProperties(params: ListParams, mode: 'get' | 'post' = 'post') {
  return useQuery({
    queryKey: qk.properties.list({ ...params, mode }),  
    queryFn: () => mode === 'get'
      ? fetchPropertiesGet(params)
      : fetchPropertiesPost(params),
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
