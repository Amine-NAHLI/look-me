
const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');
const MONGO_URI = 'mongodb://localhost:27017/look-me';

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Create a dummy product to satisfy ref
    let product = await Product.findOne();
    if (!product) {
      product = await Product.create({
        name: 'Test Product',
        description: 'Test',
        category: new mongoose.Types.ObjectId(),
        price: 100,
        image: 'test.jpg'
      });
    }

    const orderData = {
      orderItems: [{
        name: product.name,
        qty: 1,
        image: product.image,
        price: product.price,
        product: product._id
      }],
      customerName: 'Test User',
      phone: '0600000000',
      address: 'Test Address',
      city: 'Casablanca',
      subtotal: 100,
      deliveryFee: 30,
      totalPrice: 130,
      paymentMethod: 'cash_on_delivery'
    };

    const order = new Order(orderData);
    console.log('Attempting to save order...');
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder.orderNumber);
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('FAILED TO SAVE ORDER:');
    console.error(err);
    process.exit(1);
  }
}

test();
