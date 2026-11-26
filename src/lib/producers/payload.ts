import type { z } from "zod";
import type { producerSchema } from "@/lib/validation";

/**
 * Format attendu par la fonction SQL save_producer_profile (migration 0011) :
 * besoins = [{ need }], cultures = [{ crop_id, area_ha }]. Testé pour éviter toute divergence.
 */
export function toRpcPayload(data: z.output<typeof producerSchema>, consentVersion?: string) {
  return {
    ...data,
    needs: data.needs.map((need) => ({ need })),
    crops: data.crops.map((c) => ({ crop_id: c.crop_id, area_ha: c.area_ha ?? null })),
    consent_version: consentVersion,
  };
}
