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

  const [showAll, setShowAll] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);

  const fetchAll = async () => {
    try {
      setLoadingAll(true);
      setError('');
      const res = await axios.get('https://nutrasurge-reviews.onrender.com/api/admin/reviews/all', {
        headers: { 'x-admin': 'true' },
      });
      setAllReviews(res.data?.allReviews || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch all reviews');
    } finally {
      setLoadingAll(false);
    }
  };

  const deleteReview = async (reviewId) => {
    const ok = window.confirm('Delete this review?');
    if (!ok) return;

    try {
      setError('');
      await axios.delete(`https://nutrasurge-reviews.onrender.com/api/admin/reviews/${reviewId}`, {
        headers: { 'x-admin': 'true' },
      });
      await fetchAll();
      await fetchPending();
      onModerationDone?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete review');
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text-color)', opacity: 0.8 }}>Loading pending reviews...</div>;
  }

  return (
    <div id="pending-reviews" className="card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <h3 style={{ marginBottom: 0, fontSize: 'var(--font-lg)' }}>Pending Reviews</h3>

        <button
          type="button"
          className="btn btn-outline"
          onClick={async () => {
            const next = !showAll;
            setShowAll(next);
            if (next) await fetchAll();
          }}
          style={{ padding: '0.5rem 1rem' }}
        >
          {showAll ? 'Hide All Reviews' : 'View All Reviews'}
        </button>
      </div>

      {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{error}</div>}

      {pending.length === 0 ? (
        <div style={{ color: '#666', marginTop: '0.75rem' }}>No pending reviews.</div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {pending.map((r) => (
            <div
              key={r._id}
              style={{
                position: 'relative',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <button
                type="button"
                aria-label="Delete review"
                title="Delete"
                onClick={() => deleteReview(r._id)}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: '#fff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  color: 'var(--error-color)',
                  zIndex: 10,
                }}
              >
                🗑
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', paddingRight: '3rem' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{r.productName}</div>
                  <div style={{ color: '#666', fontSize: 'var(--font-xs)' }}>{r.name}</div>
                </div>
                <div style={{ color: '#111' }}>
                  <div style={{ display: "inline-flex", letterSpacing: "1px" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} style={{ position: "relative", color: "#ccc" }}>
                        ★
                        <span style={{ position: "absolute", left: 0, top: 0, overflow: "hidden", width: Number(r.starRating || 0) >= s ? "100%" : Number(r.starRating || 0) >= s - 0.5 ? "50%" : "0%", color: "#f59e0b" }}>★</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', color: '#333' }}>{r.message}</div>
              <div style={{ color: '#666', fontSize: 'var(--font-xs)', marginTop: '0.5rem' }}>
                Review date: {r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : ''}
              </div>
              <div style={{ color: '#666', fontSize: 'var(--font-xs)', marginTop: '0.25rem' }}>
                Batch Code: <b style={{ color: '#111' }}>{r.batchCode || 'N/A'}</b> | Expiry: <b style={{ color: '#111' }}>{r.expiryDate || 'N/A'}</b>
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

      {showAll && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: 'var(--font-lg)' }}>All Reviews</h3>

          {loadingAll ? (
            <div style={{ color: 'var(--text-color)', opacity: 0.8 }}>Loading all reviews...</div>
          ) : allReviews.length === 0 ? (
            <div style={{ color: '#666' }}>No reviews found.</div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {allReviews
                .slice()
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .map((r) => (
                  <div
                    key={r._id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                     
                    }}
                  >
              <button
  type="button"
  aria-label="Delete review"
  title="Delete"
  onClick={() => deleteReview(r._id)}
  style={{
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    background: '#fff',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    color: 'var(--error-color)',
  }}
>
  🗑
</button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontWeight: 800 }}>{r.productName}</div>
                        <div style={{ color: '#666', fontSize: 'var(--font-xs)' }}>{r.name}</div>
                      </div>
                      <div style={{ color: '#111' }}>
                        <div style={{ display: "inline-flex", letterSpacing: "1px" }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} style={{ position: "relative", color: "#ccc" }}>
                              ★
                              <span style={{ position: "absolute", left: 0, top: 0, overflow: "hidden", width: Number(r.starRating || 0) >= s ? "100%" : Number(r.starRating || 0) >= s - 0.5 ? "50%" : "0%", color: "#f59e0b" }}>★</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '0.75rem', color: '#333' }}>{r.message}</div>
                    <div style={{ color: '#666', fontSize: 'var(--font-xs)', marginTop: '0.5rem' }}>
                      Review date: {r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : ''}
                    </div>
                    <div style={{ color: '#666', fontSize: 'var(--font-xs)', marginTop: '0.25rem' }}>
                      Batch Code: <b style={{ color: '#111' }}>{r.batchCode || 'N/A'}</b> | Expiry: <b style={{ color: '#111' }}>{r.expiryDate || 'N/A'}</b>
                    </div>

                    <div style={{ color: '#666', fontSize: 'var(--font-xs)', marginTop: '0.5rem' }}>
                      Status: <b style={{ color: '#111' }}>{r.status}</b>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPendingReviews;

