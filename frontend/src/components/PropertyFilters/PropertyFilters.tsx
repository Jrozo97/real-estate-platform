import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Funnel } from 'lucide-react';
import { currency } from "@/lib/utils";
// Tipos de datos
export type PropertyFiltersValues = {
  address: string;
  price: [number, number] | undefined; // [min, max]
};

type Props = {
  minPrice?: number;
  maxPrice?: number;
  step?: number;
  defaultValues?: Partial<PropertyFiltersValues>;
  onApply?: (values: PropertyFiltersValues) => void; // ← sólo aplicamos manualmente
  className?: string;
};




export default function PropertyFilters({
  minPrice = 0,
  maxPrice = 300_000_000,
  step = 50_000,
  defaultValues,
  onApply,
  className,
}: Props) {
  const [address, setAddress] = React.useState(defaultValues?.address ?? "");

  const [price, setPrice] = React.useState<[number, number] | undefined>(() => {
    if (!defaultValues?.price) return undefined;
    const [min, max] = defaultValues.price;
    return [Math.max(minPrice, Math.min(min, max)), Math.max(min, Math.min(max, 9999999999))];
  });

  function resetFilters() {
    const clean = { address: "", price: undefined as [number, number] | undefined };
    setAddress(clean.address);
    setPrice([minPrice, maxPrice]);
    onApply?.(clean);
  }

  function handleApply() {
    onApply?.({ address, price: price ?? [minPrice, maxPrice] });
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filtros <Funnel /> </Button>
      </PopoverTrigger>

      <PopoverContent
        className={`grid gap-4 rounded-2xl border p-4 shadow-sm ${className ?? ""
          }`}
      >
        <div className="grid gap-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            placeholder="Buscar por dirección..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label>Rango de precio</Label>
            <span className="text-sm text-muted-foreground text-right">
              {currency.format(price ? price[0] : minPrice)} — {currency.format(price ? price[1] : maxPrice)}
            </span>
          </div>

          <Slider
            value={price}
            onValueChange={(val) => setPrice([val[0], val[1]])}
            min={minPrice}
            max={9999999999}
            step={step}
            minStepsBetweenThumbs={1}
          />

          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={price ? price[0] : minPrice}
              onChange={(e) => {
                const val = Number(e.target.value || 0);
                setPrice((prev) => {
                  const [_, max] = prev ?? [minPrice, maxPrice];
                  return [
                    Math.min(Math.max(minPrice, val), max),
                    max,
                  ];
                });
              }}
              aria-label="Precio mínimo"
            />
            <span className="text-muted-foreground">a</span>
            <Input
              type="number"
              value={price ? price[1] : maxPrice}
              onChange={(e) => {
                const val = Number(e.target.value || 0);
                setPrice((prev) => {
                  const [min] = prev ?? [minPrice, maxPrice];
                  return [
                    min,
                    Math.max(Math.min(maxPrice, val), min),
                  ];
                });
              }}
              aria-label="Precio máximo"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={resetFilters}>
            Limpiar
          </Button>
          <Button onClick={handleApply}>Aplicar</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Ejemplo de uso:
 *
 * const [filters, setFilters] = React.useState<PropertyFiltersValues>({
 *   name: "",
 *   address: "",
 *   price: [0, 100_000_000],
 * });
 *
 * <PropertyFilters
 *   minPrice={0}
 *   maxPrice={500_000_000}
 *   step={50_000}
 *   defaultValues={filters}
 *   onChange={(v) => setFilters(v)}
 *   onApply={(v) => fetchProperties(v)}
 * />
 *
 * // En tu lista, filtras por:
 * // - nombre incluye (case-insensitive)
 * // - dirección incluye
 * // - total >= price[0] && total <= price[1]
 */
