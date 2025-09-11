import { api } from '@/lib/axios';
import { ListParams, Paginated, Property } from '@/types/properties';


export async function fetchProperties(params: ListParams) {
  const res = await api.get<Paginated<Property>>('/properties', {
    params: {
      page: params.page,
      pageSize: 12,
      name: params.name || undefined,
      address: params.address || undefined,
      minPrice: params.minPrice ?? undefined,
      maxPrice: params.maxPrice ?? undefined,
    },
  });
  return res.data;
}

export async function fetchPropertyById(id: string) {
  const res = await api.get<Property>(`/properties/${id}`);
  return res.data;
}
