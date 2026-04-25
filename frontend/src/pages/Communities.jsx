// Communities — Discord-inspired layout with sidebar + card grid
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  Users, Plus, MessageSquare, Search, Globe, Flame,
  BookOpen, Zap, Compass, Clock, TrendingUp, Hash,
  ArrowRight, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

const GENRES = [
  { label: 'All Tribes', icon: Globe, value: '' },
  { label: 'Fiction', icon: BookOpen, value: 'Fiction' },
  { label: 'Non-Fiction', icon: Hash, value: 'Non-Fiction' },
  { label: 'Mystery', icon: Zap, value: 'Mystery' },
  { label: 'Sci-Fi', icon: Compass, value: 'Sci-Fi' },
  { label: 'History', icon: Flame, value: 'History' },
  { label: 'Romance', icon: TrendingUp, value: 'Romance' },
  { label: 'Self-Help', icon: Zap, value: 'Self-Help' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Most Members', value: 'members' },
  { label: 'My Tribes', value: 'joined' },
];

// Skeleton card while loading
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton" style={{ height: '100px' }} />
    <div style={{ padding: '1.25rem 1.5rem' }}>
      <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '12px', width: '90%', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '12px', width: '75%' }} />
    </div>
    <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="skeleton" style={{ height: '12px', width: '80px' }} />
      <div className="skeleton" style={{ height: '32px', width: '100px', borderRadius: '999px' }} />
    </div>
  </div>
);

// Banner gradient by index
const GRADIENTS = [
  'linear-gradient(135deg, #1E2A38 0%, #C26E3D 100%)',
  'linear-gradient(135deg, #2d3f54 0%, #D4A017 100%)',
  'linear-gradient(135deg, #C26E3D 0%, #1E2A38 100%)',
  'linear-gradient(135deg, #131c27 0%, #a55a2e 100%)',
  'linear-gradient(135deg, #D4A017 0%, #C26E3D 100%)',
];

const CommunityCard = ({ community, idx, onJoin }) => {
  const gradient = GRADIENTS[idx % GRADIENTS.length];

  return (
    <div className="community-card animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
      {/* Banner */}
      <div className="community-card-banner" style={{ background: gradient }}>
        <Users
          size={48}
          color="white"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.15 }}
        />
        {community.isMember && (
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: '999px', padding: '0.2rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <CheckCircle2 size={11} /> Joined
          </div>
        )}
        {community.genre && (
          <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.875rem' }}>
            <span className="genre-badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              {community.genre}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="community-card-body">
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem', lineHeight: 1.3 }}>
          {community.name}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {community.description || 'A community of passionate readers sharing ideas.'}
        </p>
      </div>

      {/* Footer */}
      <div className="community-card-footer">
        <span className="stat-chip">
          <Users size={12} /> {community.members?.length || 0} members
        </span>

        {community.isMember ? (
          <Link
            to={`/communities/${community._id}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'var(--primary)', color: 'white', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.78rem', fontWeight: 700, transition: 'all var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
          >
            Enter <ArrowRight size={13} />
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/communities/${community._id}`}
              className="btn btn-ghost btn-xs"
              style={{ borderRadius: '999px', padding: '0.4rem 0.75rem', fontSize: '0.72rem', border: '1px solid var(--border)' }}
            >
              Explore
            </Link>
            <button
              onClick={() => onJoin(community._id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'var(--accent)', color: 'white', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dark)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              Join
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => { fetchCommunities(); }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const res = await API.get('/communities?limit=100');
      setCommunities(res.data.data || []);
    } catch {
      toast.error('Failed to load tribes');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    const loadingToast = toast.loading('Initializing membership...');
    try {
      await API.post(`/communities/${id}/join`);
      toast.success('You have joined the tribe!', { id: loadingToast });
      setCommunities(prev => prev.map(c => c._id === id ? { ...c, isMember: true } : c));
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg === 'User is already a member of this community') {
        toast.success('You had already joined!', { id: loadingToast });
        setCommunities(prev => prev.map(c => c._id === id ? { ...c, isMember: true } : c));
      } else {
        toast.error('Failed to join', { id: loadingToast });
      }
    }
  };

  // Filter + sort
  let filtered = communities.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    const matchGenre = !selectedGenre || c.genre === selectedGenre;
    return matchSearch && matchGenre;
  });

  if (sortBy === 'members') filtered = [...filtered].sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0));
  if (sortBy === 'joined') filtered = filtered.filter(c => c.isMember);

  const myTribes = filtered.filter(c => c.isMember);
  const discover = filtered.filter(c => !c.isMember);

  return (
    <div className="community-page-wrapper">
      {/* ── Left Sidebar ── */}
      <aside className="community-sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <p className="community-sidebar-title">Browse</p>
          {GENRES.map(({ label, icon: Icon, value }) => (
            <button
              key={value}
              className={`community-sidebar-item ${selectedGenre === value ? 'active' : ''}`}
              onClick={() => setSelectedGenre(value)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div>
          <p className="community-sidebar-title">Sort By</p>
          {SORT_OPTIONS.map(o => (
            <button
              key={o.value}
              className={`community-sidebar-item ${sortBy === o.value ? 'active' : ''}`}
              onClick={() => setSortBy(o.value)}
            >
              <Clock size={14} /> {o.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <Link to="/communities/create" className="btn btn-accent btn-full" style={{ borderRadius: '999px', justifyContent: 'center' }}>
            <Plus size={17} /> Create Tribe
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="community-main">
        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>Community Hub</span>
          <h1 style={{ marginBottom: '0.5rem' }}>Vibrant Tribes</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Join specialized circles of readers who share your niche passions.
          </p>
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: '999px', padding: '0.65rem 1.25rem', transition: 'all var(--transition)' }}>
            <Search size={17} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search tribes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', padding: 0 }}
            />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {filtered.length} tribe{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <>
            <p className="community-sidebar-title" style={{ marginBottom: '1rem' }}>Loading...</p>
            <div className="grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-8" style={{ marginBottom: '3rem' }}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        ) : (
          <>
            {/* ── Newest First / Most Members → unified sorted grid ── */}
            {(sortBy === 'newest' || sortBy === 'members') && (
              <>
                {/* My Tribes sub-section */}
                {myTribes.length > 0 && (
                  <section style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <CheckCircle2 size={18} color="var(--accent)" />
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>My Tribes</h2>
                      <span className="stat-chip">{myTribes.length}</span>
                    </div>
                    <div className="grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-8">
                      {myTribes.map((c, i) => (
                        <CommunityCard key={c._id} community={c} idx={i} onJoin={handleJoin} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Divider */}
                {myTribes.length > 0 && discover.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', opacity: 0.5 }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Discover More</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  </div>
                )}

                {/* Discover sub-section */}
                {discover.length > 0 && (
                  <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <Compass size={18} color="var(--accent)" />
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                        {myTribes.length > 0 ? 'Discover Tribes' : 'All Tribes'}
                      </h2>
                      <span className="stat-chip">{discover.length}</span>
                    </div>
                    <div className="grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-8">
                      {discover.map((c, i) => (
                        <CommunityCard key={c._id} community={c} idx={i} onJoin={handleJoin} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* ── My Tribes sort → show only joined tribes ── */}
            {sortBy === 'joined' && (
              <>
                {myTribes.length > 0 ? (
                  <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <CheckCircle2 size={18} color="var(--accent)" />
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>My Tribes</h2>
                      <span className="stat-chip">{myTribes.length}</span>
                    </div>
                    <div className="grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-8">
                      {myTribes.map((c, i) => (
                        <CommunityCard key={c._id} community={c} idx={i} onJoin={handleJoin} />
                      ))}
                    </div>
                  </section>
                ) : (
                  <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <Users size={52} style={{ margin: '0 auto 1rem', opacity: 0.2, display: 'block' }} />
                    <h3 style={{ marginBottom: '0.5rem' }}>No tribes joined yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      Explore and join a tribe below to see it here.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                <Users size={52} style={{ margin: '0 auto 1rem', opacity: 0.2, display: 'block' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>No tribes found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  {search ? `No results for "${search}"` : 'No communities in this category yet.'}
                </p>
                <Link to="/communities/create" className="btn btn-accent" style={{ borderRadius: '999px' }}>
                  <Plus size={16} /> Start a Tribe
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Communities;
