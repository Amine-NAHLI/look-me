const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const initialProducts = [
    {
      name: 'Robe Blanche Estivale',
      category: 'Robes',
      price: 89,
      image: 'https://images.unsplash.com/photo-1515347619362-e67425dd98d1?q=80&w=1953&auto=format&fit=crop',
      inStock: true
    },
    {
      name: 'Chemisier Rose Bonbon',
      category: 'Hauts',
      price: 65,
      image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=1887&auto=format&fit=crop',
      inStock: true
    },
    {
      name: 'Pantalon Fluide Épice',
      category: 'Pantalons',
      price: 75,
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop',
      inStock: true
    },
    {
      name: 'Tailleur Rose Pâle',
      category: 'Vestes',
      price: 120,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop',
      inStock: true
    }
];

const seedProducts = async () => {
    try {
        await Product.deleteMany(); // Nettoyer pour éviter les doublons
        await Product.insertMany(initialProducts);
        console.log('✅ Catalogue inséré avec succès ! Le fichier (Table) "products" est créé.');
        process.exit();
    } catch (error) {
        console.error(`❌ Erreur: ${error.message}`);
        process.exit(1);
    }
};

seedProducts();
