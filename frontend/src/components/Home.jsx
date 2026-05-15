import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import nutrasurgeLogo from '../assets/Nurtrasurge-logo.png';
import Footer from './Footer';

const REVIEWS = [
  {
    id: 1,
    name: 'Rahul.',
    rating: 5,
    text: 'Nutrasurge protein is hands down the best I\'ve tried. Mixes perfectly, tastes great, and I\'ve seen real gains in just 6 weeks!',
    date: 'April 2025',
    avatar: 'RR',
  },
  {
    id: 2,
    name: 'Arjun.',
    rating: 5,
    text: 'I was skeptical at first, but Nutrasurge pre-workout completely changed my training sessions. Incredible energy without the crash.',
    date: 'March 2025',
    avatar: 'AC',
  },
  {
    id: 3,
    name: 'Niranjan',
    rating: 4,
    text: 'Great quality supplements. Fast shipping and the packaging is premium. Will definitely be ordering again.',
    date: 'May 2025',
    avatar: 'NV',
  },
];

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={star <= rating ? '#f59e0b' : '#e5e7eb'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://nutrasurge-reviews.onrender.com//api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Auto-cycle reviews
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % REVIEWS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* ── HEADER ── */}
      <header
        style={{
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 2rem',
          backgroundColor: 'var(--bg-color)',
        }}
      >
        <div className="container" style={{ padding: 0, maxWidth: 1200 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <a
                href="/adminlogin"
                className="btn btn-outline"
                style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ── BANNER ── */}
      <section
        className="card"
        style={{
          margin: '2rem auto 0',
          maxWidth: 1200,
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Left: headline + badges */}
          <div style={{ flex: '1 1 380px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Shop Our Best Sellers</h1>
            <p style={{ color: '#666', marginBottom: '1.25rem' }}>
              Browse our latest products below. All prices are listed in USD.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              {['Fast Shipping', 'Quality Tested', 'Secure Checkout'].map((badge) => (
                <span
                  key={badge}
                  className="counter"
                  style={{ marginBottom: 0, background: 'rgba(0,0,0,0.04)' }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* ── REVIEW CARD ── */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e8eaf0',
                borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                maxWidth: 420,
                transition: 'all 0.3s ease',
              }}
            >
              {/* Stars + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <StarRating rating={REVIEWS[activeReview].rating} />
                <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>
                  Verified Purchase
                </span>
              </div>

              {/* Quote */}
              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#333',
                  lineHeight: 1.6,
                  margin: '0 0 1rem',
                  fontStyle: 'italic',
                }}
              >
                "{REVIEWS[activeReview].text}"
              </p>

              {/* Reviewer info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    flexShrink: 0,
                  }}
                >
                  {REVIEWS[activeReview].avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111' }}>
                    {REVIEWS[activeReview].name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>
                    {REVIEWS[activeReview].date}
                  </div>
                </div>
              </div>

              {/* Dot indicators */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }}>
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveReview(i)}
                    style={{
                      width: i === activeReview ? 20 : 8,
                      height: 8,
                      borderRadius: 4,
                      border: 'none',
                      cursor: 'pointer',
                      background: i === activeReview ? '#1a1a2e' : '#ddd',
                      transition: 'all 0.3s ease',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: assistance card */}
          <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                backgroundColor: 'var(--card-bg)',
              }}
            >
              <h3 style={{ fontSize: 'var(--font-lg)', marginBottom: '0.5rem' }}>Need Assistance?</h3>
              <p style={{ color: '#666', fontSize: 'var(--font-sm)' }}>
                Contact us anytime—our team will help you pick the right supplement.
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <a href="/adminlogin" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  Manage Catalog
                </a>
              </div>
            </div>

            {/* Overall rating summary */}
            <div
              style={{
                border: '1px solid #e8eaf0',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem 1.25rem',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: '#1a1a2e' }}>4.9</div>
                <StarRating rating={5} />
                <div style={{ fontSize: '0.72rem', color: '#999', marginTop: '2px' }}>120+ reviews</div>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.5 }}>
                Trusted by thousands of fitness enthusiasts across the country.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <main className="container" style={{ paddingTop: '2rem' }}>
        <ProductList
          products={products}
          loading={loading}
          showActions={false}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Home;

