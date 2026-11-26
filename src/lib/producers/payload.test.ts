import { describe, expect, it } from "vitest";
import { producerSchema } from "@/lib/validation";
import { toRpcPayload } from "./payload";

const crop = "6f1b8a3e-2c4d-4e5f-8a9b-0c1d2e3f4a5b";

describe("format envoyé à save_producer_profile", () => {
  it("besoins en objets { need }, cultures avec superficie ou null, version du consentement", () => {
    const data = producerSchema.parse({
      display_name: "Awa",
      crops: [{ crop_id: crop, area_ha: "2,5" }, { crop_id: crop.replace("5b", "5c") }],
      needs: ["buyer", "transport"],
    });
    const p = toRpcPayload(data, "2026-11-26");
    expect(p.needs).toEqual([{ need: "buyer" }, { need: "transport" }]);
    expect(p.crops).toEqual([
      { crop_id: crop, area_ha: 2.5 },
      { crop_id: crop.replace("5b", "5c"), area_ha: null },
    ]);
    expect(p.consent_version).toBe("2026-11-26");
  });
});
