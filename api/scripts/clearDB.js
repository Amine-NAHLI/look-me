const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const clearDB = async () => {
    try {
        await Product.deleteMany(); 
        await Category.deleteMany(); 
        await Order.deleteMany(); 
        console.log('✅ Base de données complétement nettoyée. Prête pour les ajouts de l\'Admin !');
        process.exit();
    } catch (error) {
        console.error(`❌ Erreur: ${error.message}`);
        process.exit(1);
    }
};

clearDB();
