import { useState, useEffect } from 'react';
import axios from 'axios';

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description
      });
    }
  }, [product]);

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

      const response = await axios.put(`https://nutrasurge-reviews.onrender.com//api/products/${product._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onUpdate(response.data);
    } catch (err) {
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Product</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
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
              <label className="form-label" htmlFor="image">New Image (Optional)</label>
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
              rows="4"
              required
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>
          
          <div className="flex justify-between" style={{ marginTop: '2rem' }}>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
