import React from 'react';
import { Heart, Droplets, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='w-full'>
      {/* HERO SECTION */}
      <section className="bg-teal-600 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">AI-Powered Health Predictions</h1>
        <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-10">
          Upload your lab reports and get instant analysis for Kidney and Heart health using our advanced Machine Learning models.
        </p>
      </section>

      {/* TWO TABS SECTION */}
      <section className="max-w-5xl mx-auto px-6 -mt-16 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Card 1: Kidney (Links to your form) */}
          <Link to="/kidney-test" className="bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition duration-300 border-t-8 border-teal-500 group">
            <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <Droplets size={40} className="text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Kidney Health</h2>
            <p className="text-slate-500 mb-8">
              Check for Kidney Stones, UTI, and Diabetes using your Urinalysis report.
            </p>
            <span className="text-teal-600 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
              Start Checkup <ArrowRight />
            </span>
          </Link>

          {/* Card 2: Heart (Placeholder) */}
          <div className="bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition duration-300 border-t-8 border-red-500 group cursor-pointer">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <Heart size={40} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Heart Disease</h2>
            <p className="text-slate-500 mb-8">
              Analyze ECG and Blood Pressure data to predict cardiac risks.
            </p>
            <span className="text-red-500 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
              Coming Soon <ArrowRight />
            </span>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;