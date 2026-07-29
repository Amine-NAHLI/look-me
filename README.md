# LOOKME

Boutique de mode marocaine : React/Vite côté client, Express/MongoDB côté API, paiement à la livraison.

## Démarrage local

Copier `api/.env.example` vers `api/.env`, générer deux secrets forts, puis installer séparément les dépendances dans `api` et `client`. L'API nécessite MongoDB en replica set car les commandes et le stock utilisent des transactions atomiques. `docker compose up --build` démarre une instance locale répliquée et l'API.

## Vérifications

`npm run lint` et `npm run build` dans `client`; `npm run check` et `npm test` dans `api`. Voir [la procédure de production](docs/PRODUCTION.md).
