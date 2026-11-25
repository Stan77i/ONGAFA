/**
 * Miroir TypeScript du catalogue défini en base
 * (supabase/migrations/20261125000400_seed_roles_permissions.sql).
 * La source de vérité reste la base : un test vérifie que les deux listes sont identiques.
 */
export const PERMISSIONS = [
  "create_post",
  "comment",
  "moderate_post",
  "hide_content",
  "manage_reports",
  "sanction_user",
  "create_article",
  "edit_article",
  "publish_article",
  "manage_news",
  "manage_news_sources",
  "manage_resources",
  "manage_pages",
  "manage_testimonials",
  "manage_events",
  "manage_opportunities",
  "manage_projects",
  "manage_locations",
  "manage_afa_locations",
  "manage_prices",
  "verify_prices",
  "manage_producers",
  "manage_users",
  "manage_roles",
  "view_producer_private",
  "export_producer_data",
  "answer_contact_requests",
  "view_statistics",
  "view_audit_logs",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLES = [
  "member",
  "producer",
  "partner",
  "moderator",
  "editor",
  "data_manager",
  "territorial_agent",
  "privacy_officer",
  "admin",
] as const;

export type Role = (typeof ROLES)[number];
