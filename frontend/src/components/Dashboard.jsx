import { useState, useEffect } from 'react';
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
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/adminlogin');
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

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
      await axios.delete(`http://localhost:5000/api/products/${id}`);
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
        <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
          Logout
        </button>
      </header>

      <main className="container">
        <AddProductForm onProductAdded={handleProductAdded} />
        <ProductList products={products} loading={loading} onEdit={handleEditClick} onDelete={handleDeleteProduct} />

        <AdminPendingReviews />
      </main>

      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onUpdate={handleProductUpdated} />
      )}
    </div>
  );
};

export default Dashboard;

