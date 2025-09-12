"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import PropertyFilters, {
  PropertyFiltersValues,
} from "../PropertyFilters/PropertyFilters";

const SearchFilters = () => {
  const [filters, setFilters] = useState<PropertyFiltersValues>({
    name: "",
    address: "",
    price: [0, 100_000_000],
  });

  return (
    <div className="flex w-full gap-8">
      <div className="mb-6 w-full relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xl">
          🔍
        </span>
        <Input
          placeholder="Busca tu propiedad..."
          className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-sm
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               text-blue-950 placeholder-slate-400 transition-all"
          type="text"
        />
      </div>

      <PropertyFilters
        minPrice={0}
        maxPrice={500_000_000}
        step={50_000}
        defaultValues={filters}
        onChange={(v) => setFilters(v)}
        // onApply={(v) => fetchProperties(v)}
      />
    </div>
  );
};

export default SearchFilters;
