import PropertyClient from "@/components/PropertyClient/PropertyClient";
import SearchFilters from "@/components/SearchFilters/SearchFilters";
import { qk } from "@/lib/queryKeys";
import { fetchProperties } from "@/modules/properties/api";
import { useProperties } from "@/modules/properties/hooks";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useMemo } from "react";

export default async function Home() {



  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-semibold text-black">Real estate</h1>
      <div className="w-full h-full px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-20 lg:py-12">
        <PropertyClient />

      </div>
    </div>
  );
}
