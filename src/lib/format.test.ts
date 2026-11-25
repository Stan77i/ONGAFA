import { describe, expect, it } from "vitest";
import { dateParts, formatDate, formatFcfa, initials } from "./format";

describe("formats français", () => {
  it("date longue en heure d'Abidjan", () => {
    expect(formatDate("2026-11-25T23:30:00Z")).toBe("25 novembre 2026");
  });
  it("parties de date pour le bloc calendrier", () => {
    expect(dateParts("2026-03-08T10:00:00Z")).toMatchObject({ day: "8", month: "mars" });
  });
  it("francs CFA avec séparateur de milliers", () => {
    expect(formatFcfa(12500).replace(/\s/g, " ")).toBe("12 500 FCFA");
  });
  it("initiales", () => {
    expect(initials("Aya Kouassi")).toBe("AK");
    expect(initials("")).toBe("?");
  });
});
