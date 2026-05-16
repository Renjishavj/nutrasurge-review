import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPendingReviews = ({ onModerationDone }) => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPending = async () => {
    try {
      setError('');
      setLoading(true);
      const res = await axios.get('https://nutrasurge-reviews.onrender.com/api/admin/reviews/pending', {
        headers: {
          'x-admin': 'true',
        },
      });
      setPending(res.data?.pending || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch pending reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const moderate = async (reviewId, action) => {
    try {
      await axios.patch(
        `https://nutrasurge-reviews.onrender.com/api/admin/reviews/${reviewId}`,
        { action },
        {
          headers: {
            'x-admin': 'true',
          },
        }
      );
      await fetchPending();
      onModerationDone?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Moderation failed');
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text-color)', opacity: 0.8 }}>Loading pending reviews...</div>;
  }

  return (
    <div id="pending-reviews" className="card" style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: 'var(--font-lg)' }}>Pending Reviews</h3>

      {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{error}</div>}

      {pending.length === 0 ? (
        <div style={{ color: '#666' }}>No pending reviews.</div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {pending.map((r) => (
            <div
              key={r._id}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{r.productName}</div>
                  <div style={{ color: '#666', fontSize: 'var(--font-xs)' }}>{r.name}</div>
                </div>
                <div style={{ color: '#111' }}>
                  {'★'.repeat(Number(r.starRating || 0))}
                  <span style={{ color: '#ccc' }}>{'★'.repeat(Math.max(0, 5 - Number(r.starRating || 0)))}</span>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', color: '#333' }}>{r.message}</div>
              <div style={{ color: '#666', fontSize: 'var(--font-xs)', marginTop: '0.5rem' }}>
                Review date: {r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : ''}
              </div>

              <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary" type="button" style={{ flex: 1 }} onClick={() => moderate(r._id, 'accept')}>
                  Accept
                </button>
                <button
                  className="btn btn-outline"
                  type="button"
                  style={{ flex: 1, borderColor: '#fee2e2', color: 'var(--error-color)' }}
                  onClick={() => moderate(r._id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingReviews;

