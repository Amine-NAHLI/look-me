const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true, default: "Magnifique vêtement" },
  category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  brand: { type: String, default: "Look-Me" },
  countInStock: { type: Number, required: true, default: 10 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
