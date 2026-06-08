import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import ProductDetails from './components/ProductDetails';
import './index.css';

function App() {
  const isRenderDomain = window.location.hostname.endsWith('.onrender.com');

  return (
    <>
      <Helmet>
        <link rel="canonical" href="https://www.nutrasurgelabsreviews.com" />
        {isRenderDomain && <meta name="robots" content="noindex,nofollow" />}
      </Helmet>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/nutrasurge-login" element={<AdminLogin />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;


