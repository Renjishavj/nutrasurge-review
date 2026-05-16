import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const getLocalDateInputValue = (date = new Date()) => {
  // yyyy-MM-dd in local time
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const AddReviewModal = ({ productId, onClose, onSubmitted }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewDate, setReviewDate] = useState(getLocalDateInputValue());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setName('');
    setMessage('');
    setStarRating(0);
    setHoverRating(0);
    setReviewDate(getLocalDateInputValue());
    setError('');
  }, [productId]);

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const activeRating = hoverRating || starRating;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Input is yyyy-MM-dd; convert to Date.
      const dateObj = new Date(reviewDate);
      if (Number.isNaN(dateObj.getTime())) {
        setError('Invalid date');
        return;
      }

      await axios.post(`http://localhost:5000/api/products/${productId}/reviews`, {
        message,
        starRating: Number(starRating),
        reviewDate: dateObj.toISOString(),
      });

      onSubmitted?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add Review</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && (
          <div style={{ color: 'var(--error-color)', marginBottom: '1rem', fontSize: 'var(--font-sm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label" htmlFor="review-name">
              Name
            </label>
            <input
              id="review-name"
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="review-message">
              Review
            </label>
            <textarea
              id="review-message"
              className="input-field"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '0.75rem' }}>
              Star Rating
            </label>
            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              {stars.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStarRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 4px',
                    fontSize: '1.75rem',
                    lineHeight: 1,
                    color: s <= activeRating ? '#f59e0b' : '#222',
                    textShadow: s <= activeRating ? '0 0 8px rgba(245,158,11,0.6)' : 'none',
                    transition: 'color 0.15s ease, text-shadow 0.15s ease',
                    transform: s <= activeRating ? 'scale(1.15)' : 'scale(1)',
                  }}
                  aria-label={`${s} star${s > 1 ? 's' : ''}`}
                >
                  ★
                </button>
              ))}
              {starRating > 0 && (
                <span style={{ marginLeft: '0.5rem', fontSize: '0.82rem', color: '#888' }}>
                  {starRating} / 5
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="review-date">
              Review Date
            </label>
            <input
              id="review-date"
              type="date"
              className="input-field"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;

