'use client';

import { Property } from '@/types/properties';
import Link from 'next/link';
// import type { Property } from '@/features/properties/types';

export default function PropertyCard({ p }: { p: Property }) {

  // del listado de imagenes, elegir la primera que este habilitada
  const mainImage = p.images.find(img => img.enabled === true || img.enabled === 'true');
  return (
    <Link
      href={`/properties/${p.id}`}
      className="group rounded-2xl border overflow-hidden hover:shadow-lg transition"
    >
      {mainImage && (
        <img
          src={mainImage.file}
          alt={p.name}
          className="h-44 w-full object-cover"
        />
      )}
      <div className="p-3">
        <h3 className="font-semibold group-hover:text-blue-700">{p.name}</h3>
        <p className="text-sm text-slate-600">{p.address}</p>
        <p className="mt-1 font-bold text-blue-700">
          ${p.price.toLocaleString('es-CO')}
        </p>
      </div>
    </Link>
  );
}
