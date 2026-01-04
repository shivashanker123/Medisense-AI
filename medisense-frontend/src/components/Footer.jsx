import React from 'react';
import { Activity, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-600 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
        
        {/* Column 1: Brand */}
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-4">
            <Activity className="text-teal-600" size={32} />
            <span>MediSense AI</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Empowering you with AI-driven health insights. Early detection for a healthier tomorrow.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-gray-900 font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-teal-600 transition">Home</Link></li>
            <li><Link to="/kidney-test" className="hover:text-teal-600 transition">Kidney Checkup</Link></li>
            <li><Link to="/heart-test" className="hover:text-teal-600 transition">Heart Checkup</Link></li>
            <li><a href="#" className="hover:text-teal-600 transition">About Us</a></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h3 className="text-gray-900 font-bold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-teal-600" />
              <span>support@medisense.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-teal-600" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-teal-600" />
              <span>Hyderabad, Telangana</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Socials */}
        <div>
          <h3 className="text-gray-900 font-bold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <SocialIcon icon={<Facebook size={20} />} />
            <SocialIcon icon={<Twitter size={20} />} />
            <SocialIcon icon={<Linkedin size={20} />} />
            <SocialIcon icon={<Instagram size={20} />} />
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} MediSense AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Helper for Social Icons (Updated for Light Background)
const SocialIcon = ({ icon }) => (
  <a href="#" className="bg-white text-gray-600 p-2 rounded-full shadow-sm hover:bg-teal-600 hover:text-white transition duration-300 border border-gray-200">
    {icon}
  </a>
);

export default Footer;