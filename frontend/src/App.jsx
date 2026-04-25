import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/sonner.tsx';
import { AuthProvider } from './context/AuthContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Books from './pages/Books.jsx';
import BookDetails from './pages/BookDetails.jsx';
import AddBook from './pages/AddBook.jsx';
import EditBook from './pages/EditBook.jsx';
import Communities from './pages/Communities.jsx';
import CommunityDetails from './pages/CommunityDetails.jsx';
import CreateCommunity from './pages/CreateCommunity.jsx';
import Orders from './pages/Orders.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import Profile from './pages/Profile.jsx';

// Hides Navbar on the landing page
const AppLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <>
      {!isLanding && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/communities/:id" element={<CommunityDetails />} />

        {/* Protected routes */}
        <Route path="/communities/create" element={<PrivateRoute><CreateCommunity /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* Seller / Admin only */}
        <Route path="/add-book" element={<PrivateRoute roles={['seller', 'admin']}><AddBook /></PrivateRoute>} />
        <Route path="/edit-book/:id" element={<PrivateRoute roles={['seller', 'admin']}><EditBook /></PrivateRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminPanel /></PrivateRoute>} />
      </Routes>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppLayout />
      <Toaster />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
