import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddProductForm from './AddProductForm';
import ProductList from './ProductList';
import EditProductModal from './EditProductModal';
import AdminPendingReviews from './AdminPendingReviews';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://nutrasurge-reviews.onrender.com/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await axios.get('https://nutrasurge-reviews.onrender.com/api/admin/reviews/pending', {
        headers: { 'x-admin': 'true' },
      });
      setPendingCount(res.data?.pending?.length || 0);
    } catch (error) {
      // Don’t break dashboard if pending count fails
      setPendingCount(0);
      console.error('Failed to fetch pending count', error);
    }
  }, []);

  useEffect(() => {
    // Check auth
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/adminlogin');
      return;
    }

    // Fetch after mount to avoid rule complaints
    fetchProducts();
    fetchPendingCount();
  }, [navigate, fetchProducts, fetchPendingCount]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/adminlogin');
  };

  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`https://nutrasurge-reviews.onrender.com/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Failed to delete product', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <header className="admin-header">
        <div className="brand">Nutrasurge Admin Panel</div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-outline admin-reviews-btn"
            onClick={() => {
              const el = document.getElementById('pending-reviews');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            aria-label="Pending reviews"
          >
            Reviews
            {pendingCount > 0 && <span className="admin-notification-badge">{pendingCount}</span>}
          </button>

          <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
            Logout
          </button>
        </div>
      </header>

      <main className="container">
        <AddProductForm onProductAdded={handleProductAdded} />
        <ProductList products={products} loading={loading} onEdit={handleEditClick} onDelete={handleDeleteProduct} />

        <AdminPendingReviews onModerationDone={fetchPendingCount} />
      </main>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default Dashboard;

