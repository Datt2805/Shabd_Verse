// Book Details Page — Professional Refactor
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/axios';
import StarRating from '../components/StarRating.jsx';
import { toast } from 'sonner';
import { 
  ShoppingBag, 
  MessageSquare, 
  User, 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Edit
} from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', address: '', contact: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 0, reviewText: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const [bookRes, reviewsRes] = await Promise.all([
          API.get(`/books/${id}`),
          API.get(`/reviews/book/${id}`)
        ]);
        setBook(bookRes.data);
        setReviews(reviewsRes.data.data || []);
      } catch (err) {
        toast.error('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };
    fetchBookAndReviews();
  }, [id]);

  const handleBuyClick = () => {
    if (!user) return navigate('/login');
    setOrderForm({ name: user?.name || '', address: '', contact: '' });
    setShowBuyModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (reviewForm.rating === 0) { toast.error('Please select a star rating'); return; }
    if (!reviewForm.reviewText.trim()) { toast.error('Please write your review'); return; }
    setSubmittingReview(true);
    try {
      await API.post('/reviews', { bookId: id, rating: reviewForm.rating, reviewText: reviewForm.reviewText });
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 0, reviewText: '' });
      // Refresh reviews list
      const reviewsRes = await API.get(`/reviews/book/${id}`);
      setReviews(reviewsRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setBuying(true);
    const loadingToast = toast.loading('Processing transaction...');
    try {
      await API.post(`/marketplace/order/${book._id}`, {
        quantity: 1,
        buyerName: orderForm.name,
        deliveryAddress: `${orderForm.address} (Contact: ${orderForm.contact})`
      });
      toast.success('Acquisition successful! Check your orders.', { id: loadingToast });
      setShowBuyModal(false);
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed', { id: loadingToast });
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="container py-24 text-center">Identifying literary artifacts...</div>;
  if (!book) return <div className="container py-24 text-center">Book not found in the Verse.</div>;

  const isOwner = user?._id === (book.addedBy?._id || book.addedBy);

  return (
    <div className="container py-12">
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: '3rem' }}>
        <ArrowLeft size={20} /> Return to Library
      </button>

      <div className="grid grid-cols-2 lg-grid-cols-1 gap-12 items-start">
        {/* Left: Book Cover */}
        <div className="premium-card" style={{ padding: '1rem', background: 'var(--secondary)', position: 'sticky', top: '120px' }}>
          <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            ) : (
              <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={100} opacity={0.1} />
              </div>
            )}
          </div>
        </div>

        {/* Right: Book Info */}
        <div className="flex flex-col gap-8">
           <div className="flex flex-col gap-2">
              <span className="badge badge-accent" style={{ alignSelf: 'flex-start' }}>{book.genre}</span>
              <h1 style={{ fontSize: '3.5rem', marginBottom: 0 }}>{book.title}</h1>
              <p style={{ fontSize: '1.5rem', color: 'var(--accent)', fontWeight: 800 }}>by {book.author}</p>
           </div>

           <div className="flex items-center gap-4" style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
              <StarRating rating={Math.round(book.averageRating || 0)} interactive={false} />
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{book.averageRating?.toFixed(1) || '0.0'}</span>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>(Community Rating)</span>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="premium-card" style={{ padding: '1.5rem', background: 'var(--secondary)', border: 'none' }}>
                 <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.5, fontWeight: 800 }}>Condition</p>
                 <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{book.condition}</p>
              </div>
            </div>

           <div className="seller-info premium-card" style={{ padding: '2rem', border: 'none', background: 'var(--primary)', color: 'white' }}>
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                       {book.addedBy?.name?.charAt(0)}
                    </div>
                    <div>
                       <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6 }}>Listed By</p>
                       <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{book.addedBy?.name || 'Community Member'}</p>
                    </div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6 }}>Acquisition Value</p>
                    <p style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--highlight)' }}>₹{book.price}</p>
                 </div>
              </div>
           </div>

           <div className="actions flex gap-4" style={{ marginTop: '1rem' }}>
              {isOwner ? (
                <>
                  <button className="btn btn-primary btn-lg btn-full"><Edit size={20} /> Modify Listing</button>
                  <button className="btn btn-outline btn-lg" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}><Trash2 size={20} /></button>
                </>
              ) : (
                user?.role !== 'buyer' && (
                  <>
                    <button 
                      onClick={handleBuyClick} 
                      disabled={!book.isForSale} 
                      className="btn btn-accent btn-lg btn-full"
                    >
                      <ShoppingBag size={20} /> Buy
                    </button>
                    <button className="btn btn-outline btn-lg"><MessageSquare size={20} /> Negotiate</button>
                  </>
                )
              )}
           </div>

           {user?.role !== 'buyer' && (
             <div className="trust-badges flex gap-6" style={{ marginTop: '2rem', opacity: 0.6 }}>
                <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                   <ShieldCheck size={16} /> SECURE TRANSACTION
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                   <CheckCircle2 size={16} /> VERIFIED SELLER
                </div>
             </div>
           )}
        </div>
      </div>

      {/* ══ Full-Width Community Reviews (below the 2-col grid) ══ */}
      <div className="reviews-section" style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border)' }}>

        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, marginBottom: '0.25rem' }}>Community Reviews</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              {book.averageRating > 0 && ` · ${book.averageRating?.toFixed(1)} avg rating`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--highlight)' }}>
              {book.averageRating?.toFixed(1) || '—'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ fontSize: '1.2rem', color: Math.round(book.averageRating || 0) >= s ? 'var(--highlight)' : 'var(--border)', transition: 'color 0.2s ease' }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>out of 5</span>
            </div>
          </div>
        </div>

        {/* ── Two-column layout: Write Form (left) + Reviews list (right) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: reviews.length > 0 ? '1fr 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Write a Review Form */}
          <div>
            {user ? (
              <form onSubmit={handleSubmitReview} className="review-write-card" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
              }}>
                <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--accent), var(--highlight))' }} />
                <div style={{ padding: '1.75rem 2rem' }}>
                  <p style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>✍</span> Write Your Review
                  </p>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.625rem' }}>Your Rating</label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <StarRating rating={reviewForm.rating} setRating={(r) => setReviewForm({ ...reviewForm, rating: r })} interactive={true} />
                      {reviewForm.rating > 0 && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--highlight)', fontWeight: 700, marginLeft: '0.5rem', animation: 'fadeInUp 0.2s ease both' }}>
                          {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][reviewForm.rating]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.625rem' }}>Your Thoughts</label>
                    <textarea
                      rows={5}
                      placeholder="Share your honest experience — what did you love, what could be better?"
                      value={reviewForm.reviewText}
                      onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                      style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '10px', border: '2px solid var(--border)', fontSize: '0.95rem', fontFamily: 'var(--font-body)', color: 'var(--text)', background: 'var(--bg)', resize: 'vertical', minHeight: '130px', transition: 'border-color 0.22s ease, box-shadow 0.22s ease', outline: 'none', lineHeight: 1.6 }}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 4px rgba(194,110,61,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      {reviewForm.reviewText.length > 0 && `${reviewForm.reviewText.length} characters`}
                    </p>
                    <button
                      type="submit"
                      disabled={submittingReview || reviewForm.rating === 0}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: (submittingReview || reviewForm.rating === 0) ? 'var(--border)' : 'linear-gradient(135deg, var(--accent), var(--accent-dark))', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: (submittingReview || reviewForm.rating === 0) ? 'not-allowed' : 'pointer', transition: 'all 0.22s ease', boxShadow: (submittingReview || reviewForm.rating === 0) ? 'none' : '0 4px 15px rgba(194,110,61,0.3)' }}
                      onMouseEnter={e => { if (!submittingReview && reviewForm.rating > 0) { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(194,110,61,0.4)'; }}}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = reviewForm.rating > 0 ? '0 4px 15px rgba(194,110,61,0.3)' : 'none'; }}
                      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                      onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }}
                    >
                      {submittingReview ? (
                        <><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Submitting...</>
                      ) : (
                        <><span style={{ fontSize: '1rem' }}>★</span> Publish Review</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div style={{ background: 'var(--secondary)', border: '1.5px dashed var(--border)', borderRadius: '14px', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔐</div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                  Please{' '}
                  <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700, borderBottom: '1px solid var(--accent)' }}>sign in</a>
                  {' '}to share your review.
                </p>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews && reviews.length > 0 ? reviews.map((review, idx) => (
              <div
                key={review._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.06}s`, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem 1.75rem', boxShadow: '0 2px 10px rgba(30,42,56,0.04)', transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,42,56,0.08)'; e.currentTarget.style.borderColor = 'var(--accent-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(30,42,56,0.04)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', boxShadow: '0 0 0 3px var(--secondary), 0 0 0 4px var(--border)', flexShrink: 0 }}>
                      {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, margin: 0, fontSize: '0.95rem', color: 'var(--primary)' }}>{review.user?.name || 'Community Member'}</p>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--highlight)' }}>{review.rating}.0</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ fontSize: '0.95rem', color: review.rating >= s ? 'var(--highlight)' : 'var(--border)' }}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1rem', opacity: 0.6 }} />
                <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text)', fontSize: '0.92rem', opacity: 0.9 }}>{review.reviewText}</p>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '3.5rem 2rem', background: 'var(--secondary)', borderRadius: '14px', border: '1px dashed var(--border)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.4 }}>📖</div>
                <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.375rem', fontSize: '1rem' }}>No reviews yet</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>Be the first to share your thoughts!</p>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Checkout Modal */}
      {showBuyModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setShowBuyModal(false)}>
          <div className="premium-card animate-fade-in-up" style={{ width: '100%', maxWidth: '450px', background: 'var(--background)', overflow: 'hidden', padding: 0 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--primary)', color: 'white' }}>
              <h3 style={{ color: 'white', margin: 0 }}>Checkout Details</h3>
              <p style={{ opacity: 0.8, fontSize: '0.85rem' }}>Provide information to complete your order</p>
            </div>
            <form onSubmit={handleConfirmOrder} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input required value={orderForm.name} onChange={(e) => setOrderForm({...orderForm, name: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--secondary)' }} />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input required value={orderForm.contact} onChange={(e) => setOrderForm({...orderForm, contact: e.target.value})} placeholder="+91 9876543210" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--secondary)' }} />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea required rows={3} value={orderForm.address} onChange={(e) => setOrderForm({...orderForm, address: e.target.value})} placeholder="Room #, Building, Street, City" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--secondary)' }} />
              </div>
              <div className="flex gap-4" style={{ marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowBuyModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={buying} className="btn btn-accent" style={{ flex: 1 }}>{buying ? 'Processing...' : 'Confirm Order'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
