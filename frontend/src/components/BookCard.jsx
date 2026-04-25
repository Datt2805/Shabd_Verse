// BookCard — displays a single book in a card format
import { Link } from 'react-router-dom';
import StarRating from './StarRating.jsx';

const BookCard = ({ book }) => {
  return (
    <div className="premium-card animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.25rem' }}>
      <div style={{ height: '240px', overflow: 'hidden', borderRadius: 'var(--radius)', marginBottom: '1.25rem', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {book.coverImage ? (
          <img 
            src={book.coverImage} 
            alt={book.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
          />
        ) : (
          <span style={{ fontSize: '4rem' }}>📖</span>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ marginBottom: '0.25rem' }}>{book.title}</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600 }}>by <span className="text-accent">{book.author}</span></p>
        <div style={{ margin: '0.5rem 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'var(--secondary)', color: 'var(--primary)', fontSize: '0.65rem' }}>{book.genre}</span>
          {book.isForSale && <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>For Sale</span>}
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text)', margin: '0.75rem 0', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', opacity: 0.8 }}>
          {book.description || 'No description available for this book.'}
        </p>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StarRating rating={Math.round(book.averageRating || 0)} interactive={false} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>
            {book.averageRating?.toFixed(1) || '0.0'}
          </span>
        </div>
        {book.price && <strong style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 900 }}>₹{book.price}</strong>}
      </div>
      <Link to={`/books/${book._id}`} className="btn btn-outline btn-sm" style={{ marginTop: '1.25rem', width: '100%', textTransform: 'uppercase' }}>
        View Details
      </Link>
    </div>
  );
};

export default BookCard;
