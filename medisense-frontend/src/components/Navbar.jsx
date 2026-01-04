import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-200 border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-teal-600">
          <Activity size={32} />
          <span>MediSense AI</span>
        </Link>

        {/* CENTER: Navigation Links (Dark Gray) */}
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <Link to="/" className="hover:text-teal-600 transition text-gray-600">Home</Link>
          <a href="#services" className="hover:text-teal-600 transition text-gray-600">Services</a>
          <a href="#how-it-works" className="hover:text-teal-600 transition text-gray-600">How It Works</a>
          <Link to="/reports" className="hover:text-teal-600 transition text-gray-600">Reports</Link>
          <a href="#about" className="hover:text-teal-600 transition text-gray-600">About</a>
          <a href="#contact" className="hover:text-teal-600 transition text-gray-600">Contact</a>
        </div>

        {/* RIGHT: Login / Signup Button */}
        <div>
          <button className="border border-teal-300 px-5 py-2 rounded-full text-teal-700 font-semibold hover:bg-gray-50 hover:text-gray-900 transition shadow-sm">
            Login / Signup
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;