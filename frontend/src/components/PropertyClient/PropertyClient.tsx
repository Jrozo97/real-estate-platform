"use client";

import { useProperties } from "@/modules/properties/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SearchFilters from "../SearchFilters/SearchFilters";
import PropertyCard from "../PropertyCard/PropertyCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export default function PropertyClient() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [internalPage, setInternalPage] = useState(1);

  const isControlled = page !== undefined;

  const params = useMemo(
    () => ({ page, name, address, minPrice, maxPrice }),
    [page, name, address, minPrice, maxPrice]
  );

  const { data, isFetching } = useProperties(params);
  const pageSize = data?.pageSize ?? 10;
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));

  useEffect(() => {
    if (!isControlled && internalPage > totalPages) {
      setInternalPage(totalPages);
    }
  }, [totalPages, internalPage, isControlled]);

  const pushURL = (next: typeof params) => {
    const sp = new URLSearchParams();
    if (next.page > 1) sp.set("page", String(next.page));
    if (next.name) sp.set("name", next.name);
    if (next.address) sp.set("address", next.address);
    if (typeof next.minPrice === "number") sp.set("min", String(next.minPrice));
    if (typeof next.maxPrice === "number") sp.set("max", String(next.maxPrice));
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
    pushURL({
      page: 1,
      name: f.name,
      address: f.address,
      minPrice: f.minPrice,
      maxPrice: f.maxPrice,
    });
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

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const pagesToRender = getPageItems(page, totalPages);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 space-y-5">
      <h1 className="text-2xl font-bold">Propiedades</h1>

      <SearchFilters />

      {/* Grid responsivo */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-600">
        <Pagination>
          <PaginationContent className="text-xs flex-row">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  prev();
                }}
                className={`text-xs py-1.5 ${
                  page === 1 && "pointer-events-none opacity-50"
                }`}
                aria-disabled={page === 1}
                aria-label="Anterior"
                textButton="Anterior"
              />
            </PaginationItem>
            {pagesToRender.map((p, i) =>
              p === "ellipsis" ? (
                <PaginationItem key={`el-${i}`} className="size-5">
                  <PaginationEllipsis className="text-xs" />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(p);
                    }}
                    className={`text-xs size-auto py-1 px-2 ${
                      p === page &&
                      "size-auto py-1 px-2 rounded-[4px] bg-[#F9F9F9] border-[0.5px] border-slate-300"
                    }`}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  next();
                }}
                aria-disabled={page === totalPages}
                className={`text-xs py-1.5 ${
                  page === totalPages && "pointer-events-none opacity-50"
                }`}
                aria-label="Siguiente"
                textButton="Siguiente"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

function getPageItems(
  current: number,
  total: number
): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, 4, "ellipsis", total];
  if (current >= total - 2)
    return [1, "ellipsis", total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}
