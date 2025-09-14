import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover";
import { Funnel } from "lucide-react";
import { currency } from "@/lib/utils";

// Tipos de datos
export type PropertyFiltersValues = {
  address: string;
  price: [number, number] | undefined;
};

type Props = {
  minPrice?: number;
  maxPrice?: number;
  step?: number;
  defaultValues?: Partial<PropertyFiltersValues>;
  onApply?: (values: PropertyFiltersValues) => void; 
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

  const [price, setPrice] = React.useState<[number, number] | undefined>();

  function resetFilters() {
    const clean: PropertyFiltersValues = {
      address: "",
      price: [minPrice, maxPrice],
    };
    setAddress(clean.address);
    setPrice(clean.price);
    onApply?.(clean);
  }

  function handleApply() {
    onApply?.({
      address,
      price: price ? price : [minPrice, maxPrice],
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" data-testid="filters-open">
          Filtros <Funnel />{" "}
        </Button>
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
            data-testid="filters-address"
          />
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label>Rango de precio</Label>
            <span className="text-sm text-muted-foreground text-right">
              {currency.format(price ? price[0] : minPrice)} —{" "}
              {currency.format(price ? price[1] : maxPrice)}
            </span>
          </div>

          <Slider
            value={price ?? [minPrice, maxPrice]}
            onValueChange={(val) => setPrice([val[0], val[1]])}
            min={minPrice}
            max={maxPrice}
            step={step}
            minStepsBetweenThumbs={1}
          />

          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={price ? price[0] : minPrice}
              placeholder={minPrice.toString()}
              onChange={(e) => {
                const val = Number(e.target.value || 0);
                setPrice((prev) => {
                  const [_, max] = prev ?? [minPrice, maxPrice];
                  return [Math.min(Math.max(minPrice, val), max), max];
                });
              }}
              aria-label="Precio mínimo"
              data-testid="filters-price-min"
            />
            <span className="text-muted-foreground">a</span>
            <Input
              // type="number"
              value={price ? price[1] : maxPrice}
              placeholder={maxPrice.toString()}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (isNaN(val)) {
                  setPrice(undefined);
                } else {
                  setPrice((prev) => {
                    const [min] = prev ?? [minPrice, maxPrice];
                    return [min, val];  
                  });
                }
              }}
              aria-label="Precio máximo"
              data-testid="filters-price-max"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={resetFilters}
            data-testid="filters-clear"
          >
            Limpiar
          </Button>
          <Button onClick={handleApply} data-testid="filters-apply">
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
