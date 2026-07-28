const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String }, // Removed unique for now to test
  user: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    }
  ],
  subtotal: { type: Number, required: true, default: 0.0 },
  deliveryFee: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  paymentMethod: { type: String, required: true, default: 'cash_on_delivery' },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending' 
  },
  statusHistory: [
    {
      status: String,
      date: { type: Date, default: Date.now },
      note: String
    }
  ],
  isPaid: { type: Boolean, required: true, default: false },
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function () {
  if (this.isNew) {
    try {
      const Order = this.constructor;
      const count = await Order.countDocuments();
      const num = String(count + 1).padStart(3, '0');
      this.orderNumber = `LM-${new Date().getFullYear()}-${num}`;
      
      // Initial status history
      this.statusHistory = [{
        status: 'pending',
        date: new Date(),
        note: 'Commande reçue'
      }];
    } catch (err) {
      throw err;
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
