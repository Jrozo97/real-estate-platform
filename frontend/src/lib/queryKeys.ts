// queryKeys.ts
import type { ListParams } from "@/modules/properties/types/properties";

type ListKeyParams = ListParams & { mode?: "get" | "post" };

export const qk = {
  properties: {
    all: ["properties"] as const,
    list: (params: ListKeyParams) =>
      [...qk.properties.all, "list", params] as const,
    detail: (id: string) =>
      [...qk.properties.all, "detail", id] as const,
    meta: () => [...qk.properties.all, "meta"] as const,
  },
};
