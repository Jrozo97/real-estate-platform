'use client';

import { useProperties } from '@/modules/properties/hooks';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import SearchFilters from '../SearchFilters/SearchFilters';
import PropertyCard from '../PropertyCard/PropertyCard';
// import { useProperties } from '@/features/properties/hooks';
// import Filters from './_components/Filters';
// import PropertyCard from './_components/PropertyCard';

export default function PropertyClient({
  initialPage,
  initialName,
  initialAddress,
  initialMin,
  initialMax,
}: {
  initialPage: number;
  initialName: string;
  initialAddress: string;
  initialMin?: number;
  initialMax?: number;
}) {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [name, setName] = useState(initialName);
  const [address, setAddress] = useState(initialAddress);
  const [minPrice, setMinPrice] = useState<number | undefined>(initialMin);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialMax);

  const params = useMemo(
    () => ({ page, name, address, minPrice, maxPrice }),
    [page, name, address, minPrice, maxPrice]
  );

  const { data, isFetching } = useProperties(params);

  const pushURL = (next: typeof params) => {
    const sp = new URLSearchParams();
    if (next.page > 1) sp.set('page', String(next.page));
    if (next.name) sp.set('name', next.name);
    if (next.address) sp.set('address', next.address);
    if (typeof next.minPrice === 'number') sp.set('min', String(next.minPrice));
    if (typeof next.maxPrice === 'number') sp.set('max', String(next.maxPrice));
    router.replace(`/properties?${sp.toString()}`);
  };

  const onFiltersChange = (f: {
    name: string;
    address: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setPage(1);
    setName(f.name);
    setAddress(f.address);
    setMinPrice(f.minPrice);
    setMaxPrice(f.maxPrice);
    pushURL({ page: 1, name: f.name, address: f.address, minPrice: f.minPrice, maxPrice: f.maxPrice });
  };

  const prev = () => {
    const p = Math.max(1, page - 1);
    setPage(p);
  };
  const next = () => {
    if (!data?.hasMore) return;
    const p = page + 1;
    setPage(p);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 space-y-5">
      <h1 className="text-2xl font-bold">Propiedades</h1>

      <SearchFilters  />

      {/* Grid responsivo */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((p) => <PropertyCard key={p.id} p={p} />)}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between pt-2">
        <button
          className="px-3 py-2 border rounded disabled:opacity-50"
          onClick={prev}
          disabled={page <= 1 || isFetching}
        >
          ← Anterior
        </button>
        <span className="text-sm">
          Página {data?.page ?? page} {isFetching && <em className="opacity-60">actualizando…</em>}
        </span>
        <button
          className="px-3 py-2 border rounded disabled:opacity-50"
          onClick={next}
          disabled={!data?.hasMore || isFetching}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
