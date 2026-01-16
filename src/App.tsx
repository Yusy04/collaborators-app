import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import SCity from './pages/SCity';
import { Collaborators } from './pages/Collaborators';
import ComingSoon from './pages/ComingSoon';

// Component to handle 404 redirects
// This handles direct access to routes (e.g., refreshing on /collaborators)
function RedirectHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's a stored route from 404.html
    const redirectRoute = sessionStorage.getItem('redirectRoute');
    if (redirectRoute && redirectRoute !== '/') {
      // Clear the stored route immediately
      sessionStorage.removeItem('redirectRoute');
      // Navigate to the stored route (replaces current location)
      // This keeps the user on the same page when refreshing
      navigate(redirectRoute, { replace: true });
    }
  }, [navigate]);
  
  return null;
}

function App() {
  return (
    <BrowserRouter basename="/collaborators-app">
      <RedirectHandler />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<SCity />} />
          <Route path="/collaborators" element={<Collaborators />} />
          <Route path="/market" element={<ComingSoon title="Market" />} />
          <Route path="/restaurants" element={<ComingSoon title="Restaurants" />} />
          <Route path="/grocery" element={<ComingSoon title="Grocery" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
