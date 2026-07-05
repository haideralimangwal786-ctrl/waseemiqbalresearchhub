import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResearchImpact from './components/ResearchImpact';
import About from './components/About';
import Research from './components/Research';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Qualifications from './components/Qualifications';
import Experience from './components/Experience';
import Events from './components/Events';

// Admin Components
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Public Layout Wrapper
const PublicLayout = ({ children }) => (
  <div className="bg-slate-50 dark:bg-gray-900 min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-50">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Hero /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/research" element={<PublicLayout><Research /></PublicLayout>} />
        <Route path="/experience" element={<PublicLayout><Experience /></PublicLayout>} />
        <Route path="/qualifications" element={<PublicLayout><Qualifications /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;