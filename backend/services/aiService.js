const { env } = require('../config/env');
const AppError = require('../utils/AppError');
const FormData = require('form-data');
const axios = require('axios');

async function generateImage(imageArray, presetKey, seed = null) {
  if (!env.REMOVE_BG_API_KEY) {
    throw new AppError('La clé API Remove.bg n\'est pas configurée dans le fichier .env', 500, 'AI_CONFIG_ERROR');
  }

  try {
    // Reconstruire le buffer à partir du tableau d'entiers envoyé par le routeur
    const imageBuffer = Buffer.from(imageArray);
    
    // Créer un FormData pour envoyer l'image à Remove.bg
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', imageBuffer, { filename: 'upload.jpg', contentType: 'image/jpeg' });
    // Rendre l'image parfaitement centrée, recadrée et ajouter une ombre de studio
    formData.append('bg_color', 'white');
    formData.append('crop', 'true');
    formData.append('crop_margin', '10%'); // Remove.bg API uses crop_margin
    formData.append('type', 'product'); // Optimize for products
    formData.append('add_shadow', 'true'); // Add a natural drop shadow

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': env.REMOVE_BG_API_KEY,
      },
      responseType: 'arraybuffer', // On veut récupérer l'image en binaire
    });

    if (response.status !== 200) {
      throw new Error(`Remove.bg a renvoyé l'erreur: ${response.status}`);
    }

    // Convertir l'image de réponse en base64 pour le frontend
    const resultBuffer = Buffer.from(response.data, 'binary');
    return resultBuffer.toString('base64');

  } catch (err) {
    console.error('Remove.bg Error:', err.response?.data ? err.response.data.toString() : err.message);
    
    if (err.response?.status === 402) {
      throw new AppError('Le quota mensuel gratuit de Remove.bg est atteint.', 402, 'AI_QUOTA_EXCEEDED');
    }
    
    throw new AppError('Erreur lors du détourage de l\'image.', 502, 'AI_GENERATION_FAILED');
  }
}

module.exports = { generateImage };
