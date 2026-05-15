import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AddReviewModal from './AddReviewModal';
import nutrasurgeLogo from '../assets/Nurtrasurge-logo.png';
import Footer from './Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`https://nutrasurge-reviews.onrender.com/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const acceptedReviews = useMemo(() => {
    return product?.reviews || [];
  }, [product]);

  const averageRating = useMemo(() => {
    if (!acceptedReviews.length) return 0;
    const sum = acceptedReviews.reduce((acc, r) => acc + Number(r.starRating || 0), 0);
    return sum / acceptedReviews.length;
  }, [acceptedReviews]);

  const refresh = async () => {
    try {
      setError('');
      const res = await axios.get(`https://nutrasurge-reviews.onrender.com/api/products/${id}`);
      setProduct(res.data);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to refresh');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)' }}>
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ maxWidth: 900, margin: '2rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--error-color)' }}>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="card" style={{ maxWidth: 900, margin: '2rem auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-color)', opacity: 0.7 }}>Product not found.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <header
        style={{
          borderBottom: '1px solid var(--border-color)',
          padding: '1.5rem 2rem',
          background: 'linear-gradient(180deg, #ffffff, #fafafa)',
        }}
      >
        <div className="container" style={{ padding: 0, maxWidth: 1200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <img
                            src={nutrasurgeLogo}
                            alt="NutraSurge Labs"
                            style={{
                              height: '52px',
                              width: 'auto',
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />

            <button
              className="btn btn-outline"
              onClick={() => window.history.back()}
              style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}
            >
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '2rem' }}>
        <div
          className="card"
          style={{
            maxWidth: 1050,
            margin: '0 auto',
            padding: '0',
            overflow: 'hidden',
          }}
        >
          {/* hero */}
          <div
            style={{
              display: 'flex',
              gap: '0',
              flexWrap: 'wrap',
              padding: '2rem',
              background:
                'radial-gradient(900px 250px at 15% 0%, rgba(0,0,0,0.05), transparent 55%), linear-gradient(180deg, #ffffff, #fbfbfb)',
            }}
          >
            <div style={{ flex: '1 1 360px' }}>
              <div
                className="product-image-container"
                style={{
                  height: 320,
                  background: 'linear-gradient(180deg, #f3f3f3, #eaeaea)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {product.image ? (
                  <img
                    src={
                      product.image?.startsWith('http')
                        ? product.image
                        : `https://nutrasurge-reviews.onrender.com/${product.image}`
                    }
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML =
                        '<span style="color: #666; font-size: 12px;">Image failed to load</span>';
                    }}
                  />
                ) : (
                  <span style={{ color: '#999', fontSize: 'var(--font-xs)' }}>No Image</span>
                )}
              </div>
            </div>

            <div style={{ flex: '2 1 520px', paddingLeft: '1.25rem', minWidth: 280 }}>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '0.75rem',
                }}
              >
                <span
                  style={{
                    background: '#111',
                    color: '#fff',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: 'var(--font-xs)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {product.category}
                </span>
                <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>

              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.name}</h1>
              <div
                style={{
                  color: '#666',
                  marginBottom: '1.25rem',
                  fontSize: 'var(--font-sm)',
                  lineHeight: 1.6,
                  maxWidth: 460,
                  display: '-webkit-box',
                  WebkitLineClamp: 5,

                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {product.description}
              </div>


              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    background: '#fff',
                    minWidth: 240,
                  }}
                >
                  {acceptedReviews.length ? (
                    <>
                      <div style={{ fontSize: 'var(--font-sm)', color: '#111', fontWeight: 700 }}>
                        <span style={{ color: '#f59e0b' }}>
                          {'★'.repeat(Math.round(averageRating))}
                        </span>
                        <span style={{ color: '#fde68a', fontWeight: 600 }}>
                          {'★'.repeat(5 - Math.round(averageRating))}
                        </span>
                      </div>
                      <div style={{ marginTop: '0.25rem', color: '#333', fontSize: 'var(--font-sm)' }}>
                        <strong>{averageRating.toFixed(1)}</strong> / 5 average rating •{' '}
                        {acceptedReviews.length} approved review(s)
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 'var(--font-sm)', color: '#666' }}>No approved reviews yet.</div>
                  )}
                </div>

                <button className="btn btn-primary" onClick={() => setIsReviewOpen(true)}>
                  Add Review
                </button>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
              <h3 style={{ marginBottom: '0.75rem', fontSize: 'var(--font-lg)' }}>Reviews</h3>
              <div style={{ color: '#666', fontSize: 'var(--font-sm)' }}>
                Showing only approved reviews
              </div>
            </div>

            {acceptedReviews.length ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {acceptedReviews
                  .slice()
                  .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
                  .map((r) => (
                    <div
                      key={r._id}
                      style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem',
                        background: 'linear-gradient(180deg, #ffffff, #fcfcfc)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 'var(--font-base)' }}>{r.name}</div>
                          <div style={{ color: '#666', fontSize: 'var(--font-xs)', marginTop: '0.25rem' }}>
                            {r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : ''}
                          </div>
                        </div>

                        <div style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>
                          <span style={{ color: '#f59e0b' }}>
                            {'★'.repeat(Number(r.starRating || 0))}
                          </span>
                          <span style={{ color: '#ccc' }}>
                            {'★'.repeat(Math.max(0, 5 - Number(r.starRating || 0)))}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginTop: '0.75rem', color: '#222', lineHeight: 1.6 }}>
                        {r.message}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{ color: '#666', padding: '1rem 0' }}>No reviews approved yet.</div>
            )}
          </div>
        </div>
      </main>

      {isReviewOpen && (
        <AddReviewModal
          productId={product._id}
          onClose={() => setIsReviewOpen(false)}
          onSubmitted={async () => {
            setIsReviewOpen(false);
            await refresh();
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProductDetails;

