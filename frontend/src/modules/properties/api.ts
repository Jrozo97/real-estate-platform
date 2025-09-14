import { api } from '@/lib/axios';
import { ListParams, Paginated, PropertiesMeta, Property } from '@/modules/properties/types/properties';


export async function fetchPropertiesGet(params: ListParams) {
  const res = await api.get<Paginated<Property>>('/api/properties', {
    params: {
      page: params.page,
      pageSize: params.pageSize ?? 12,
      name: params.name || undefined,
      address: params.address || undefined,
      minPrice: params.minPrice ?? undefined,
      maxPrice: params.maxPrice ?? undefined,
      sort: params.sort ?? undefined,
    },
  });
  return res.data;
}


export async function fetchPropertiesPost(params: ListParams) {
  const body = {
    name: params.name || undefined,
    address: params.address || undefined,
    minPrice: params.minPrice ?? undefined,
    maxPrice: params.maxPrice ?? undefined,
    page: params.page,
    pageSize: params.pageSize ?? 12,
    sort: params.sort ?? undefined,
  };

  const res = await api.post<Paginated<Property>>('/api/properties/search', body);
  return res.data;
}

export async function fetchPropertyById(id: string) {
  const res = await api.get<Property>(`/api/properties/${id}`);
  return res.data;
}

export async function fetchPropertiesMeta() {
  const res = await api.get<PropertiesMeta>('/api/properties/meta');
  return res.data;
}