/**
 * One-off script to remove ALL customer reviews from EVERY product.
 *
 * It removes both `pending` and `accepted` reviews from `product.reviews`.
 * Run:
 *   node removeAllCustomerReviews.js
 */

const mongoose = require('mongoose');
const Product = require('../models/Product');

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutrasurge';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB:', mongoUri);

  const result = await Product.updateMany(
    {},
    { $set: { reviews: [] } }
  );

  console.log('Update result:', result);
  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

