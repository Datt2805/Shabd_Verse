// AddBook Page — Professional Refactor
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'sonner';
import { Plus, ArrowLeft } from 'lucide-react';
import BookForm from '../components/BookForm';

const AddBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddBook = async (formData, image) => {
    setLoading(true);
    const loadingToast = toast.loading('Listing your book...');
    try {
      let coverImage = '';
      if (image) {
        const imgData = new FormData();
        imgData.append('image', image);
        const uploadRes = await API.post('/upload', imgData);
        coverImage = uploadRes.data.url;
      }

      await API.post('/books', { ...formData, coverImage });
      toast.success('Book listed successfully!', { id: loadingToast });
      navigate('/profile');
    } catch (err) {
      toast.error('Failed to list book', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="premium-card mx-auto" style={{ maxWidth: '800px', overflow: 'hidden' }}>
        <div style={{ padding: '3rem', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
           <div style={{ background: 'var(--accent)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Plus size={30} color="white" />
           </div>
           <h2 style={{ color: 'white' }}>List A New Treasure</h2>
           <p style={{ opacity: 0.6 }}>Share your collection with the world</p>
        </div>

        <BookForm 
          onSubmit={handleAddBook} 
          loading={loading} 
          submitText="Complete Listing" 
        />
      </div>
    </div>
  );
};

export default AddBook;
