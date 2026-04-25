// Login Page — Professional Refactor
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, BookOpen, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back to the Verse!');
      navigate('/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access denied');
    }
  };

  return (
    <div className="container flex justify-center items-center py-24" style={{ minHeight: '80vh' }}>
      <div className="premium-card" style={{ maxWidth: '450px', width: '100%', overflow: 'hidden' }}>
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--primary)', color: 'white' }}>
           <div style={{ background: 'var(--accent)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <BookOpen size={30} color="white" />
           </div>
           <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Secure Sign In</h2>
           <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Return to your literary sanctuary</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '3rem' }}>
          <div className="form-group">
            <label><Mail size={14} style={{ marginRight: '0.5rem' }} /> Digital Address</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label><Lock size={14} style={{ marginRight: '0.5rem' }} /> Security Key</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'gray',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1rem' }}>
            Enter The Verse <ArrowRight size={20} />
          </button>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <span className="text-muted">New to ShabdVerse? </span>
            <Link to="/register" style={{ fontWeight: 800 }}>Join Community</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
