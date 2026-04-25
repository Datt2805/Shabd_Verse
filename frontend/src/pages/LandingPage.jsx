// Landing Page — Professional Upgrade
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/axios';
import BookCard from '../components/BookCard.jsx';
import { 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  Star, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
  Mail,
  CheckCircle2
} from 'lucide-react';

const useScrollAnimation = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

const AnimatedSection = ({ children, className = '', delay = '' }) => {
  const [ref, visible] = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`${className} ${visible ? `animate-fade-in-up ${delay}` : ''}`}
      style={{ opacity: visible ? 1 : 0 }}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/books?limit=4');
        setFeaturedBooks(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch books', err);
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="landing-wrapper">
      {/* ── Hero Section ── */}
      <section className="hero-section py-24" style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div className="container grid grid-cols-2 lg-grid-cols-1 gap-12 items-center">
          <div className="hero-content">
            <AnimatedSection>
              <span className="badge badge-accent" style={{ marginBottom: '1.5rem' }}>The Literary Renaissance</span>
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                Where Every <span className="text-accent">Chapter</span> Finds Its Tribe.
              </h1>
              <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '600px' }}>
                ShabdVerse is more than a marketplace. It's a sanctuary for readers, 
                a platform for sellers, and a home for literary communities.
              </p>
            </AnimatedSection>

            <AnimatedSection delay="delay-2" className="flex gap-4">
              {user ? (
                <Link to="/books" className="btn btn-accent btn-lg">
                  Enter The Library <ChevronRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">Join The Verse</Link>
                  <Link to="/books" className="btn btn-outline btn-lg">Browse Books</Link>
                </>
              )}
            </AnimatedSection>

            <AnimatedSection delay="delay-3" className="flex items-center gap-8" style={{ marginTop: '3rem', opacity: 0.7 }}>
              <div>
                <span style={{ display: 'block', fontSize: '2rem', fontWeight: 900 }}>5K+</span>
                <span className="badge" style={{ padding: 0, fontSize: '0.7rem' }}>Listings</span>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
              <div>
                <span style={{ display: 'block', fontSize: '2rem', fontWeight: 900 }}>1.2K</span>
                <span className="badge" style={{ padding: 0, fontSize: '0.7rem' }}>Readers</span>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
              <div>
                <span style={{ display: 'block', fontSize: '2rem', fontWeight: 900 }}>80+</span>
                <span className="badge" style={{ padding: 0, fontSize: '0.7rem' }}>Tribes</span>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay="delay-2" className="hero-image md-grid-cols-1" style={{ position: 'relative' }}>
            <div className="premium-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)' }}>
              <img 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Books Hero" 
                style={{ borderRadius: '1rem', width: '100%' }}
              />
            </div>
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Star className="text-accent" fill="var(--accent)" />
               <div>
                 <p style={{ fontSize: '0.7rem', fontWeight: 900 }}>TOP RATED CHOICE</p>
                 <p className="text-muted" style={{ fontSize: '0.6rem' }}>Community Approved</p>
               </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="features-section py-24" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <AnimatedSection>
              <h2>A Unified Ecosystem</h2>
              <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                Discover the four pillars of ShabdVerse, designed to elevate your literary experience.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-4 lg-grid-cols-2 sm-grid-cols-1 gap-8">
            <AnimatedSection delay="delay-1">
              <div className="premium-card" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(194, 110, 61, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                  <ShoppingBag className="text-accent mx-auto" />
                </div>
                <h3>Curated Catalog</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', flex: 1 }}>Browse a diverse collection of books across every conceivable genre.</p>
                <Link to="/books" className="text-accent flex items-center gap-2" style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Explore <ArrowRight size={16} />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay="delay-2">
              <div className="premium-card" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(30, 42, 56, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                  <Users className="text-primary mx-auto" />
                </div>
                <h3>Vibrant Tribes</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', flex: 1 }}>Join specialized circles of readers who share your niche passions.</p>
                <Link to="/communities" className="text-primary flex items-center gap-2" style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Connect <ArrowRight size={16} />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay="delay-3">
              <div className="premium-card" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(212, 160, 23, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                  <Zap className="text-accent mx-auto" />
                </div>
                <h3>Direct Trading</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', flex: 1 }}>Buy and sell directly from fellow enthusiasts with secure processing.</p>
                <Link to="/marketplace" className="text-accent flex items-center gap-2" style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Trade <ArrowRight size={16} />
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay="delay-4">
              <div className="premium-card" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(45, 134, 89, 0.1)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                  <MessageSquare className="text-primary mx-auto" />
                </div>
                <h3>Live Exchange</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', flex: 1 }}>Engage in real-time chat and debate within your chosen tribes.</p>
                <Link to="/communities" className="text-primary flex items-center gap-2" style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Discuss <ArrowRight size={16} />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Featured Books Section ── */}
      <section className="featured-section py-24" style={{ backgroundColor: 'var(--secondary)', opacity: 0.8 }}>
        <div className="container">
          <div className="flex justify-between items-end gap-6" style={{ marginBottom: '4rem' }}>
            <AnimatedSection>
              <h2>Recently Uncovered</h2>
              <p className="text-muted">Fresh additions to the community library.</p>
            </AnimatedSection>
            <AnimatedSection delay="delay-1">
              <Link to="/books" className="btn btn-ghost" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                View All Catalog <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
          </div>

          {loadingBooks ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-accent" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-4 lg-grid-cols-2 sm-grid-cols-1 gap-8">
              {featuredBooks.map((book, i) => (
                <AnimatedSection key={book._id} delay={`delay-${i+1}`}>
                  <BookCard book={book} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Security Section ── */}
      <section className="security-section py-24" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="container grid grid-cols-2 lg-grid-cols-1 gap-12 items-center">
          <AnimatedSection className="flex flex-col gap-8">
            <span className="badge badge-accent" style={{ alignSelf: 'flex-start' }}>Verified Ecosystem</span>
            <h2 style={{ color: 'white' }}>A Marketplace Built On <span className="text-accent">Authentic</span> Connections.</h2>
            <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>
              Every transaction on ShabdVerse is underpinned by a peer-review system 
              and a community-driven reputation model. We prioritize trust so you can 
              prioritize the story.
            </p>
            <div className="grid grid-cols-2 gap-8">
               <div className="flex gap-4">
                 <ShieldCheck className="text-accent" size={32} />
                 <div>
                   <h4 style={{ color: 'white', marginBottom: '0.25rem' }}>Secure Exchange</h4>
                   <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Moderated interactions and reliable trading protocols.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <Globe className="text-accent" size={32} />
                 <div>
                   <h4 style={{ color: 'white', marginBottom: '0.25rem' }}>Global Access</h4>
                   <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Connect with book lovers across the nation instantly.</p>
                 </div>
               </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay="delay-2">
            <div className="grid grid-cols-2 gap-4">
               <div className="premium-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--highlight)' }}>4.9★</span>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', marginTop: '0.5rem' }}>Avg. Rating</p>
               </div>
               <div className="premium-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)' }}>12K+</span>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', marginTop: '0.5rem' }}>Daily Chats</p>
               </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="cta-section py-24 text-center">
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection className="flex flex-col gap-8">
            <h2 style={{ fontSize: '3.5rem' }}>Begin Your Odyssey.</h2>
            <p className="text-muted" style={{ fontSize: '1.25rem' }}>
              Join the thousands of readers who have already found their tribe. 
              Your next favorite book is waiting for you.
            </p>
            <div className="flex justify-center gap-6">
              {user ? (
                <Link to="/books" className="btn btn-accent btn-lg">Go to Library</Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">Create Account</Link>
                  <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
                </>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer py-12" style={{ backgroundColor: 'var(--secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid grid-cols-4 lg-grid-cols-2 sm-grid-cols-1 gap-12" style={{ marginBottom: '4rem' }}>
            <div className="flex flex-col gap-6">
              <h3 style={{ fontSize: '1.5rem' }}>📚 ShabdVerse</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                A community-driven sanctuary where stories find their readers 
                and every reader finds their tribe.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Discover</h4>
              <Link to="/books" className="text-muted" style={{ fontSize: '0.9rem' }}>Curated Library</Link>
              <Link to="/communities" className="text-muted" style={{ fontSize: '0.9rem' }}>Vibrant Tribes</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Account</h4>
              <Link to="/profile" className="text-muted" style={{ fontSize: '0.9rem' }}>User Dashboard</Link>
              <Link to="/login" className="text-muted" style={{ fontSize: '0.9rem' }}>Secure Sign In</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Newsletter</h4>
              <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: '0.5rem' }}>
                {subscribed ? (
                   <p className="text-accent" style={{ fontWeight: 800, fontSize: '0.9rem' }}>Subscribed!</p>
                ) : (
                  <>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ padding: '0.5rem 1rem', flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary btn-sm"><ArrowRight size={16} /></button>
                  </>
                )}
              </form>
            </div>
          </div>
          <div className="text-center pt-8" style={{ borderTop: '1px solid var(--border)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
             © {new Date().getFullYear()} ShabdVerse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
