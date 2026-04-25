import { useState } from 'react';

const StarRating = ({ rating, setRating, interactive = true }) => {
  const [hover, setHover] = useState(0);
  const [clicked, setClicked] = useState(0);

  const active = hover || rating;

  return (
    <div className="star-rating" style={{ display: 'inline-flex', gap: interactive ? '6px' : '3px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = active >= star;
        return (
          <span
            key={star}
            style={{
              fontSize: interactive ? '2rem' : '1.5rem',
              cursor: interactive ? 'pointer' : 'default',
              color: isFilled ? 'var(--highlight)' : 'var(--border)',
              transition: 'color 0.18s ease, transform 0.15s ease, filter 0.18s ease',
              display: 'inline-block',
              lineHeight: 1,
              transform: interactive && hover === star ? 'scale(1.25)' : interactive && clicked === star ? 'scale(0.9)' : 'scale(1)',
              filter: interactive && isFilled ? 'drop-shadow(0 1px 4px rgba(212,160,23,0.45))' : 'none',
              userSelect: 'none',
            }}
            onClick={() => {
              if (!interactive) return;
              setClicked(star);
              setRating(star);
              setTimeout(() => setClicked(0), 150);
            }}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
          >
            {isFilled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
