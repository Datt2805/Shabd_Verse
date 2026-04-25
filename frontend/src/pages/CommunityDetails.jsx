// CommunityDetails — Discord-style 3-column layout
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/axios';
import ChatBox from '../components/ChatBox.jsx';
import PostCard from '../components/PostCard.jsx';
import { toast } from 'sonner';
import {
  Users, MessageSquare, ArrowLeft, Shield, Globe, Info,
  Edit3, Image as ImageIcon, X, Hash, CheckCircle2,
  Plus, Calendar, FileText
} from 'lucide-react';

// Skeleton for the left panel
const LeftSkeleton = () => (
  <div style={{ padding: '1.5rem' }}>
    <div className="skeleton" style={{ height: '80px', borderRadius: '50%', width: '80px', margin: '0 auto 1rem' }} />
    <div className="skeleton" style={{ height: '16px', width: '70%', margin: '0 auto 0.5rem' }} />
    <div className="skeleton" style={{ height: '12px', width: '50%', margin: '0 auto 1.5rem' }} />
    <div className="skeleton" style={{ height: '36px', borderRadius: '999px', marginBottom: '0.75rem' }} />
    <div className="skeleton" style={{ height: '36px', borderRadius: '999px' }} />
  </div>
);

const CommunityDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImageFile, setPostImageFile] = useState(null);
  const [joining, setJoining] = useState(false);

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const res = await API.get(`/posts/community/${id}`);
      setPosts(res.data.data || []);
    } catch {
      console.error('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  };

    useEffect(() => {
      const fetchCommunity = async () => {
        try {
          const res = await API.get(`/communities/${id}`);
          setCommunity(res.data.data);
          if (user) {
            setIsMember(res.data.data.members?.some(m => m._id === user?._id || m.toString() === user?._id));
          } else {
            setIsMember(false);
          }
        } catch {
          toast.error('Failed to load tribe details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchCommunity();
      fetchPosts();
    }, [id, user]);

  const handleJoin = async () => {
    const t = toast.loading('Joining tribe...');
    setJoining(true);
    try {
      await API.post(`/communities/${id}/join`);
      setIsMember(true);
      toast.success('Welcome to the tribe!', { id: t });
    } catch (err) {
      if (err.response?.data?.message === 'User is already a member of this community') {
        setIsMember(true); toast.success('Already a member!', { id: t });
      } else { toast.error('Failed to join', { id: t }); }
    } finally { setJoining(false); }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && !postImageFile) return;
    toast.loading('Publishing...', { id: 'post' });
    try {
      let imageUrl = null;
      if (postImageFile) {
        const fd = new FormData();
        fd.append('image', postImageFile);
        const up = await API.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrl = up.data.url;
      }
      await API.post('/posts', { communityId: id, content: postContent, image: imageUrl });
      setPostContent(''); setPostImageFile(null);
      fetchPosts();
      toast.success('Post published!', { id: 'post' });
    } catch { toast.error('Failed to publish', { id: 'post' }); }
  };

  return (
    <div>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky', top: '80px', zIndex: 50, background: 'rgba(253,251,247,0.95)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)',
        padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem'
      }}>
        <button onClick={() => navigate('/communities')} className="btn btn-ghost btn-sm" style={{ borderRadius: '999px', padding: '0.4rem 0.875rem' }}>
          <ArrowLeft size={16} /> Back
        </button>

        {community && (
          <>
            <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <Hash size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </span>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{community.name}</h4>
            <span className="stat-chip"><Users size={12} /> {community.members?.length || 0}</span>
            {!isMember && (
              <button 
                onClick={user ? handleJoin : () => navigate('/login')} 
                disabled={joining} 
                className="btn btn-accent btn-sm" 
                style={{ borderRadius: '999px', marginLeft: 'auto', padding: '0.4rem 1.25rem' }}
              >
                {joining ? 'Joining...' : (user ? 'Join Tribe' : 'Login to Join')}
              </button>
            )}
            {isMember && (
              <span className="stat-chip" style={{ marginLeft: 'auto', background: 'rgba(45,134,89,0.1)', color: 'var(--success)' }}>
                <CheckCircle2 size={12} /> Member
              </span>
            )}
          </>
        )}
      </div>

      {/* 3-Column Layout */}
      <div className="tribe-layout">

        {/* ── LEFT RAIL ── */}
        <aside className="tribe-left">
          {loading ? <LeftSkeleton /> : (
            <>
              {/* Community identity */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 0.875rem',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Users size={28} color="white" style={{ opacity: 0.8 }} />
                </div>
                <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.25rem', fontWeight: 800 }}>{community?.name}</h3>
                {community?.genre && <span className="genre-badge">{community.genre}</span>}
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.625rem', lineHeight: 1.5 }}>
                  {community?.description}
                </p>
              </div>

              {/* Navigation */}
              <nav style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <p className="community-sidebar-title" style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>Channels</p>
                <button
                  className={`tribe-nav-item ${activeTab === 'posts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('posts')}
                >
                  <Edit3 size={16} /> Discussion Board
                </button>
                <button
                  className={`tribe-nav-item ${activeTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setActiveTab('chat')}
                >
                  <MessageSquare size={16} /> Live Chat
                </button>
              </nav>

              {/* Stats */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <p className="community-sidebar-title">Stats</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={13} /> Members
                    </span>
                    <strong>{community?.members?.length || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={13} /> Posts
                    </span>
                    <strong>{posts.length}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={13} /> Type
                    </span>
                    <strong>Public</strong>
                  </div>
                </div>
              </div>

              {/* Join button at bottom of left rail */}
              {!isMember && (
                <div style={{ padding: '1rem 1.25rem', marginTop: 'auto' }}>
                  <button 
                    onClick={user ? handleJoin : () => navigate('/login')} 
                    disabled={joining} 
                    className="btn btn-accent btn-full" 
                    style={{ borderRadius: '999px' }}
                  >
                    {joining ? 'Joining...' : (user ? '+ Join Tribe' : 'Login to Join')}
                  </button>
                </div>
              )}
            </>
          )}
        </aside>

        {/* ── CENTER FEED ── */}
        <main className="tribe-center">
          {activeTab === 'chat' ? (
            <ChatBox communityId={id} />
          ) : (
            /* Discussion Feed */
            <div>
              {/* Channel header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Edit3 size={18} color="var(--accent)" />
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Discussion Board</h2>
                  <span className="stat-chip">{posts.length} posts</span>
                </div>
                {!user ? (
                   <span className="stat-chip" style={{ background: 'var(--secondary)', color: 'var(--text-muted)' }}>
                     <Globe size={12} /> View Only Mode
                   </span>
                ) : !isMember && (
                   <span className="stat-chip" style={{ background: 'var(--secondary)', color: 'var(--text-muted)' }}>
                     <Shield size={12} /> Member Only Chat
                   </span>
                )}
              </div>

              {/* Post composer */}
              {isMember && (
                <form onSubmit={handleCreatePost} style={{
                  background: 'var(--bg-card)', border: '1.5px solid var(--border)',
                  borderRadius: '1rem', padding: '1.25rem', marginBottom: '2rem',
                  transition: 'border-color var(--transition)'
                }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontSize: '0.85rem', fontWeight: 800 }}>
                      {user?.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <textarea
                        value={postContent}
                        onChange={e => setPostContent(e.target.value)}
                        placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
                        rows={2}
                        style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: '0.95rem', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-body)', marginBottom: '0.75rem', minHeight: '56px' }}
                      />

                      {postImageFile && (
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                          <img src={URL.createObjectURL(postImageFile)} alt="Preview" style={{ height: '80px', borderRadius: '0.5rem', border: '1px solid var(--border)', objectFit: 'cover' }} />
                          <button type="button" onClick={() => setPostImageFile(null)}
                            style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', lineHeight: 1 }}>
                            <X size={12} />
                          </button>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                        <div>
                          <input type="file" id="post-img" accept="image/*" className="hidden" style={{ display: 'none' }}
                            onChange={e => e.target.files?.[0] && setPostImageFile(e.target.files[0])} />
                          <label htmlFor="post-img" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.35rem 0.75rem', borderRadius: '999px', transition: 'all var(--transition)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(194,110,61,0.08)'; e.currentTarget.style.color = 'var(--accent)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                            <ImageIcon size={15} /> Photo
                          </label>
                        </div>
                        <button type="submit" disabled={!postContent.trim() && !postImageFile}
                          className="btn btn-accent btn-sm" style={{ borderRadius: '999px', padding: '0.4rem 1.25rem', fontSize: '0.82rem' }}>
                          Publish
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Posts list */}
              {postsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div className="skeleton" style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div className="skeleton" style={{ height: '12px', width: '30%', marginBottom: '0.625rem' }} />
                          <div className="skeleton" style={{ height: '12px', width: '90%', marginBottom: '0.5rem' }} />
                          <div className="skeleton" style={{ height: '12px', width: '70%' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.6 }}>
                  <Edit3 size={40} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No discussions yet. {isMember ? 'Be the first to post!' : 'Join to start the conversation.'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {posts.map((post, i) => (
                    <div key={post._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <PostCard post={post} onCommentAdded={fetchPosts} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* ── RIGHT PANEL ── */}
        <aside className="tribe-right">
          {!loading && community && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <p className="community-sidebar-title">About this Tribe</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {community.description || 'A passionate community of readers.'}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Members</span>
                  <strong style={{ fontSize: '0.88rem' }}>{community.members?.length || 0}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Posts</span>
                  <strong style={{ fontSize: '0.88rem' }}>{posts.length}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Created by</span>
                  <strong style={{ fontSize: '0.78rem' }}>{community.createdBy?.name || 'Admin'}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p className="community-sidebar-title">Community Rules</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {['Be respectful to all members', 'No spoilers without tags', 'Stay on literary topics', 'No spam or self-promotion'].map((rule, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {isMember && (
                <div style={{ background: 'rgba(45,134,89,0.08)', border: '1px solid rgba(45,134,89,0.2)', borderRadius: '0.75rem', padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--success)', fontWeight: 700 }}>
                  <CheckCircle2 size={15} /> You are a member
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

export default CommunityDetails;
