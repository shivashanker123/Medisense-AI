import React from "react";
import {
  Droplet,
  Stethoscope,
  Heart,
  Droplets,
  ArrowRight,
  Brain,
} from "lucide-react";
import { Link } from "react-router-dom";
import Homedynamictext from "./Homedynamictext";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-teal-600 text-white py-24 px-6 text-center relative z-20">
        <h1 className="text-5xl font-bold mb-6">
          <Homedynamictext />
        </h1>
        <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-10">
          Upload your lab reports and get instant analysis of your Health using
          our Advanced Machine Learning models.
        </p>
      </section>

      {}
      <section className="max-w-5xl mx-auto px-6 -mt-16 pb-20 relative z-30">
        {}
        {}
        <div
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(#0d9488 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Kidney*/}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link
              to="/kidney-test"
              className="block bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition duration-300 border-t-8 border-teal-500 group"
            >
              <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Droplets size={40} className="text-teal-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Kidney Health
              </h2>
              <p className="text-slate-500 mb-8">
                Check for Kidney Stones, UTI, and Diabetes using your Urinalysis
                report.
              </p>
              <span className="text-teal-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                Start Checkup <ArrowRight />
              </span>
            </Link>
          </motion.div>

          {/* Card 2: Heart */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Link to="/heart-checkup" className="block">
              <div className="bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition duration-300 border-t-8 border-red-600 group cursor-pointer">
                <div className="bg-red-100/60 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Heart size={40} className="text-red-600" />
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Heart Disease
                </h2>

                <p className="text-slate-500 mb-8">
                  Analyze ECG and Blood Pressure data to predict cardiac risks.
                </p>

                <span className="text-red-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Start Checkup <ArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Card 3: Blood Picture */}
          {}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/blood-checkup" className="block">
              <div className="bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition duration-300 border-t-8 border-red-600 group cursor-pointer">
                <div className="bg-red-100/60 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Droplet size={40} className="text-red-600" />
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Blood Picture
                </h2>

                <p className="text-slate-500 mb-8">
                  Upload your CBC (Hemogram) report to check Hemoglobin, WBCs,
                  and Platelet counts.
                </p>

                <span className="text-red-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Start Checkup <ArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Card 4: Lung */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Link to="/lung-checkup" className="block">
              <div className="bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition duration-300 border-t-8 border-sky-500 group cursor-pointer">
                <div className="bg-sky-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Stethoscope size={40} className="text-sky-600" />
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Lung Health
                </h2>

                <p className="text-slate-500 mb-8">
                  Analyze X-Ray images or symptoms to detect Pneumonia and Lung
                  Cancer risks.
                </p>

                <span className="text-sky-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Start Checkup <ArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>
          {/* Card: Brain MRI */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link to="/brain-mri" className="block">
              <div className="bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition duration-300 border-t-8 border-amber-400 group cursor-pointer">
                <div className="bg-amber-100/60 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <Brain size={40} className="text-amber-600" />
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Brain MRI
                </h2>

                <p className="text-slate-500 mb-8">
                  Analyze Brain MRI scans to detect tumors, stroke, and
                  neurological abnormalities.
                </p>

                <span className="text-amber-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
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
