# LOOKME

Boutique de mode marocaine : React/Vite côté client, Express/Prisma/PostgreSQL côté API et paiement à la livraison.

## Démarrage local

1. Copiez `backend/.env.example` vers `backend/.env` et générez deux secrets JWT distincts.
2. Installez les dépendances dans `backend` et `frontend` avec `npm ci`.
3. Démarrez PostgreSQL localement, puis exécutez `npx prisma migrate deploy` depuis `backend` pour appliquer le schéma versionné.
4. Lancez `npm run dev` à la racine, ou `docker compose up --build`.

Le frontend utilise `VITE_API_URL=/api` et le proxy Vite local est configuré avec `VITE_API_PROXY_TARGET`.

## Vérifications

```powershell
npm run check --prefix backend
npm test --prefix backend
npm run lint --prefix frontend
npm test --prefix frontend
npm run build --prefix frontend
```

## Production

Utilisez PostgreSQL, configurez Cloudinary et SMTP si les fonctionnalités correspondantes sont activées, appliquez des migrations Prisma versionnées et exécutez la checklist de `docs/PRODUCTION.md`. Aucun secret ne doit être versionné.
