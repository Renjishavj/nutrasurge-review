const mongoose = require('mongoose');

const reviewSubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
    starRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewDate: { type: Date, required: true },

    // Customer-provided product usage details
    expiryDate: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // MM/YYYY
          return /^(0[1-9]|1[0-2])\/\d{4}$/.test(v);
        },
        message: 'expiryDate must be in MM/YYYY format',
      },
    },
    batchCode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Alphanumeric only (no spaces or dashes)
          return /^[A-Za-z0-9]+$/.test(v);
        },
        message: 'batchCode must be alphanumeric only',
      },
    },

    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    reviews: {
      type: [reviewSubSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

