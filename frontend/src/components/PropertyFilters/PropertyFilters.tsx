import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Funnel } from 'lucide-react';
// Tipos de datos
export type PropertyFiltersValues = {
  name: string;
  address: string;
  price: [number, number]; // [min, max]
};

type Props = {
  /** Precio mínimo absoluto disponible en el dataset */
  minPrice?: number;
  /** Precio máximo absoluto disponible en el dataset */
  maxPrice?: number;
  /** Paso del slider (por defecto 50.000) */
  step?: number;
  /** Valores iniciales del filtro */
  defaultValues?: Partial<PropertyFiltersValues>;
  /** Callback (debounced) cuando cambian los filtros */
  onChange?: (values: PropertyFiltersValues) => void;
  /** Callback explícito al pulsar "Aplicar" */
  onApply?: (values: PropertyFiltersValues) => void;
  /** ms para el debounce de inputs de texto */
  debounceMs?: number;
  className?: string;
};

// Hook simple de debounce
function useDebounced<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debouncedValue;
}

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function PropertyFilters({
  minPrice = 0,
  maxPrice = 100_000_000,
  step = 50_000,
  defaultValues,
  onChange,
  onApply,
  debounceMs = 300,
  className,
}: Props) {
  const [name, setName] = React.useState(defaultValues?.name ?? "");
  const [address, setAddress] = React.useState(defaultValues?.address ?? "");
  const [price, setPrice] = React.useState<[number, number]>([
    defaultValues?.price?.[0] ?? minPrice,
    defaultValues?.price?.[1] ?? maxPrice,
  ]);

  // Valores debounced para inputs de texto
  const debouncedName = useDebounced(name, debounceMs);
  const debouncedAddress = useDebounced(address, debounceMs);

  // Emitimos cambios (debounced) cuando cambien los campos
  React.useEffect(() => {
    onChange?.({ name: debouncedName, address: debouncedAddress, price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName, debouncedAddress, price]);

  function resetFilters() {
    setName("");
    setAddress("");
    setPrice([minPrice, maxPrice]);
    onChange?.({ name: "", address: "", price: [minPrice, maxPrice] });
  }

  function handleApply() {
    onApply?.({ name, address, price });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filtros <Funnel /> </Button>
      </PopoverTrigger>

      <PopoverContent
        className={`grid gap-4 rounded-2xl border p-4 shadow-sm ${
          className ?? ""
        }`}
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            placeholder="Buscar por nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
              {currency.format(price[0])} — {currency.format(price[1])}
            </span>
          </div>

          <Slider
            value={[price[0], price[1]]}
            onValueChange={(val) => {
              // Radix Slider entrega number[]
              const [min, max] = val as number[];
              setPrice([min, max]);
            }}
            min={minPrice}
            max={maxPrice}
            step={step}
            minStepsBetweenThumbs={Math.max(
              1,
              Math.floor(step / Math.max(1, step))
            )}
          />

          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={price[0]}
              onChange={(e) => {
                const val = Number(e.target.value || 0);
                setPrice(([_, max]) => [
                  Math.min(Math.max(minPrice, val), max),
                  max,
                ]);
              }}
              aria-label="Precio mínimo"
            />
            <span className="text-muted-foreground">a</span>
            <Input
              type="number"
              value={price[1]}
              onChange={(e) => {
                const val = Number(e.target.value || 0);
                setPrice(([min, _]) => [
                  min,
                  Math.max(Math.min(maxPrice, val), min),
                ]);
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
