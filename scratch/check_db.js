
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/look-me';

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    const products = await mongoose.connection.db.collection('products').find({}).limit(1).toArray();
    console.log('Product example:', JSON.stringify(products[0], null, 2));
    
    const ordersCount = await mongoose.connection.db.collection('orders').countDocuments();
    console.log('Orders count:', ordersCount);
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
