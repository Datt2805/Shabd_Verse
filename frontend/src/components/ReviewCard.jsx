import { useAuth } from '../context/AuthContext.jsx';
import StarRating from './StarRating.jsx';

const ReviewCard = ({ review, onDelete }) => {
  const { user } = useAuth();

  return (
    <div className="card animate-fade-in" style={{ marginBottom: '1rem', padding: '1.25rem' }}>
      <div className="flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
            {review.user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <strong>{review.user?.name || 'User'}</strong>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-light)' }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} interactive={false} />
      </div>
      <p style={{ margin: '1rem 0', fontSize: '0.95rem', color: 'var(--text)' }}>{review.reviewText || review.comment}</p>
      {/* Show delete button if the review belongs to current user */}
      {user && (user._id === review.user?._id || user.role === 'admin') && (
        <button className="link-btn" style={{ color: 'var(--danger)', fontSize: '0.8rem' }} onClick={() => onDelete(review._id)}>
          Delete Review
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
