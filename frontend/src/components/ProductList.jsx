import { useNavigate } from 'react-router-dom';

const ProductList = ({ products, loading, onEdit, onDelete, showActions = true }) => {
  const navigate = useNavigate();
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)' }}>Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>No products found.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem', fontSize: 'var(--font-lg)' }}>Products</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {products.map(product => (
          <div
            key={product._id}
            className="card flex-col justify-between"
            style={{ height: '100%', cursor: showActions ? 'default' : 'pointer' }}
            onClick={() => {
              if (!showActions) navigate(`/products/${product._id}`);
            }}
          >
            <div>
              {product.image ? (
                <div className="product-image-container">
                  <img 
                    src={product.image?.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
                    alt={product.name} 
                    className="product-image" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span style="color: #666; font-size: 12px;">Image failed to load</span>';
                    }}
                  />
                </div>
              ) : (
                <div className="product-image-container">
                  <span style={{ color: '#999', fontSize: 'var(--font-xs)' }}>No Image</span>
                </div>
              )}
              
              <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <span className="text-xs" style={{ 
                  background: '#e5e5e5', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '999px', 
                  fontWeight: 500
                }}>
                  {product.category}
                </span>
                <span style={{ fontWeight: 600 }}>${product.price.toFixed(2)}</span>
              </div>
              <h4 style={{ fontSize: 'var(--font-base)', marginBottom: '0.5rem' }}>{product.name}</h4>
              <p className="text-xs" style={{ 
                marginBottom: '1rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {product.description}
              </p>
            </div>

            {showActions && (
              <div className="flex gap-2">
                <button 
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem', flex: 1, fontSize: 'var(--font-xs)' }}
                  onClick={() => onEdit?.(product)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem', flex: 1, fontSize: 'var(--font-xs)', color: 'var(--error-color)', borderColor: '#fee2e2' }}
                  onClick={() => onDelete?.(product._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

