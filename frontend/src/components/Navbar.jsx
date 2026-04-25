// Navbar — shows navigation links based on auth state and role
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogOut, User, BookOpen, Users, Package, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">📚 ShabdVerse</Link>
      <div className="nav-links">
        <Link to="/books" className="nav-link"><BookOpen size={18} /> Books</Link>
        <Link to="/communities" className="nav-link"><Users size={18} /> Community</Link>
        
        {user ? (
          <>
            <Link to="/orders" className="nav-link"><Package size={18} /> Orders</Link>
            <Link to="/profile" className="nav-link"><User size={18} /> Profile</Link>
            
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link"><LayoutDashboard size={18} /> Admin</Link>
            )}
            
            <button onClick={logout} className="btn btn-accent btn-sm" style={{ marginLeft: '1rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link"><LogIn size={18} /> Login</Link>
            <Link to="/register" className="btn btn-accent btn-sm" style={{ marginLeft: '1rem' }}>
              <UserPlus size={16} /> Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
