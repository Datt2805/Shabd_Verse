// CreateCommunity — Section-based tribe creation form
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'sonner';
import { ArrowLeft, Users, BookOpen, Hash, Zap, Compass, Flame, TrendingUp, Globe, CheckCircle2 } from 'lucide-react';

const GENRES = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi',
  'History', 'Romance', 'Self-Help', 'Biography',
  'Poetry', 'Philosophy', 'Science', 'Other',
];

const GENRE_ICONS = {
  Fiction: BookOpen, 'Non-Fiction': Hash, Mystery: Zap,
  'Sci-Fi': Compass, History: Flame, Romance: TrendingUp,
  'Self-Help': CheckCircle2, Biography: Users,
  Poetry: Globe, Philosophy: Globe, Science: Zap, Other: Globe,
};

const CreateCommunity = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', genre: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'name') setNameError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setNameError('Tribe name is required'); return; }
    if (!form.genre) { toast.error('Please select a genre'); return; }
    if (!form.description.trim()) { toast.error('Please add a description'); return; }

    setSubmitting(true);
    try {
      const res = await API.post('/communities', form);
      toast.success('Tribe created successfully!');
      navigate(`/communities/${res.data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create tribe';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = form.description.length;
  const maxChars = 500;

  return (
    <div className="container py-12" style={{ maxWidth: '740px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/communities" className="btn btn-ghost btn-sm" style={{ borderRadius: '999px', padding: '0.4rem 0.875rem', marginBottom: '1.5rem', display: 'inline-flex' }}>
          <ArrowLeft size={15} /> Back to Tribes
        </Link>
        <span className="badge badge-accent" style={{ display: 'block', marginBottom: '0.75rem', width: 'fit-content' }}>New Community</span>
        <h1 style={{ marginBottom: '0.5rem' }}>Start a Tribe</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Build a space for readers who share your passion. Your tribe, your rules.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* Section 1: Identity */}
        <div className="form-section">
          <p className="form-section-title">Tribe Identity</p>

          <div className="form-group">
            <label htmlFor="tribe-name">Tribe Name <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              id="tribe-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Dark Fantasy Readers Circle"
              maxLength={60}
              style={{ borderColor: nameError ? 'var(--danger)' : undefined }}
            />
            {nameError && (
              <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.375rem', fontWeight: 600 }}>{nameError}</p>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.375rem' }}>
              {form.name.length}/60 characters
            </p>
          </div>
        </div>

        {/* Section 2: Genre */}
        <div className="form-section">
          <p className="form-section-title">Category & Genre <span style={{ color: 'var(--danger)' }}>*</span></p>
          <div className="grid grid-cols-4 lg-grid-cols-2 sm-grid-cols-2 gap-4" style={{ gap: '0.75rem' }}>
            {GENRES.map(genre => {
              const Icon = GENRE_ICONS[genre] || Globe;
              const isSelected = form.genre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, genre }))}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                    padding: '0.875rem 0.625rem', borderRadius: '0.75rem',
                    border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    background: isSelected ? 'rgba(194,110,61,0.08)' : 'var(--bg)',
                    cursor: 'pointer', transition: 'all var(--transition)',
                    color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: isSelected ? 700 : 500, fontSize: '0.8rem',
                  }}
                  onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--accent)'; }}}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
                >
                  <Icon size={20} />
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Description */}
        <div className="form-section">
          <p className="form-section-title">About this Tribe</p>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="tribe-desc">Description <span style={{ color: 'var(--danger)' }}>*</span></label>
            <textarea
              id="tribe-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what this community is about, who it's for, and what members can expect..."
              rows={5}
              maxLength={maxChars}
              style={{ resize: 'vertical' }}
            />
            <p style={{ color: charCount > maxChars * 0.9 ? 'var(--danger)' : 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.375rem', textAlign: 'right' }}>
              {charCount}/{maxChars}
            </p>
          </div>
        </div>

        {/* Preview card */}
        {(form.name || form.genre) && (
          <div className="form-section animate-fade-in-up" style={{ background: 'var(--secondary)', border: 'none' }}>
            <p className="form-section-title">Preview</p>
            <div className="community-card" style={{ maxWidth: '280px' }}>
              <div className="community-card-banner" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                <Users size={40} color="white" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.15 }} />
                {form.genre && (
                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.875rem' }}>
                    <span className="genre-badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                      {form.genre}
                    </span>
                  </div>
                )}
              </div>
              <div className="community-card-body">
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.375rem' }}>
                  {form.name || 'Your Tribe Name'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {form.description || 'Your tribe description will appear here...'}
                </p>
              </div>
              <div className="community-card-footer">
                <span className="stat-chip"><Users size={12} /> 1 member</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>You're the founder</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Link to="/communities" className="btn btn-ghost" style={{ borderRadius: '999px' }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || !form.name.trim() || !form.genre || !form.description.trim()}
            className="btn btn-accent btn-lg"
            style={{ borderRadius: '999px', minWidth: '160px' }}
          >
            {submitting ? 'Creating...' : '✦ Launch Tribe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;
