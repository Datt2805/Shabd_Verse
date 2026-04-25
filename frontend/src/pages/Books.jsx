import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import BookCard from '../components/BookCard.jsx';
import { Search, Filter, BookOpen, Loader2, ArrowRight } from 'lucide-react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Biography', 'Self-Help', 'History'];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await API.get('/books');
        setBooks(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch books', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filtered = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || b.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container py-12">
      <div className="flex justify-between items-end gap-6" style={{ marginBottom: '3rem' }}>
        <div>
          <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>Curated Library</span>
          <h1>Explore The Verse</h1>
          <p className="text-muted">Discover your next favorite story among thousands of community listings.</p>
        </div>
        <Link to="/add-book" className="btn btn-accent">List a Book</Link>
      </div>

      <div className="grid grid-cols-4 lg-grid-cols-1 gap-8" style={{ marginBottom: '3rem' }}>
         <div className="premium-card" style={{ gridColumn: 'span 3', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Search className="text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search by title or author..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '1.1rem' }}
            />
         </div>
         <div className="premium-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Filter className="text-muted" size={18} />
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: 0, fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}
            >
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
         </div>
      </div>

      <div className="flex flex-wrap gap-2" style={{ marginBottom: '3rem' }}>
         {genres.map(g => (
           <button 
             key={g} 
             onClick={() => setSelectedGenre(g)}
             className={`badge ${selectedGenre === g ? 'badge-primary' : ''}`}
             style={{ 
               cursor: 'pointer', 
               background: selectedGenre === g ? 'var(--primary)' : 'var(--secondary)',
               color: selectedGenre === g ? 'white' : 'var(--primary)',
               border: 'none',
               padding: '0.5rem 1.25rem'
             }}
           >
             {g}
           </button>
         ))}
      </div>

      {loading ? (
        <div className="text-center py-24">
          <Loader2 className="animate-spin text-accent mx-auto" size={48} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 lg-grid-cols-2 sm-grid-cols-1 gap-8">
            {filtered.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24 premium-card">
               <BookOpen size={48} className="text-muted mx-auto" style={{ marginBottom: '1rem', opacity: 0.3 }} />
               <p>No books found matching your criteria.</p>
               <button onClick={() => { setSearch(''); setSelectedGenre('All'); }} className="btn btn-ghost" style={{ marginTop: '1rem' }}>Clear Filters</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Books;
