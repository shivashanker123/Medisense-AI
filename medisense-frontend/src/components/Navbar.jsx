import React from "react";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-gray-100 border-b border-emerald-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Heartbeat ECG Icon */}
          <div className="animate-heartbeat text-emerald-600">
            <Activity size={32} strokeWidth={2.5} />
          </div>

          {/* Glowing Brand Text */}
          <span className="text-2xl font-bold tracking-wide text-emerald-700 animate-glow">
            MediSense <span className="text-emerald-500">AI</span>
          </span>
        </Link>

        {/* CENTER: Nav Links */}
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <Link to="/" className="hover:text-emerald-600 transition">
            Home
          </Link>

          <a href="#services" className="hover:text-emerald-600 transition">
            Services
          </a>

          <a href="#how-it-works" className="hover:text-emerald-600 transition">
            How It Works
          </a>

          <Link to="/reports" className="hover:text-emerald-600 transition">
            Reports
          </Link>

          <Link to="/contact" className="hover:text-emerald-600 transition">
            Contact
          </Link>
        </div>

        {/* RIGHT: Login / Signup */}
        <Link
          to="/login"
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:from-emerald-600 hover:to-emerald-700 transition"
        >
          Login / Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
