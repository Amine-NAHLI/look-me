const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true, default: "Magnifique vêtement" },
  category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
