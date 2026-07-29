# Mise en production LOOKME

## Prérequis

- Node.js 22 LTS et MongoDB répliqué (transactions obligatoires) ou Docker Compose.
- Variables de `api/.env.example` configurées avec deux secrets aléatoires distincts d'au moins 32 caractères.
- Une origine HTTPS exacte dans `CLIENT_URL` et `CORS_ALLOWED_ORIGINS`; `TRUST_PROXY=true` seulement derrière un proxy de confiance.

## Déploiement

1. Exécuter `npm ci` dans `api` et `client`, puis les commandes CI.
2. Appliquer `node scripts/migrateInventory.js` après une sauvegarde de la base.
3. Créer l'administrateur avec `node scripts/createAdmin.js`; ne jamais utiliser de mot de passe par défaut.
4. Déployer l'API avec un volume persistant pour les uploads ou, en production, remplacer le fournisseur local par un stockage objet avant exposition publique.
5. Vérifier `/health` et `/ready`, les cookies Secure, CORS, CSP et les parcours COD.

## Sauvegarde, restauration et rollback

Sauvegarder quotidiennement MongoDB (`mongodump`) et chiffrer les archives hors du serveur. Tester mensuellement `mongorestore` sur une base isolée. Avant toute migration, prendre un snapshot et conserver l'image applicative précédente : le rollback consiste à rétablir l'image et la sauvegarde compatible, jamais à modifier les commandes historiques.

## Limites externes

L'e-mail transactionnel, un stockage objet, un domaine HTTPS, un outil de monitoring et toute intégration PSP restent à configurer avec leurs identifiants. Le paiement à la livraison est le seul flux de paiement activé.
