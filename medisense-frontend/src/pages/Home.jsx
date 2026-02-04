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
