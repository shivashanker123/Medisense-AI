import React from "react";
import { HeartPulse, User, FileText, Activity } from "lucide-react";

const HeartCheckup = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3">

        {/* LEFT SIDEBAR */}
        <div className="bg-gradient-to-b from-rose-500 to-pink-600 text-white p-10 flex flex-col gap-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Heart Checkup</h1>
            <p className="text-rose-100">Step 1 of 2</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 font-semibold">
              <div className="p-3 rounded-lg bg-white/20">
                <User />
              </div>
              Patient Details
            </div>

            <div className="flex items-center gap-4 text-white/70">
              <div className="p-3 rounded-lg bg-white/10">
                <FileText />
              </div>
              Clinical Data
            </div>

            <div className="flex items-center gap-4 text-white/70">
              <div className="p-3 rounded-lg bg-white/10">
                <Activity />
              </div>
              AI Analysis
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="md:col-span-2 p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Patient Information
          </h2>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-lg border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {/* Age + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="45"
                  className="w-full rounded-lg border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Gender
                </label>
                <select className="w-full rounded-lg border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Next Button */}
            <button className="w-full mt-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition">
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartCheckup;
