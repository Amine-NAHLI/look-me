const { env } = require('../config/env');
const AppError = require('../utils/AppError');

const PRESETS = {
  studio: {
    name: 'Studio classique',
    prompt: `EXTREMELY STRICT INSTRUCTION: DO NOT ALTER, REDRAW, OR MODIFY THE CLOTHING/PRODUCT IN ANY WAY. You are a professional retoucher. Your ONLY job is to replace the background and lighting. 
KEEP THE EXACT SAME GARMENT, exactly as it appears in the reference image. Preserve 100% of the original shape, wrinkles, colors, logos, buttons, fabric texture, and fit.
Create a professional e-commerce studio lighting setup with a clean, pure white or light gray premium background. Add realistic soft shadows under/behind the product to ground it naturally. The garment MUST remain identical to the original photo.`
  },
  minimal: {
    name: 'Minimaliste',
    prompt: `EXTREMELY STRICT INSTRUCTION: DO NOT ALTER, REDRAW, OR MODIFY THE CLOTHING/PRODUCT IN ANY WAY. You are a professional retoucher. Your ONLY job is to replace the background and lighting. 
KEEP THE EXACT SAME GARMENT, exactly as it appears in the reference image. Preserve 100% of the original shape, wrinkles, colors, logos, buttons, fabric texture, and fit.
Create an ultra-clean, minimalist, bright aesthetic. Very soft natural lighting, extremely subtle and realistic shadows, sharp focus on the product, set against a pristine minimalist background. The garment MUST remain identical to the original photo.`
  },
  premium: {
    name: 'Premium',
    prompt: `EXTREMELY STRICT INSTRUCTION: DO NOT ALTER, REDRAW, OR MODIFY THE CLOTHING/PRODUCT IN ANY WAY. You are a professional retoucher. Your ONLY job is to replace the background and lighting. 
KEEP THE EXACT SAME GARMENT, exactly as it appears in the reference image. Preserve 100% of the original shape, wrinkles, colors, logos, buttons, fabric texture, and fit.
Create a luxury high-end fashion catalog mood. Elegant lighting, rich contrast, a premium studio environment or elegant gradient background, realistic soft shadows, high fashion editorial feel. The garment MUST remain identical to the original photo.`
  }
};

async function generateImage(imageArray, presetKey, seed = null) {
  if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
    throw new AppError('Cloudflare AI is not configured', 500, 'AI_CONFIG_ERROR');
  }

  const preset = PRESETS[presetKey] || PRESETS.studio;

  // On utilise le modèle officiel FLUX de Cloudflare
  const url = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/runwayml/stable-diffusion-v1-5-img2img`;

  const requestBody = {
    prompt: preset.prompt,
    image: imageArray,
    guidance: 8.5, // Augmenté pour forcer l'IA à suivre le prompt à la lettre
    strength: 0.75, // Indique à l'IA de conserver fortement l'image d'origine (image-to-image)
    num_steps: 20
  };
  
  if (seed !== null) {
    requestBody.seed = seed;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Cloudflare AI Error:', response.status, text);
    
    if (response.status === 429 || text.includes('rate limit') || text.includes('quota')) {
      throw new AppError('Quota quotidien atteint ou serveurs IA surchargés. Veuillez réessayer demain.', 429, 'AI_QUOTA_EXCEEDED');
    }
    
    throw new AppError('Le serveur d\'Intelligence Artificielle ne répond pas pour le moment. Veuillez réessayer plus tard.', 502, 'AI_GENERATION_FAILED');
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

module.exports = { PRESETS, generateImage };
