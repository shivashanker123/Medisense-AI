import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import KidneyTest from "./pages/KidneyTest";
import HeartCheckup from "./pages/HeartCheckup";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import BloodCheckup from "./pages/BloodCheckup";
import LungCheckup from "./pages/LungCheckup";
import BrainMRI from "./pages/BrainMRI";

function App() {
  return (
    <Router>
      <div className="w-full bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kidney-test" element={<KidneyTest />} />
          <Route path="/heart-checkup" element={<HeartCheckup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blood-checkup" element={<BloodCheckup />} />
          <Route path="/lung-checkup" element={<LungCheckup />} />
          <Route path="/brain-mri" element={<BrainMRI />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
