import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import KidneyTest from './pages/KidneyTest';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="w-full bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kidney-test" element={<KidneyTest />} />
          {/* <Route path="/heart-test" element={<HeartTest />} /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;