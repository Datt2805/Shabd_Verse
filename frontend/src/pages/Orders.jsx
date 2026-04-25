import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/axios';
import { Package, Calendar, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get('/marketplace/orders');
        // Filter for orders where the user is the buyer
        const buyerOrders = (res.data.data || []).filter(o => o.buyer?._id === user?._id);
        setOrders(buyerOrders);
      } catch (err) {
        toast.error('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="container py-12">
      <div style={{ marginBottom: '3rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>History</span>
        <h1>Your Acquisitions</h1>
        <p className="text-muted">Track your journeys through the Verse.</p>
      </div>

      {loading ? (
        <div className="text-center py-24">
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto' }}></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="premium-card" style={{ padding: '6rem', textAlign: 'center' }}>
          <Package size={64} className="text-muted mx-auto" style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
          <h3>No acquisitions recorded</h3>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>Your library awaits its first addition.</p>
          <a href="/books" className="btn btn-primary">Browse Catalog</a>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map(order => (
            <div key={order._id} className="premium-card" style={{ display: 'flex', overflow: 'hidden' }}>
               <div style={{ width: '150px', background: 'var(--secondary)', flexShrink: 0 }}>
                  {order.book?.coverImage && <img src={order.book.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
               </div>
               <div style={{ padding: '2rem', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="flex flex-col gap-4">
                     <div>
                        <h3 style={{ marginBottom: '0.25rem' }}>{order.book?.title}</h3>
                        <p className="text-accent" style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Seller: {order.seller?.name}</p>
                     </div>
                     <div className="flex gap-8">
                        <div className="flex items-center gap-2">
                           <Calendar size={16} className="text-muted" />
                           <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <CreditCard size={16} className="text-muted" />
                           <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>₹{order.price}</span>
                        </div>
                     </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-primary'}`} style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem' }}>
                        {order.status}
                     </span>
                     <p style={{ marginTop: '1rem', fontSize: '0.75rem', fontWeight: 700, opacity: 0.5 }}>ORDER ID: #{order._id.slice(-8).toUpperCase()}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
