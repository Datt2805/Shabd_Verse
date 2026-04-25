// Register Page — Professional Refactor
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'sonner';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'reader' });
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Welcome to the ShabdVerse community!');
      navigate('/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container flex justify-center items-center py-24" style={{ minHeight: '80vh' }}>
      <div className="premium-card" style={{ maxWidth: '550px', width: '100%', overflow: 'hidden' }}>
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--primary)', color: 'white' }}>
           <div style={{ background: 'var(--accent)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <ShieldCheck size={30} color="white" />
           </div>
           <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Join The Verse</h2>
           <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Initialize your literary odyssey today</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '3rem' }}>
          <div className="grid grid-cols-2 gap-6">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label><User size={14} style={{ marginRight: '0.5rem' }} /> Full Legal Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label><Mail size={14} style={{ marginRight: '0.5rem' }} /> Digital Address</label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label><Lock size={14} style={{ marginRight: '0.5rem' }} /> Security Key</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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
            <div className="form-group">
              <label>Role</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
              >
                <option value="reader">Reader</option>
                <option value="seller">Seller</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '1rem' }}>
            Initialize Account <ArrowRight size={20} />
          </button>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <span className="text-muted">Already a member? </span>
            <Link to="/login" style={{ fontWeight: 800 }}>Sign In Securely</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
