import { useState } from 'react';

import axios from 'axios';

const AddProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('description', formData.description);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await axios.post('https://nutrasurge-reviews.onrender.com/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Product added successfully!');
      setFormData({ name: '', price: '', category: '', description: '' });
      setImageFile(null);
      // Reset file input
      document.getElementById('image').value = '';
      
      if (onProductAdded) {
        onProductAdded(response.data);
      }
    } catch (err) {
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: 'var(--font-lg)' }}>Add New Product</h3>
      
      {message && <div style={{ color: 'var(--success-color)', marginBottom: '1rem', fontSize: 'var(--font-sm)' }}>{message}</div>}
      {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem', fontSize: 'var(--font-sm)' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label" htmlFor="name">Product Name</label>
            <input
              id="name"
              type="text"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Whey Protein Isolate"
              required
            />
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label" htmlFor="price">Price ($)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 49.99"
              required
            />
          </div>
        </div>
        
        <div className="flex gap-4" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label" htmlFor="category">Category</label>
            <select
              id="category"
              className="input-field"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ appearance: 'auto' }}
            >
              <option value="" disabled>Select a category</option>
              <option value="Protein">Protein</option>
              <option value="Mass Gainer">Mass Gainer</option>
              <option value="Pre Workout">Pre Workout</option>
              <option value="Recovery">Recovery</option>
              <option value="Creatine">Creatine</option>
              <option value="Fat Burner">Fat Burner</option>
              <option value="Fish Oil">Fish Oil</option>
              <option value="Whey Isolate">Whey Isolate</option>
              <option value="Collagen">Collagen</option>
              <option value="Test Booster">Test Booster</option>
              <option value="Multivitamin">Multivitamin</option>
              <option value="Protein Blend">Protein Blend</option>
            </select>
          </div>
          
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label" htmlFor="image">Product Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="input-field"
              onChange={handleImageChange}
              style={{ padding: '0.5rem 1rem' }}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="input-field"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description..."
            rows="4"
            required
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
