const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'ramrani197@gmail.com' });
    if (adminExists) {
      console.log('✅ Compte Administrateur présent dans la base.');
      process.exit();
    }

    const adminUser = new User({
      firstName: 'Directrice',
      email: 'ramrani197@gmail.com',
      password: 'lookme2026',
      role: 'admin'
    });

    await adminUser.save();
    console.log('🎉 Super Admin ramrani197@gmail.com configuré avec succès !');
    process.exit();
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
