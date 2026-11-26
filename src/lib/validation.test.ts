import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrors, producerSchema, signUpSchema } from "./validation";

const crop = "6f1b8a3e-2c4d-4e5f-8a9b-0c1d2e3f4a5b";

describe("validation des formulaires", () => {
  it("superficie : accepte la virgule française", () => {
    const r = producerSchema.parse({
      display_name: "Awa",
      crops: [{ crop_id: crop, area_ha: "2,5" }],
      total_area_ha: "3,25",
    });
    expect(r.crops[0].area_ha).toBe(2.5);
    expect(r.total_area_ha).toBe(3.25);
  });
  it("producteur : au moins une culture, téléphone privé par défaut", () => {
    expect(producerSchema.safeParse({ display_name: "Awa", crops: [] }).success).toBe(false);
    expect(producerSchema.parse({ display_name: "Awa", crops: [{ crop_id: crop }] }).phone_visibility).toBe(
      "private",
    );
  });
  it("producteur : superficie négative refusée", () => {
    const r = producerSchema.safeParse({ display_name: "Awa", crops: [{ crop_id: crop, area_ha: "-1" }] });
    expect(r.success).toBe(false);
  });
  it("téléphone : espaces normalisés, lettres refusées", () => {
    expect(
      producerSchema.parse({ display_name: "Awa", crops: [{ crop_id: crop }], phone: "07  07 07 07 07" })
        .phone,
    ).toBe("07 07 07 07 07");
    expect(
      producerSchema.safeParse({ display_name: "Awa", crops: [{ crop_id: crop }], phone: "appelez-moi" })
        .success,
    ).toBe(false);
  });
  it("question : email ou téléphone obligatoire, consentement obligatoire", () => {
    const base = {
      full_name: "Kofi",
      category: "debouche",
      message: "Je cherche un acheteur pour mon manioc.",
    };
    const noContact = contactSchema.safeParse({ ...base, consent: "on" });
    expect(noContact.success).toBe(false);
    if (!noContact.success) expect(fieldErrors(noContact.error).phone).toMatch(/email ou un numéro/);
    expect(contactSchema.safeParse({ ...base, phone: "0707070707" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, phone: "0707070707", consent: "on" }).success).toBe(true);
  });
  it("piège à robots : un champ caché rempli est refusé", () => {
    const r = contactSchema.safeParse({
      full_name: "Robot",
      category: "autre",
      message: "Achetez mes produits miracles",
      email: "r@b.ot",
      consent: "on",
      website: "http://spam",
    });
    expect(r.success).toBe(false);
  });
  it("compte : mot de passe de 8 caractères minimum, email normalisé", () => {
    expect(signUpSchema.safeParse({ display_name: "Awa", email: "a@b.ci", password: "court" }).success).toBe(
      false,
    );
    expect(
      signUpSchema.parse({ display_name: "Awa", email: " Awa@Exemple.CI ", password: "motdepasse" }).email,
    ).toBe("awa@exemple.ci");
  });
});
