/**
 * Textes de consentement. Toute modification du texte impose une NOUVELLE version : la version acceptée
 * est enregistrée avec chaque consentement (table consents) ou chaque demande.
 */
export const CONSENT_VERSION = "2026-11-26";

export const consentTexts = {
  producer:
    "J'accepte que l'ONG AFA enregistre ces informations pour me référencer dans son réseau de producteurs et qu'elle me contacte au sujet de mon activité. Je peux les modifier ou demander leur suppression à tout moment depuis mon compte.",
  request:
    "J'accepte que l'ONG AFA utilise ces informations uniquement pour traiter ma demande et me recontacter.",
} as const;
