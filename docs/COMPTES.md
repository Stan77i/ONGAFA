# Comptes et emails — réglages Supabase à faire dans le tableau de bord

Ces réglages ne sont pas modifiables depuis le code : ils se font dans le tableau de bord Supabase du projet
AFA (réf. `jpoeuqywbuwtuvefxpcb`), menu **Authentication**.

## 1. Envoi des emails (indispensable avant d'ouvrir les inscriptions)

Par défaut, Supabase n'envoie les emails de confirmation **qu'aux membres de l'équipe du projet**, et en très
petit nombre par heure. Sans ce réglage, un producteur qui crée un compte ne reçoit jamais son email.

1. Créer un compte chez un service d'envoi d'emails (par exemple **Brevo** ou **Resend**, offres gratuites pour
   démarrer) et y déclarer le nom de domaine du site (enregistrements SPF, DKIM, DMARC fournis par le service).
2. Dans Supabase : **Authentication → Emails → SMTP Settings** : activer « Custom SMTP » et renseigner
   l'hôte, le port, l'identifiant et le mot de passe fournis par le service, avec une adresse d'expédition du
   type `ne-pas-repondre@<domaine-afa>`.

## 2. Adresses du site

**Authentication → URL Configuration** :

- **Site URL** : l'adresse publique du site (par exemple `https://<domaine-afa>`).
- **Redirect URLs** : ajouter `https://<domaine-afa>/auth/confirm` (et `http://localhost:3000/auth/confirm`
  pour le développement).

La variable `NEXT_PUBLIC_SITE_URL` de l'hébergement doit contenir la même adresse publique.

## 3. Modèles d'emails en français (recommandé)

**Authentication → Emails → Templates**. Pour que le lien fonctionne **même si l'email est ouvert sur un autre
téléphone ou une autre application** que celle de l'inscription, remplacer le lien par défaut par :

- _Confirm signup_ :
  `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/producteurs/inscription`
- _Reset password_ :
  `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/compte/nouveau-mot-de-passe`

Exemple de texte pour la confirmation :

> **Bienvenue dans le réseau AFA**
> Touchez le bouton ci-dessous pour activer votre compte : [Activer mon compte](lien ci-dessus)
> Si vous n'avez pas créé de compte, ignorez cet email.
> — ONG AFA, Action des Femmes d'Afrique pour le Développement

## 4. Créer le compte administrateur

1. Créer son compte normalement sur le site (`/creer-un-compte`) et confirmer l'email.
2. Exécuter `supabase/bootstrap_admin.sql` dans l'éditeur SQL de Supabase, avec son adresse email.

## Fonctionnement côté site

- Inscription par email et mot de passe (8 caractères minimum), confirmation par email.
- Page `/auth/confirm` : accepte le lien recommandé (`token_hash`) et le lien par défaut (`code`).
- Mot de passe oublié : `/mot-de-passe-oublie` → lien par email → `/compte/nouveau-mot-de-passe`.
- Le téléphone est facultatif, déclaratif et jamais vérifié par SMS.
