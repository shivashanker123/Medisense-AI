import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import About from "./pages/About";
import BloodCheckup from "./pages/BloodCheckup";
import BrainMRI from "./pages/BrainMRI";
import Contact from "./pages/Contact";
import HeartCheckup from "./pages/HeartCheckup";
import Home from "./pages/Home";
import KidneyTest from "./pages/KidneyTest";
import Login from "./pages/Login";
import LungCheckup from "./pages/LungCheckup";
import ProfileSetup from "./pages/ProfileSetup";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="w-full min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-900">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectedRoute requireProfile={false} />}>
              <Route path="/complete-profile" element={<ProfileSetup />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/kidney-test" element={<KidneyTest />} />
              <Route path="/heart-checkup" element={<HeartCheckup />} />
              <Route path="/blood-checkup" element={<BloodCheckup />} />
              <Route path="/lung-checkup" element={<LungCheckup />} />
              <Route path="/brain-mri" element={<BrainMRI />} />
            </Route>
          </Routes>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
