const { z } = require('zod');
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Identifiant invalide');
const pagination = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(50).default(12), sort: z.enum(['newest', 'price_asc', 'price_desc']).default('newest'), category: objectId.optional(), q: z.string().trim().max(80).optional() });
module.exports = { z, objectId, pagination };
