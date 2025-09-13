// src/modules/properties/components/PropertyCardSkeleton.tsx
"use client";

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-3">
      <div className="aspect-[4/3] w-full rounded-lg bg-slate-100 animate-pulse" />
      <div className="mt-3 h-4 w-3/4 rounded bg-slate-100 animate-pulse" />
      <div className="mt-2 h-3 w-1/2 rounded bg-slate-100 animate-pulse" />
      <div className="mt-4 h-8 w-full rounded bg-slate-100 animate-pulse" />
    </div>
  );
}
