import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/axios';
import { 
  User, 
  Book as BookIcon, 
  ShoppingBag, 
  Settings, 
  Package, 
  Plus,
  Trash2,
  ExternalLink,
  Edit3,
  MapPin,
  Mail,
  Trophy,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [userBooks, setUserBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name || '', email: user.email || '' });
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [booksRes, ordersRes] = await Promise.all([
        API.get(`/books?addedBy=${user._id}`),
        API.get('/marketplace/orders')
      ]);
      setUserBooks(booksRes.data.data || []);
      setOrders(ordersRes.data.data || []);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const loadingToast = toast.loading('Updating avatar...');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const res = await API.put('/users/profile', { avatar: uploadRes.data.url });
      if (res.data.success) {
        setUser(res.data.data);
        toast.success('Avatar updated successfully', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Failed to update avatar', { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/users/profile', editForm);
      if (res.data.success) {
        setUser(res.data.data);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to remove this book?')) return;
    try {
      await API.delete(`/books/${id}`);
      setUserBooks(userBooks.filter(b => b._id !== id));
      toast.success('Book removed from your library');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/marketplace/order/${orderId}`, { status });
      toast.success(`Order marked as ${status}`);
      fetchProfileData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (!user) return <div className="container py-24 text-center">Loading profile...</div>;

  const buyerOrders = orders.filter(o => o.buyer?._id === user._id);
  const sellerOrders = orders.filter(o => o.seller?._id === user._id);
  const activeListings = userBooks?.filter(b => b.isForSale).length || 0;

  const canAccessLibrary = ['seller', 'admin'].includes(user?.role);

  // If a non-seller lands on the library tab, redirect to overview
  useEffect(() => {
    if (!canAccessLibrary && activeTab === 'books') {
      setActiveTab('overview');
    }
  }, [canAccessLibrary, activeTab]);

  return (
    <div className="container py-12">
      {/* Header Profile Section */}
      <div className="premium-card" style={{ padding: '2.5rem', marginBottom: '3rem', display: 'flex', gap: '2.5rem', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', background: 'var(--accent)' }} />
        
        <div style={{ position: 'relative' }}>
          <div style={{ width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--secondary)', boxShadow: 'var(--shadow)', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '3rem', color: 'var(--accent)', fontWeight: 800 }}>{user.name?.charAt(0)}</span>
            )}
          </div>
          <label style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'var(--accent)', color: 'white', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', boxShadow: 'var(--shadow-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white' }}>
            <input type="file" hidden onChange={handleAvatarChange} disabled={uploading} />
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          </label>
        </div>
        
        <div style={{ flex: 1 }}>
          <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>{user.role}</span>
          <h1 style={{ marginBottom: '1rem' }}>{user.name}</h1>
          <div className="flex gap-4">
             <span className="badge" style={{ background: 'var(--secondary)', color: 'var(--primary)', padding: '0.5rem 1rem' }}>
               <Mail size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> {user.email}
             </span>
             <span className="badge" style={{ background: 'var(--secondary)', color: 'var(--primary)', padding: '0.5rem 1rem' }}>
               <Calendar size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
             </span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="premium-card" style={{ padding: '1.5rem', textAlign: 'center', minWidth: '120px', background: 'var(--secondary)', border: 'none' }}>
            <span style={{ display: 'block', fontSize: '2rem', fontWeight: 900 }}>{userBooks.length}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Books</span>
          </div>
          <div className="premium-card" style={{ padding: '1.5rem', textAlign: 'center', minWidth: '120px', background: 'var(--secondary)', border: 'none' }}>
            <span style={{ display: 'block', fontSize: '2rem', fontWeight: 900 }}>{buyerOrders.length}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>Orders</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Section */}
      <div className="tabs-container">
        <div className="flex gap-2" style={{ background: 'rgba(0,0,0,0.03)', padding: '0.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setActiveTab('overview')} className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
            <User size={16} /> Overview
          </button>
          {canAccessLibrary && (
          <button onClick={() => setActiveTab('books')} className={`btn ${activeTab === 'books' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
            <BookIcon size={16} /> Library
          </button>
          )}
          <button onClick={() => setActiveTab('orders')} className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
            <Package size={16} /> Purchases
          </button>
          {(user.role === 'seller' || user.role === 'admin') && (
            <button onClick={() => setActiveTab('selling')} className={`btn ${activeTab === 'selling' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
              <ShoppingBag size={16} /> Sales
            </button>
          )}
          <button onClick={() => setActiveTab('settings')} className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
            <Settings size={16} /> Settings
          </button>
        </div>

        <div className="tab-content animate-fade-in-up">
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-3 md-grid-cols-1 gap-8">
                <div className="premium-card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Books</h4>
                  <p style={{ fontSize: '2.5rem', fontWeight: 900 }}>{userBooks.length}</p>
                </div>
                <div className="premium-card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Active Listings</h4>
                  <p style={{ fontSize: '2.5rem', fontWeight: 900 }}>{activeListings}</p>
                </div>
                <div className="premium-card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Completed Sales</h4>
                  <p style={{ fontSize: '2.5rem', fontWeight: 900 }}>{sellerOrders.filter(o => o.status === 'delivered').length}</p>
                </div>
              </div>

              <div className="premium-card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '2rem', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                   <div>
                     <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>Recent Activity</h3>
                     <p style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase' }}>Platform Interactions</p>
                   </div>
                   <Trophy size={32} style={{ opacity: 0.3 }} />
                </div>
                <div style={{ padding: '0' }}>
                   {orders.length === 0 ? (
                     <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>No recent transactions</div>
                   ) : (
                     orders.slice(0, 5).map(order => (
                       <div key={order._id} style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <div style={{ background: 'var(--secondary)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            {order.buyer?._id === user._id ? <ShoppingBag className="text-accent" /> : <Package className="text-accent" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 800 }}>{order.book?.title}</p>
                            <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>{new Date(order.createdAt).toLocaleDateString()} • {order.status}</p>
                          </div>
                          <div style={{ fontWeight: 900, fontSize: '1.25rem' }}>₹{order.price}</div>
                       </div>
                     ))
                   )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="flex flex-col gap-8">
               <div className="flex justify-between items-center">
                  <div>
                    <h2>Your Library</h2>
                    <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Management Console</p>
                  </div>
                  <Link to="/add-book" className="btn btn-accent"><Plus size={20} /> List New Book</Link>
               </div>

               {userBooks.length === 0 ? (
                 <div className="premium-card" style={{ padding: '6rem', textAlign: 'center', border: '2px dashed var(--border)', background: 'transparent' }}>
                    <BookIcon size={48} className="text-muted mx-auto" style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>Your library is empty. Start sharing your literary treasures!</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-8">
                    {userBooks.map(book => (
                      <div key={book._id} className="premium-card" style={{ display: 'flex', flexDirection: 'column' }}>
                         <div style={{ height: '200px', background: 'var(--secondary)', overflow: 'hidden', position: 'relative' }}>
                            {book.coverImage ? <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <BookIcon className="mx-auto" size={40} style={{ marginTop: '80px', opacity: 0.1 }} />}
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                               <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>{book.condition}</span>
                               {book.isForSale && <span className="badge badge-accent" style={{ fontSize: '0.6rem' }}>₹{book.price}</span>}
                            </div>
                         </div>
                         <div style={{ padding: '1.5rem', flex: 1 }}>
                            <h4 style={{ marginBottom: '0.25rem' }}>{book.title}</h4>
                            <p className="text-accent" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{book.author}</p>
                            <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                               <span className="badge" style={{ background: 'var(--secondary)', fontSize: '0.6rem' }}>{book.genre}</span>
                               <span className="badge" style={{ border: '1px solid var(--border)', fontSize: '0.6rem' }}>Qty: {book.quantity}</span>
                            </div>
                         </div>
                         <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                            <Link to={`/books/${book._id}`} className="btn btn-ghost btn-sm"><ExternalLink size={14} /> Details</Link>
                            <Link to={`/edit-book/${book._id}`} className="btn btn-ghost btn-sm"><Edit3 size={14} /> Edit</Link>
                            <button onClick={() => handleDeleteBook(book._id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}><Trash2 size={14} /> Remove</button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="flex flex-col gap-8">
               <h2>Your Purchases</h2>
               {buyerOrders.length === 0 ? (
                 <div className="premium-card" style={{ padding: '6rem', textAlign: 'center' }}>
                    <p>No orders yet. Discover your next favorite story in our marketplace!</p>
                 </div>
               ) : (
                 <div className="flex flex-col gap-6">
                    {buyerOrders.map(order => (
                      <div key={order._id} className="premium-card" style={{ display: 'flex', overflow: 'hidden' }}>
                         <div style={{ width: '120px', background: 'var(--secondary)', shrink: 0 }}>
                            {order.book?.coverImage && <img src={order.book.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          </div>
                          <div style={{ padding: '2rem', flex: 1, display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                             <div>
                               <h3>{order.book?.title}</h3>
                               <p className="text-accent" style={{ fontSize: '0.75rem', fontWeight: 800 }}>Seller: {order.seller?.name}</p>
                               <div className="flex gap-8" style={{ marginTop: '1.5rem' }}>
                                  <div>
                                    <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.5 }}>Quantity</p>
                                    <p style={{ fontWeight: 800 }}>{order.quantity}</p>
                                  </div>
                                  <div>
                                    <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.5 }}>Investment</p>
                                    <p style={{ fontWeight: 800, color: 'var(--accent)' }}>₹{order.price}</p>
                                  </div>
                               </div>
                             </div>
                             <div style={{ textAlign: 'right' }}>
                                <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-primary'}`} style={{ padding: '0.5rem 1.5rem', marginBottom: '1rem' }}>{order.status}</span>
                                <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {activeTab === 'selling' && (
            <div className="flex flex-col gap-8">
               <h2>Sales Dashboard</h2>
               {sellerOrders.length === 0 ? (
                 <div className="premium-card" style={{ padding: '6rem', textAlign: 'center' }}>
                    <p>No sales recorded yet.</p>
                 </div>
               ) : (
                 <div className="flex flex-col gap-6">
                    {sellerOrders.map(order => (
                      <div key={order._id} className="premium-card" style={{ display: 'flex' }}>
                         <div style={{ padding: '2rem', flex: 1, borderRight: '1px solid var(--border)' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                               <h3>{order.book?.title}</h3>
                               <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent)' }}>₹{order.price}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                               <div>
                                 <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.5 }}>Buyer</p>
                                 <p style={{ fontWeight: 800 }}>{order.buyerName || order.buyer?.name}</p>
                               </div>
                               <div>
                                 <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.5 }}>Units</p>
                                 <p style={{ fontWeight: 800 }}>{order.quantity}</p>
                               </div>
                               <div style={{ gridColumn: 'span 2', background: 'var(--secondary)', padding: '1rem', borderRadius: '1rem' }}>
                                  <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.5 }}><MapPin size={10} /> Destination</p>
                                  <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{order.deliveryAddress}</p>
                               </div>
                            </div>
                         </div>
                         <div style={{ padding: '2rem', width: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
                            <div className="form-group">
                               <label>Status</label>
                               <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)}>
                                  <option value="pending">Pending</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="rejected">Rejected</option>
                               </select>
                            </div>
                            <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>Logged: {new Date(order.createdAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex flex-col gap-8" style={{ maxWidth: '600px' }}>
               <div className="premium-card">
                  <div style={{ height: '6px', background: 'var(--accent)' }} />
                  <div style={{ padding: '2rem' }}>
                     <h2>Account Security</h2>
                     <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '2rem' }}>Identity Management</p>
                     
                     {!isEditing ? (
                       <div className="flex flex-col gap-8">
                          <div className="grid grid-cols-2 gap-8">
                             <div>
                                <label>Legal Name</label>
                                <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{user.name}</p>
                             </div>
                             <div>
                                <label>Email Address</label>
                                <p style={{ fontSize: '1.25rem', fontWeight: 800 }}>{user.email}</p>
                             </div>
                             <div>
                                <label>Privilege</label>
                                <span className="badge" style={{ background: 'var(--secondary)' }}>{user.role}</span>
                             </div>
                          </div>
                          <button onClick={() => setIsEditing(true)} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Modify Credentials</button>
                       </div>
                     ) : (
                       <form onSubmit={handleProfileUpdate} className="flex flex-col gap-6">
                          <div className="form-group">
                             <label>Identity</label>
                             <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} required />
                          </div>
                          <div className="form-group">
                             <label>Email</label>
                             <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} required />
                          </div>
                          <div className="flex gap-4">
                             <button type="submit" className="btn btn-accent">Commit Changes</button>
                             <button type="button" onClick={() => setIsEditing(false)} className="btn btn-ghost">Discard</button>
                          </div>
                       </form>
                     )}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default Profile;
