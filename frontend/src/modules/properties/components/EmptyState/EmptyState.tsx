
"use client";

import { SearchX } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  onReset?: () => void;
};

export default function EmptyState({
  title = "Sin coincidencias",
  description = "No encontramos propiedades que coincidan con tu búsqueda.",
  onReset,
}: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center text-center gap-3 rounded-2xl border border-dashed p-10 bg-white"
    >
      <div className="rounded-full border p-3">
        <SearchX className="size-6 text-slate-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="max-w-md text-sm text-slate-600">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-1 inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
