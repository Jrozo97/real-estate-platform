"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { DialogTitle } from "@radix-ui/react-dialog";

type Img = { id: string; file: string; enabled?: boolean };

type Props = {
  images: Img[];
  className?: string;
};

export default function GalleryWithLightbox({ images, className }: Props) {
  const imgs = images.length ? images : [{ id: "noimg", file: "/placeholder.svg" }];

  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi>();


  React.useEffect(() => {
    if (open && api) api.scrollTo(active, true);
  }, [open, active, api]);

  const main = imgs[active] ?? imgs[0];

  const k = (img: { id?: string; file: string }, i: number) =>
  img.id && img.id !== "null" && img.id !== "undefined" ? img.id : `${i}-${img.file}`;

  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-3">
        {/* Imagen grande */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="col-span-2 group relative rounded-xl overflow-hidden"
              onClick={() => setOpen(true)}
            >
              <img
                src={main.file}
                alt={main.id}
                className="h-[380px] w-full object-cover rounded-xl transition group-hover:scale-[1.02] duration-200 border-none"
              />
              <span className="absolute bottom-2 right-2 text-xs rounded bg-black/60 text-white px-2 py-1">
                Ver fotos
              </span>
            </button>
          </DialogTrigger>

          <DialogHeader className="hidden">
            <DialogTitle>Fotos de la propiedad</DialogTitle>
          </DialogHeader>

          <DialogContent className="max-w-5xl w-[95vw] p-0">
            <div className="relative">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {imgs.map((img, i) => (
                    <CarouselItem key={k(img, i)} className="flex items-center justify-center">
                      <img
                        src={img.file}
                        alt={img.id}
                        className="max-h-[80vh] w-auto object-contain rounded-lg"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {imgs.map((img, i) => (
                  <button
                    key={k(img, i)}
                    onClick={() => setActive(i)}
                    className={`h-2 w-2 rounded-full ${
                      i === active ? "bg-white" : "bg-white/40"
                    }`}
                    aria-label={`Ir a imagen ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Miniaturas a la derecha */}
        <div className="col-span-1 grid grid-rows-3 gap-3">
          {imgs.slice(0, 3).map((img, i) => (
            <button
              key={k(img, i)}
              onClick={() => setActive(i)}
              className={`relative rounded-xl overflow-hidden border focus:outline-none focus:ring-2 focus:ring-blue-500 `}
            >
              <img
                src={img.file}
                alt=""
                className="h-[120px] w-full object-cover"
              />
            </button>
          ))}

          {/* Si hay más imágenes, muestra un botón “+N” para abrir el modal */}
          {imgs.length > 3 && (
            <Button
              variant="secondary"
              className="h-[120px] w-full rounded-xl"
              onClick={() => setOpen(true)}
            >
              Ver {imgs.length - 3}+ fotos
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
