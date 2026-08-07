const { env } = require('../config/env');
const AppError = require('../utils/AppError');

const PRESETS = {
  studio: {
    name: 'Studio classique',
    prompt: `Transform this raw product photograph into a professional high-end e-commerce studio photograph.
Preserve the EXACT physical product shown in the reference image.
Do not redesign or modify the product.
Preserve exactly: shape, dimensions and proportions, colors, logos, text, patterns, stitching, fabric/material, buttons, zippers, accessories, design details.
Only improve the photographic presentation.
Create: professional studio lighting, clean premium background (neutral light gray or white), realistic soft shadows, balanced exposure, sharp product details, professional composition, centered product, realistic commercial photography.
The generated image must remain an accurate representation of the physical product that the customer will receive.`
  },
  minimal: {
    name: 'Minimaliste',
    prompt: `Transform this raw product photograph into a minimalist high-end e-commerce photograph.
Preserve the EXACT physical product shown in the reference image.
Do not redesign or modify the product.
Preserve exactly: shape, dimensions and proportions, colors, logos, text, patterns, stitching, fabric/material, buttons, zippers, accessories, design details.
Only improve the photographic presentation.
Create: ultra-clean bright minimalist background, very soft natural lighting, extremely subtle and realistic shadows, sharp product details, professional minimalist composition, centered product.
The generated image must remain an accurate representation of the physical product that the customer will receive.`
  },
  premium: {
    name: 'Premium',
    prompt: `Transform this raw product photograph into a premium luxury fashion catalog photograph.
Preserve the EXACT physical product shown in the reference image.
Do not redesign or modify the product.
Preserve exactly: shape, dimensions and proportions, colors, logos, text, patterns, stitching, fabric/material, buttons, zippers, accessories, design details.
Only improve the photographic presentation.
Create: luxury mood lighting, elegant high-end environment or clean premium gradient background, rich contrast, realistic soft shadows, sharp product details, professional composition, centered product, high fashion editorial feel.
The generated image must remain an accurate representation of the physical product that the customer will receive.`
  }
};

async function generateImage(imageArray, presetKey) {
  if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
    throw new AppError('Cloudflare AI is not configured', 500, 'AI_CONFIG_ERROR');
  }

  const preset = PRESETS[presetKey] || PRESETS.studio;

  // Modèle FLUX spécifié par l'utilisateur
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-2-klein-4b`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: preset.prompt,
      image: imageArray,
      // Paramètres optionnels que FLUX peut accepter
      guidance: 7.5,
      num_steps: 20
    })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Cloudflare AI Error:', text);
    throw new AppError('Échec de la génération de l\'image par l\'IA', 502, 'AI_GENERATION_FAILED');
  }

  // Cloudflare renvoie généralement l'image binaire directement
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

module.exports = { PRESETS, generateImage };
