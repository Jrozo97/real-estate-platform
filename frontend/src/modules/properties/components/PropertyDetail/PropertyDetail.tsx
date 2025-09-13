"use client";

import { useProperty } from "@/modules/properties/hooks";
import Link from "next/link";
import GalleryWithLightbox from "../GalleryWithLightbox/GalleryWithLightbox";
import { ArrowLeft } from "lucide-react";
import { currency } from "@/lib/utils";


export default function PropertyDetailClient({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useProperty(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <div className="h-52 w-full rounded-xl bg-slate-100 animate-pulse" />
        <div className="h-6 w-2/3 rounded bg-slate-100 animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-slate-100 animate-pulse" />
        <div className="h-32 w-full rounded bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <p className="text-red-600 font-medium">
          Error al cargar la propiedad{" "}
          {error?.message ? `: ${error.message}` : ""}
        </p>
        <Link
          href="/properties"
          className="text-blue-700 underline mt-3 inline-block"
        >
          ← Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 text-sm">
        <Link href="/" className="text-blue-700 hover:underline flex items-center gap-1">
          <ArrowLeft /> Volver a propiedades
        </Link>
      </div>

      <GalleryWithLightbox images={data.images} className="w-full" />

      {/* Información principal */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="text-slate-600">{data.address}</p>
          <div className="text-2xl font-semibold text-blue-700">
            {currency.format(data.price)}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="rounded-xl border p-3">
              <div className="text-slate-500">Código interno</div>
              <div className="font-medium">{data.codeInternal}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-slate-500">Año</div>
              <div className="font-medium">{data.year}</div>
            </div>
          </div>
        </div>

        {/* Owner */}
        <aside className="rounded-2xl border p-4 h-auto">
          <h2 className="font-semibold mb-3">Propietario</h2>
          <div className="flex items-center gap-3">
            {data.owner.photo && (
              <img
                src={data.owner.photo}
                alt={data.owner.name}
                className="h-16 w-16 rounded-full object-cover border"
              />
            )}
            <div>
              <div className="font-medium">{data.owner.name}</div>
              <div className="text-sm text-slate-600">{data.owner.address}</div>
              {data.owner.birthday && (
                <div className="text-xs text-slate-500">
                  Nacimiento:{" "}
                  {new Date(data.owner.birthday).toLocaleDateString("es-CO")}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Trazas / Historial */}
      {data.traces?.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold">Historial</h3>

          {/* Mobile: cards */}
          <div className="md:hidden space-y-3">
            {data.traces.map((t, i) => (
              <div
                key={t.id ?? `trace-${i}`}
                className="rounded-xl border p-4 grid grid-cols-2 gap-y-2 gap-x-3"
              >
                <div className="text-xs text-slate-500">Fecha</div>
                <div className="text-sm">
                  {new Date(t.dateSale).toLocaleDateString("es-CO")}
                </div>

                <div className="text-xs text-slate-500">Evento</div>
                <div className="text-sm">{t.name}</div>

                <div className="text-xs text-slate-500">Impuesto</div>
                <div className="text-sm">
                  {(t.tax * 100).toFixed(2)}%
                </div>

                <div className="text-xs text-slate-500">Valor</div>
                <div className="text-sm text-right md:text-left font-medium">
                  {currency.format(t.value)}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabla */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-2">Fecha</th>
                  <th className="text-left px-4 py-2">Evento</th>
                  <th className="text-right px-4 py-2">Valor</th>
                  <th className="text-right px-4 py-2">Impuesto</th>
                </tr>
              </thead>
              <tbody>
                {data.traces.map((t, i) => (
                  <tr key={t.id ?? `trace-${i}`} className="border-t">
                    <td className="px-4 py-2">
                      {new Date(t.dateSale).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-4 py-2">{t.name}</td>
                    <td className="px-4 py-2 text-right">
                      {currency.format(t.value)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {(t.tax * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {(!data.traces || data.traces.length === 0) && (
        <p className="text-sm text-slate-500">Sin historial disponible.</p>
      )}
    </div>
  );
}
