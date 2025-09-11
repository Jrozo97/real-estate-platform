export const qk = {
  properties: {
    all: ["properties"] as const,
    list: (params: {
      page: number;
      name?: string;
      address?: string;
      minPrice?: number;
      maxPrice?: number;
    }) => [...qk.properties.all, "list", params] as const,
    detail: (id: string) => [...qk.properties.all, "detail", id] as const,
  },
};
