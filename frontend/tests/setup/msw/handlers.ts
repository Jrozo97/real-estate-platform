import { http, HttpResponse } from "msw";

export const handlers = [
  // GET listado
  http.get("*/api/properties", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const name = url.searchParams.get("name") ?? "";
    const address = url.searchParams.get("address") ?? "";

    return HttpResponse.json({
      items: [
        {
          id: "P-001",
          name: "Casa San Martín" + (name ? ` ${name}` : ""),
          address: "Cra 15 #45-10, Bogotá " + address,
          price: 500000000,
          codeInternal: "C-001",
          year: 2017,
          owner: { id: "O-100", name: "Juan Pérez", address: "Bogotá", photo: "", birthday: "1990-01-01T00:00:00Z" },
          images: [{ id: "PI-001", file: "https://picsum.photos/seed/p-001a/800/600", enabled: true }],
          traces: [],
        },
      ],
      total: 1,
      page,
      pageSize: 12,
    });
  }),

  // POST búsqueda
  http.post("*/api/properties/search", async ({ request }: { request: any }) => {
    const body = await request.json().catch(() => ({}));
    const items =
      body?.address === "vacío"
        ? []
        : [
            {
              id: "P-003",
              name: "Lote Sur",
              address: "Av. 68 #45-10, Cali",
              price: 300000000,
              codeInternal: "C-003",
              year: 2015,
              owner: { id: "O-3", name: "María", address: "Cali", photo: "", birthday: "1992-03-03" },
              images: [{ id: "PI-3", file: "https://picsum.photos/seed/3/800/600", enabled: true }],
              traces: [],
            },
          ];

    return HttpResponse.json({
      items,
      page: body.page ?? 1,
      pageSize: body.pageSize ?? 12,
      total: items.length,
    });
  }),

  // GET detalle
  http.get("*/api/properties/:id", ({ params }) => {
    const id = String(params.id);
    return HttpResponse.json({
      id,
      name: "Casa San Martín",
      address: "Cra 15 #45-10, Bogotá",
      price: 450000000,
      codeInternal: "C-0001",
      year: 2017,
      owner: { id: "O-100", name: "Juan Pérez", address: "Bogotá", photo: "", birthday: "1985-03-10" },
      images: [{ id: "PI-001", file: "https://picsum.photos/seed/4/800/600", enabled: true }],
      traces: [],
    });
  }),
];
