import React from "react";
import {
  Droplet,
  Droplets,
  Heart,
  Stethoscope,
  Brain,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Homedynamictext from "./Homedynamictext";

const Home = () => {
  // Premium medical/laboratory placeholder images from Unsplash
  const galleryImages = [
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop", // Microscope
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop", // Lab Scientist
    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=800&auto=format&fit=crop", // Medical Equipment
    "https://images.unsplash.com/photo-1582719478250-c89402bb89a9?q=80&w=800&auto=format&fit=crop", // Abstract Medical
  ];
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-teal-600 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">
          <Homedynamictext />
        </h1>
        <p className="text-teal-100 text-lg max-w-2xl mx-auto">
          Upload your lab reports and get instant AI-powered health analysis.
        </p>
      </section>

      {/* NEW: PREMIUM IMAGE GALLERY SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-800">State-of-the-Art Analysis</h2>
          <p className="text-slate-500 mt-2">Powered by advanced medical imaging and clinical AI technology</p>
        </div>

        {/* Responsive Grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-2xl shadow-md aspect-square bg-slate-200"
            >
              <img
                src={src}
                alt={`Clinical laboratory environment ${index + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-in-out cursor-pointer"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CARDS SECTION */}
      <section className="max-w-6xl mx-auto px-6 -mt-16 pb-20">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Kidney */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/kidney-test" className="block">
              <div className="bg-white p-10 rounded-3xl shadow-xl border-t-8 border-teal-500 hover:-translate-y-2 transition">
                <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Droplets size={40} className="text-teal-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Kidney Health</h2>
                <p className="text-slate-500 mb-8">
                  Detect kidney stones, UTI, and diabetes using urinalysis.
                </p>
                <span className="text-teal-600 font-bold flex items-center gap-2">
                  Start Checkup <ArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Heart */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/heart-checkup" className="block">
              <div className="bg-white p-10 rounded-3xl shadow-xl border-t-8 border-red-600 hover:-translate-y-2 transition">
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Heart size={40} className="text-red-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Heart Disease</h2>
                <p className="text-slate-500 mb-8">
                  Predict cardiac risks using ECG and BP data.
                </p>
                <span className="text-red-600 font-bold flex items-center gap-2">
                  Start Checkup <ArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Blood */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/blood-checkup" className="block">
              <div className="bg-white p-10 rounded-3xl shadow-xl border-t-8 border-rose-600 hover:-translate-y-2 transition">
                <div className="bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Droplet size={40} className="text-rose-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Blood Picture</h2>
                <p className="text-slate-500 mb-8">
                  Analyze CBC reports for anemia, infections, and disorders.
                </p>
                <span className="text-rose-600 font-bold flex items-center gap-2">
                  Start Checkup <ArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Lung */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/lung-checkup" className="block">
              <div className="bg-white p-10 rounded-3xl shadow-xl border-t-8 border-sky-500 hover:-translate-y-2 transition">
                <div className="bg-sky-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Stethoscope size={40} className="text-sky-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Lung Health</h2>
                <p className="text-slate-500 mb-8">
                  Detect pneumonia and lung cancer using X-rays.
                </p>
                <span className="text-sky-600 font-bold flex items-center gap-2">
                  Start Checkup <ArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Brain MRI */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/brain-mri" className="block">
              <div className="bg-white p-10 rounded-3xl shadow-xl border-t-8 border-amber-400 hover:-translate-y-2 transition">
                <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Brain size={40} className="text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Brain MRI</h2>
                <p className="text-slate-500 mb-8">
                  Analyze MRI scans to detect tumors, stroke, and abnormalities.
                </p>
                <span className="text-amber-600 font-bold flex items-center gap-2">
                  Start Checkup <ArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Home;