import React, { useState } from "react";
import { User, FileText, Activity, Wind } from "lucide-react";

const LungCheckup = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT PANEL */}
        <div className="md:w-1/3 bg-sky-500 text-white p-10 rounded-l-3xl">
          <h2 className="text-3xl font-bold mb-2">Lung Health</h2>
          <p className="text-sky-100 mb-10">Step {step} of 2</p>

          <div className="space-y-5">
            <div className="flex items-center gap-3 font-bold">
              <div className="bg-white/20 p-2 rounded-lg">
                <User size={20} />
              </div>
              Patient Details
            </div>

            <div className="flex items-center gap-3 opacity-70">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText size={20} />
              </div>
              Clinical Data
            </div>

            <div className="flex items-center gap-3 opacity-70">
              <div className="bg-white/20 p-2 rounded-lg">
                <Activity size={20} />
              </div>
              AI Analysis
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:w-2/3 p-10">
          {step === 1 && (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Patient Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:border-sky-400 outline-none bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      placeholder="45"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:border-sky-400 outline-none bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Gender
                    </label>
                    <select className="w-full p-3 border border-slate-300 rounded-lg focus:border-sky-400 outline-none bg-white">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-sky-500 text-white py-3 rounded-xl font-bold mt-6 hover:bg-sky-600 transition"
                >
                  Next Step
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Lung Clinical Data
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "Smoking History (years)",
                  "Cough Duration (days)",
                  "Chest Pain (0/1)",
                  "Shortness of Breath (0/1)",
                ].map((label) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      placeholder="Enter value"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:border-sky-400 outline-none bg-slate-50"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-slate-300 py-3 rounded-xl font-semibold hover:bg-slate-100"
                >
                  Back
                </button>
                <button className="w-2/3 bg-sky-500 text-white py-3 rounded-xl font-bold hover:bg-sky-600 transition">
                  Get AI Analysis
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LungCheckup;
