import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'sonner';
import { Edit3, ArrowLeft } from 'lucide-react';
import BookForm from '../components/BookForm';

const EditBook = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setInitialData(res.data);
      } catch (err) {
        toast.error('Failed to load book data');
        navigate('/profile');
      } finally {
        setFetching(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleEditBook = async (formData, image) => {
    setLoading(true);
    const loadingToast = toast.loading('Updating book details...');
    try {
      let coverImage = initialData.coverImage;
      if (image) {
        const imgData = new FormData();
        imgData.append('image', image);
        const uploadRes = await API.post('/upload', imgData);
        coverImage = uploadRes.data.url;
      }

      await API.put(`/books/${id}`, { ...formData, coverImage });
      toast.success('Book updated successfully!', { id: loadingToast });
      navigate('/profile');
    } catch (err) {
      toast.error('Failed to update book', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="container py-24 text-center">Loading book details...</div>;
  }

  return (
    <div className="container py-12">
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="premium-card mx-auto" style={{ maxWidth: '800px', overflow: 'hidden' }}>
        <div style={{ padding: '3rem', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
           <div style={{ background: 'var(--accent)', width: '60px', height: '60px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Edit3 size={30} color="white" />
           </div>
           <h2 style={{ color: 'white' }}>Edit Book Details</h2>
           <p style={{ opacity: 0.6 }}>Update the information for your listing</p>
        </div>

        <BookForm 
          initialData={initialData}
          onSubmit={handleEditBook} 
          loading={loading} 
          submitText="Save Changes" 
        />
      </div>
    </div>
  );
};

export default EditBook;
