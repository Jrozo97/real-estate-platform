'use client';

import { Property } from '@/modules/properties/types/properties';
import Link from 'next/link';


export default function PropertyCard({ p }: { p: Property }) {

  
  const mainImage = p.images.find(img => img.enabled === true);

  return (
    <Link
      href={`/properties/${p.id}`}
      className="group rounded-2xl border overflow-hidden hover:shadow-lg transition"
      data-testid="property-card"
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
