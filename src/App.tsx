import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { ChatBot } from './components/chat/ChatBot';
import { RecentBookings } from './components/marketing/RecentBookings';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Services = React.lazy(() => import('./pages/Services'));
const ServiceDetail = React.lazy(() => import('./pages/services/ServiceDetail'));
const About = React.lazy(() => import('./pages/About'));
const Contacts = React.lazy(() => import('./pages/Contacts'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/blog/BlogPost'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-ocean-darkest flex items-center justify-center">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce" />
      <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce [animation-delay:-.3s]" />
      <div className="w-3 h-3 bg-ocean-light rounded-full animate-bounce [animation-delay:-.5s]" />
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ocean-darkest flex flex-col">
        <Header />
        <RecentBookings />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              {/* Redirect /blog to /blog */}
              <Route path="/blog" element={<Navigate to="/blog" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ChatBot />
        <div id="modal-root" className="relative z-[9999]" />
      </div>
    </Router>
  );
}

export default App;