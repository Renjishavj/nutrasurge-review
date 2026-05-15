require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Product = require('./models/Product');

const app = express();

const isAdminRequest = (req) => {
  // Frontend/admin panel uses localStorage.isAdmin (no JWT), so we gate API via header.
  // Admin UI will send: x-admin: true
  return req.headers['x-admin'] === 'true';
};

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Storage Configuration (Cloudinary)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nutrasurge_products',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp']
  }
});
const upload = multer({ storage: storage });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutrasurge')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Admin Login Route (Hardcoded)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password123') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Create Product Route with Image Upload
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path;
    }

    const newProduct = new Product({
      name,
      price: Number(price),
      category,
      description,
      image: imagePath,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Get Single Product Details (include only accepted reviews)
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const acceptedReviews = (product.reviews || []).filter((r) => r.status === 'accepted');

    res.json({
      ...product.toObject(),
      reviews: acceptedReviews,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add Review (pending) - customer
app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message, starRating, reviewDate } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const dateObj = reviewDate ? new Date(reviewDate) : new Date();
    if (Number.isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid reviewDate' });
    }

    const review = {
      name,
      message,
      starRating: Number(starRating),
      reviewDate: dateObj,
      status: 'pending',
    };

    product.reviews.push(review);
    await product.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Get Pending Reviews for Admin
app.get('/api/admin/reviews/pending', async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const products = await Product.find({}, { name: 1, reviews: 1 });
    const pending = [];

    products.forEach((p) => {
      (p.reviews || []).forEach((r) => {
        if (r.status === 'pending') {
          pending.push({
            _id: r._id,
            productId: p._id,
            productName: p.name,
            name: r.name,
            message: r.message,
            starRating: r.starRating,
            reviewDate: r.reviewDate,
            createdAt: r.createdAt,
          });
        }
      });
    });

    res.json({ pending });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending reviews' });
  }
});

// Admin Accept/Reject Review
app.patch('/api/admin/reviews/:reviewId', async (req, res) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { reviewId } = req.params;
    const { action } = req.body;
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const status = action === 'accept' ? 'accepted' : 'rejected';

    const product = await Product.findOne({ 'reviews._id': reviewId });
    if (!product) return res.status(404).json({ error: 'Review not found' });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    review.status = status;
    await product.save();

    res.json({ success: true, status });
  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({ error: 'Failed to moderate review' });
  }
});


// Update Product Route with Optional Image Upload
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description } = req.body;
    
    const updateData = {
      name,
      price: Number(price),
      category,
      description
    };

    if (req.file) {
      updateData.image = req.file.path;
      
      // Delete old image from Cloudinary if replacing
      const oldProduct = await Product.findById(id);
      if (oldProduct && oldProduct.image && oldProduct.image.includes('cloudinary.com')) {
         const publicId = oldProduct.image.split('/').slice(-2).join('/').split('.')[0];
         await cloudinary.uploader.destroy(publicId).catch(err => console.error("Cloudinary delete error:", err));
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete Product Route
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the image file if it exists
    if (product.image) {
      if (product.image.includes('cloudinary.com')) {
        const publicId = product.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(err => console.error("Cloudinary delete error:", err));
      } else {
        const imagePath = path.join(__dirname, product.image);
        fs.unlink(imagePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Failed to delete image file:', err);
          }
        });
      }
    }

    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get All Products Route
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({ error: err.message || err, details: err });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
