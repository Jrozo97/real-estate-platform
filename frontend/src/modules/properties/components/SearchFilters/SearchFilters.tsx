"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import PropertyFilters, {
  PropertyFiltersValues,
} from "../PropertyFilters/PropertyFilters";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";

type Props = {
  onChange: (f: {
    name?: string;
    address?: string;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
  }) => void;
};

const SearchFilters = ({ onChange }: Props) => {
  const [name, setName] = useState("");
  const [filters, setFilters] = useState<PropertyFiltersValues>({
    address: "",
    price: [0, 100_000_000],
  });

  const debouncedName = useDebounce(name, 300);

  useEffect(() => {
    onChange?.({ name: debouncedName });
  }, [debouncedName]);

  const handlePopoverApply = (v: PropertyFiltersValues) => {
    setFilters(v);
    const [min, max] = v.price || [undefined, undefined];
    onChange({
      address: v.address || undefined,
      minPrice: v.price ? v.price[0] : undefined,
      maxPrice: v.price ? v.price[1] : undefined,
    });
    console.log("[SearchFilters] apply -> parent onChange", {
      address: v.address,
      min,
      max,
    });
  };

  return (
    <div className="flex w-full  md:flex-row md:gap-8 gap-3 flex-col">
      <div className="w-full relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xl">
          <Search className="text-blue-900"/>
        </span>
        <Input
          placeholder="Busca tu propiedad..."
          className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-sm
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               text-blue-950 placeholder-slate-400 transition-all"
          type="text"
          value={name}
          aria-label="Buscar propiedad por nombre"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <PropertyFilters
        minPrice={0}
        maxPrice={300_000_000}
        step={1_000_000}
        defaultValues={filters}
        onApply={handlePopoverApply}
      />
    </div>
  );
};

export default SearchFilters;
