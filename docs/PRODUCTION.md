# Mise en production LOOKME

## Pré-requis

- Node.js 22, PostgreSQL et une URL `DATABASE_URL` dédiée à la production ;
- secrets JWT distincts, aléatoires et d'au moins 32 caractères ;
- domaine HTTPS exact dans `CLIENT_URL` et `CORS_ALLOWED_ORIGINS` ;
- `TRUST_PROXY=true` uniquement derrière un proxy de confiance.

## Déploiement

1. Exécuter les validations CI et `npm audit --omit=dev --audit-level=high`.
2. Prendre une sauvegarde PostgreSQL testée avant toute migration.
3. Appliquer `npx prisma migrate deploy` lorsque les migrations versionnées sont disponibles.
4. Créer l'administrateur avec `node scripts/createAdmin.js`, sans mot de passe par défaut.
5. Configurer Cloudinary avec ses trois variables si les uploads sont exposés.
6. Configurer SMTP avec toutes ses variables avant d'activer la réinitialisation de mot de passe.
7. Vérifier `/health`, `/ready`, les cookies Secure, CORS, le flux COD et la restauration d'une sauvegarde.

## Sauvegarde et rollback

Effectuer des sauvegardes chiffrées quotidiennes PostgreSQL, les restaurer mensuellement sur une instance isolée et documenter le point de restauration. Le rollback applicatif doit utiliser l'image précédente compatible avec le schéma ; ne jamais modifier les snapshots de commande historiques.

## Limites externes

Le domaine HTTPS, le fournisseur SMTP, Cloudinary, la supervision/alerting et tout futur PSP doivent être configurés avec leurs propres identifiants. Le seul paiement actif est le paiement à la livraison.
