import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';

const BookForm = ({ initialData, onSubmit, loading, submitText }) => {
  const [formData, setFormData] = useState({
    title: '', author: '', genre: 'Fiction', condition: 'good',
    price: '', quantity: 1, description: '', isForSale: true
  });
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        genre: initialData.genre || 'Fiction',
        condition: initialData.condition || 'good',
        price: initialData.price || '',
        quantity: initialData.quantity || 1,
        description: initialData.description || '',
        isForSale: initialData.isForSale !== undefined ? initialData.isForSale : true
      });
      if (initialData.coverImage) {
        setCurrentImageUrl(initialData.coverImage);
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, image);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '3rem' }}>
       <div className="grid grid-cols-2 gap-8">
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
             <label>Book Title <span style={{ color: 'var(--danger)' }}>*</span></label>
             <input type="text" placeholder="The Great Gatsby" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required minLength={2} />
          </div>
          <div className="form-group">
             <label>Author <span style={{ color: 'var(--danger)' }}>*</span></label>
             <input type="text" placeholder="F. Scott Fitzgerald" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} required minLength={2} />
          </div>
          <div className="form-group">
             <label>Genre <span style={{ color: 'var(--danger)' }}>*</span></label>
             <select value={formData.genre} onChange={(e) => setFormData({...formData, genre: e.target.value})} required>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Mystery">Mystery</option>
                <option value="Biography">Biography</option>
             </select>
          </div>
          <div className="form-group">
             <label>Condition <span style={{ color: 'var(--danger)' }}>*</span></label>
             <select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} required>
                <option value="new">New</option>
                 <option value="like new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
             </select>
          </div>
          <div className="form-group">
             <label>Price (₹) <span style={{ color: 'var(--danger)' }}>*</span></label>
             <input type="number" placeholder="499" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required min={0} />
          </div>
          <div className="form-group">
             <label>Quantity <span style={{ color: 'var(--danger)' }}>*</span></label>
             <input type="number" placeholder="1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} required min={1} />
          </div>
          
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
             <label>Description <span style={{ color: 'var(--danger)' }}>*</span></label>
             <textarea rows="4" placeholder="Briefly describe the book's condition and content..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required minLength={10} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
             <label>Cover Image {initialData && ' (Leave blank to keep existing)'}</label>
             <div style={{ border: '2px dashed var(--border)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius)' }}>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} style={{ display: 'none' }} id="cover-upload" accept="image/jpeg,image/png,image/webp" />
                <label htmlFor="cover-upload" style={{ cursor: 'pointer', margin: 0, textTransform: 'none' }}>
                   {currentImageUrl && !image ? (
                     <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                       <img src={currentImageUrl} alt="Current Cover" style={{ maxHeight: '100px', borderRadius: 'var(--radius)' }} />
                     </div>
                   ) : (
                     <Upload size={32} className="text-accent mx-auto" style={{ marginBottom: '1rem' }} />
                   )}
                   <p style={{ fontWeight: 800 }}>{image ? image.name : 'Click to upload book cover'}</p>
                   <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>JPG, PNG or WEBP (Max 2MB)</p>
                </label>
             </div>
          </div>
       </div>

       <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '2rem' }}>
          {loading ? 'Processing...' : submitText}
       </button>
    </form>
  );
};

export default BookForm;
