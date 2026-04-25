import { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'sonner';
import { Shield, Users, Book, Trash2, AlertTriangle, UserCheck, Clock, CheckCircle2, Mail } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalsLoading, setApprovalsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'approvals') {
      fetchPendingSellers();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, booksRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/books')
      ]);
      setUsers(usersRes.data.data || []);
      setBooks(booksRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load administrative data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingSellers = async () => {
    try {
      setApprovalsLoading(true);
      const res = await API.get('/admin/pending-sellers');
      setPendingSellers(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load pending sellers');
    } finally {
      setApprovalsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Terminate this user account permanently?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User account terminated');
    } catch (err) {
      toast.error('Termination failed');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Remove this book from the platform?')) return;
    try {
      await API.delete(`/books/${id}`);
      setBooks(books.filter(b => b._id !== id));
      toast.success('Book removed');
    } catch (err) {
      toast.error('Removal failed');
    }
  };

  const handleApproveSeller = async (id) => {
    try {
      await API.patch(`/admin/sellers/${id}/approve`);
      setPendingSellers(pendingSellers.filter(s => s._id !== id));
      toast.success('Seller approved! They can now log in.');
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  if (loading) return <div className="container py-24 text-center">Accessing administrative protocols...</div>;

  const thStyle = { padding: '1.25rem', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase' };
  const tdStyle = { padding: '1.25rem', borderBottom: '1px solid var(--border)' };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
        <div>
          <span className="badge badge-danger" style={{ marginBottom: '0.5rem' }}>Restricted Access</span>
          <h1>Command Center</h1>
          <p className="text-muted">Global oversight and ecosystem moderation.</p>
        </div>
        <Shield size={48} className="text-accent" style={{ opacity: 0.2 }} />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4" style={{ marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('users')} className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}>
          <Users size={18} /> User Management ({users.length})
        </button>
        <button onClick={() => setActiveTab('books')} className={`btn ${activeTab === 'books' ? 'btn-primary' : 'btn-ghost'}`}>
          <Book size={18} /> Content Moderation ({books.length})
        </button>
        <button onClick={() => setActiveTab('approvals')} className={`btn ${activeTab === 'approvals' ? 'btn-primary' : 'btn-ghost'}`} style={{ position: 'relative' }}>
          <UserCheck size={18} /> Seller Approvals
          {pendingSellers.length > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-6px',
              background: 'var(--danger)', color: 'white',
              borderRadius: '50%', width: '20px', height: '20px',
              fontSize: '0.65rem', fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {pendingSellers.length}
            </span>
          )}
        </button>
      </div>

      <div className="premium-card" style={{ overflow: 'hidden' }}>

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--primary)', color: 'white' }}>
              <tr>
                <th style={thStyle}>Identity</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem', fontWeight: 700 }}>{u.name}</td>
                  <td style={{ padding: '1.25rem', opacity: 0.7 }}>{u.email}</td>
                  <td style={{ padding: '1.25rem' }}>
                    <span className="badge" style={{
                      background: u.role === 'admin' ? 'var(--accent)' : 'var(--secondary)',
                      color: u.role === 'admin' ? 'white' : 'var(--primary)'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    {u.role === 'seller' ? (
                      u.isApproved
                        ? <span className="badge" style={{ background: 'rgba(34,197,94,0.15)', color: '#16a34a', border: '1px solid #16a34a' }}><CheckCircle2 size={12} style={{ marginRight: '0.3rem' }} />Approved</span>
                        : <span className="badge" style={{ background: 'rgba(234,179,8,0.15)', color: '#b45309', border: '1px solid #b45309' }}><Clock size={12} style={{ marginRight: '0.3rem' }} />Pending</span>
                    ) : (
                      <span className="badge" style={{ background: 'var(--secondary)', color: 'var(--text-muted)', fontSize: '0.65rem' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <button onClick={() => handleDeleteUser(u._id)} className="btn btn-ghost" style={{ color: 'var(--danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Books Tab ── */}
        {activeTab === 'books' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--primary)', color: 'white' }}>
              <tr>
                <th style={thStyle}>Artifact</th>
                <th style={thStyle}>Author</th>
                <th style={thStyle}>Value</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <p style={{ fontWeight: 800 }}>{b.title}</p>
                    <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>{b.genre}</p>
                  </td>
                  <td style={{ padding: '1.25rem', opacity: 0.7 }}>{b.author}</td>
                  <td style={{ padding: '1.25rem', fontWeight: 900 }}>₹{b.price}</td>
                  <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <button onClick={() => handleDeleteBook(b._id)} className="btn btn-ghost" style={{ color: 'var(--danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Seller Approvals Tab ── */}
        {activeTab === 'approvals' && (
          approvalsLoading ? (
            <div style={{ padding: '6rem', textAlign: 'center' }}>
              <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto' }} />
            </div>
          ) : pendingSellers.length === 0 ? (
            <div style={{ padding: '6rem', textAlign: 'center' }}>
              <CheckCircle2 size={56} style={{ color: '#16a34a', opacity: 0.4, margin: '0 auto 1.5rem', display: 'block' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>All Clear</h3>
              <p className="text-muted">No sellers are awaiting approval at this time.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--primary)', color: 'white' }}>
                <tr>
                  <th style={thStyle}>Seller</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Registered</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingSellers.map(seller => (
                  <tr key={seller._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: 'var(--secondary)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '1rem', fontWeight: 900, color: 'var(--accent)'
                        }}>
                          {seller.name?.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 700 }}>{seller.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7 }}>
                        <Mail size={14} /> {seller.email}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem', opacity: 0.6, fontSize: '0.85rem' }}>
                      {new Date(seller.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleApproveSeller(seller._id)}
                        className="btn btn-accent btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <CheckCircle2 size={15} /> Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      <div className="flex items-center gap-2" style={{ marginTop: '2rem', opacity: 0.5, fontSize: '0.8rem', fontWeight: 700 }}>
        <AlertTriangle size={16} /> ALL ADMINISTRATIVE ACTIONS ARE LOGGED AND PERMANENT.
      </div>
    </div>
  );
};

export default AdminPanel;
