import { useState } from 'react';
import API from '../api/axios';
import { toast } from 'sonner';
import { MessageSquare, Send, Calendar, UserRound } from 'lucide-react';

const PostCard = ({ post, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setSubmitting(true);
      await API.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText('');
      if (onCommentAdded) onCommentAdded();
      toast.success('Reply posted!');
    } catch {
      toast.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card w-full rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all hover:shadow-md mb-4 relative">
      <div style={{ padding: '1.25rem 1.5rem' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(194,110,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
            <UserRound size={20} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.2, margin: 0 }}>
              {post.user?.name || 'Anonymous Reader'}
            </h4>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Calendar size={11} style={{ opacity: 0.7 }} />
              {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* ── Content ── */}
        <p style={{ fontSize: '0.9375rem', color: 'var(--text)', lineHeight: 1.65, marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </p>

        {/* ── Image ── */}
        {post.image && (
          <div style={{ marginBottom: '1rem', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={post.image} alt="Post Attachment" style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }} loading="lazy" />
          </div>
        )}

        {/* ── Action bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setShowComments(!showComments)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.375rem 0.75rem', borderRadius: '999px', transition: 'all var(--transition)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(194,110,61,0.08)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <MessageSquare size={15} />
            {showComments ? 'Hide' : `${post.comments?.length || 0} Replies`}
          </button>
        </div>

        {/* ── Reply Section ── */}
        {showComments && (
          <div className="reply-drawer">

            {/* Reply list */}
            <div className="reply-list">
              {post.comments?.length === 0 && (
                <p className="reply-empty">Be the first to reply!</p>
              )}
              {post.comments?.map((c, i) => (
                <div key={i} className="reply-item">
                  <div className="reply-avatar">
                    <span className="reply-avatar-char">{c.user?.name?.charAt(0) || '?'}</span>
                  </div>
                  <div className="reply-content">
                    <span className="reply-author">{c.user?.name || 'User'}</span>
                    <span className="reply-text">{c.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply input */}
            <form onSubmit={handleComment} className="reply-input-row">
              <div className="reply-input-wrap">
                <input
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Write a reply..."
                  className="reply-input"
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                disabled={!commentText.trim() || submitting}
                className="reply-send-btn"
                aria-label="Send reply"
              >
                <Send size={15} style={{ marginLeft: '1px' }} />
              </button>
            </form>

          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
