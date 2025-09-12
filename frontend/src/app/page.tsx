import PropertyClient from "@/components/PropertyClient/PropertyClient";
import SearchFilters from "@/components/SearchFilters/SearchFilters";
import { qk } from "@/lib/queryKeys";
import { fetchProperties } from "@/modules/properties/api";
import { useProperties } from "@/modules/properties/hooks";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams?: { page?: string; name?: string; address?: string; min?: string; max?: string };
}) {

  const page = Number(searchParams?.page ?? 1);
  const name = searchParams?.name ?? '';
  const address = searchParams?.address ?? '';
  const minPrice = searchParams?.min ? Number(searchParams.min) : undefined;
  const maxPrice = searchParams?.max ? Number(searchParams.max) : undefined;

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: qk.properties.list({ page, name, address, minPrice, maxPrice }),
    queryFn: () => fetchProperties({ page, name, address, minPrice, maxPrice }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>

      <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <h1 className="text-4xl font-semibold text-black">Real estate</h1>
        <div className="w-full h-full px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-20 lg:py-12">
          <PropertyClient
            initialPage={page}
            initialName={name}
            initialAddress={address}
            initialMin={minPrice}
            initialMax={maxPrice}
          />

        </div>
      </div>
    </HydrationBoundary>

  );
}
