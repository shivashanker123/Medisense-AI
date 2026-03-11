import React, { useState } from "react";
import axios from "axios";
import {
  User,
  FileText,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const KidneyTest = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Form State - Now includes all 12 parameters required by the new model
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male", // Basic Details

    // 12 Medical Parameters (Default '0' for binary, '' for numbers)
    glucose: "0",
    ketones: "0",
    protein: "0",
    blood_rbc: "",
    wbc: "",
    nitrite: "0",
    leukocyte_esterase: "0",
    ph: "",
    specific_gravity: "",
    bilirubin: "0",
    urobilinogen: "0",
    crystals: "0",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mapping Frontend Data to the Exact Keys/Types your Python Model expects
      const payload = {
        //these two lines are new:
        age: parseInt(formData.age) || 25,
        gender: formData.gender, // "Male" or "Female" (Backend will convert)

        glucose: parseInt(formData.glucose),
        ketones: parseInt(formData.ketones),
        protein: parseInt(formData.protein),
        blood_rbc: parseFloat(formData.blood_rbc) || 0,
        wbc: parseFloat(formData.wbc) || 0,
        nitrite: parseInt(formData.nitrite),
        leukocyte_esterase: parseInt(formData.leukocyte_esterase),
        ph: parseFloat(formData.ph),
        specific_gravity: parseFloat(formData.specific_gravity),
        bilirubin: parseInt(formData.bilirubin),
        urobilinogen: parseInt(formData.urobilinogen),
        crystals: parseInt(formData.crystals),
      };

      // FastAPI endpoint
      const response = await axios.post(
        `${API_BASE_URL}/predict`,
        payload,
      );
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error: Is the Python Backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Visual Header */}
        <div className="md:w-1/3 bg-teal-600 p-10 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">Kidney & Liver Checkup</h2>
            <p className="text-teal-100">Step {step} of 2</p>
          </div>
          <div className="space-y-4">
            <div
              className={`flex items-center gap-3 ${step === 1 ? "opacity-100 font-bold" : "opacity-60"}`}
            >
              <div className="bg-white/20 p-2 rounded-lg">
                <User size={20} />
              </div>{" "}
              Patient Details
            </div>
            <div
              className={`flex items-center gap-3 ${step === 2 ? "opacity-100 font-bold" : "opacity-60"}`}
            >
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText size={20} />
              </div>{" "}
              Clinical Data
            </div>
            <div
              className={`flex items-center gap-3 ${result ? "opacity-100 font-bold" : "opacity-60"}`}
            >
              <div className="bg-white/20 p-2 rounded-lg">
                <Activity size={20} />
              </div>{" "}
              AI Analysis
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-10">
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="animate-fade-in">
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
                    name="name"
                    className="w-full p-3 border rounded-lg outline-none focus:border-teal-500"
                    placeholder="John Doe"
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      className="w-full p-3 border rounded-lg outline-none focus:border-teal-500"
                      placeholder="25"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      className="w-full p-3 border bg-white rounded-lg outline-none focus:border-teal-500"
                      onChange={handleChange}
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold mt-6 hover:bg-teal-700 transition"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MEDICAL INPUTS (12 Fields) */}
          {step === 2 && !result && (
            <form onSubmit={handleSubmit} className="animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Urinalysis Report Data
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {/* 1. Chemical Examination */}
                <SelectInput
                  label="Glucose (Sugar)"
                  name="glucose"
                  onChange={handleChange}
                />
                <SelectInput
                  label="Protein"
                  name="protein"
                  onChange={handleChange}
                />
                <SelectInput
                  label="Ketones"
                  name="ketones"
                  onChange={handleChange}
                />
                <SelectInput
                  label="Nitrite"
                  name="nitrite"
                  onChange={handleChange}
                />
                <SelectInput
                  label="Leukocyte Esterase"
                  name="leukocyte_esterase"
                  onChange={handleChange}
                />
                <SelectInput
                  label="Bilirubin"
                  name="bilirubin"
                  onChange={handleChange}
                />
                <SelectInput
                  label="Urobilinogen"
                  name="urobilinogen"
                  onChange={handleChange}
                />

                {/* 2. Physical / Microscopic (Numbers) */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    pH Level
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="ph"
                    required
                    placeholder="e.g. 6.0"
                    className="w-full p-3 border rounded-lg focus:border-teal-500 outline-none"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Specific Gravity
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    name="specific_gravity"
                    required
                    placeholder="e.g. 1.020"
                    className="w-full p-3 border rounded-lg focus:border-teal-500 outline-none"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    WBC (Pus Cells)
                  </label>
                  <input
                    type="number"
                    name="wbc"
                    placeholder="e.g. 25"
                    className="w-full p-3 border rounded-lg focus:border-teal-500 outline-none"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Red Blood Cells
                  </label>
                  <input
                    type="number"
                    name="blood_rbc"
                    placeholder="e.g. 2"
                    className="w-full p-3 border rounded-lg focus:border-teal-500 outline-none"
                    onChange={handleChange}
                  />
                </div>

                <SelectInput
                  label="Crystals"
                  name="crystals"
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-slate-300 py-3 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition"
                >
                  {loading ? "Analyzing..." : "Get Full Analysis"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: RESULTS (8 Diseases) */}
          {result && (
            <div className="text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Comprehensive Diagnosis
              </h3>
              <p className="text-slate-500 mb-6">
                Patient: {formData.name} | Age: {formData.age}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                <ResultRow
                  label="Kidney Stone"
                  isPositive={result.Kidney_Stone}
                />
                <ResultRow label="UTI Infection" isPositive={result.UTI} />
                <ResultRow label="Diabetes" isPositive={result.Diabetes} />
                <ResultRow label="Nephritis" isPositive={result.Nephritis} />
                <ResultRow
                  label="Pyelonephritis"
                  isPositive={result.Pyelonephritis}
                />
                <ResultRow
                  label="Chronic Kidney Disease"
                  isPositive={result.CKD}
                />
                <ResultRow
                  label="Liver Disease"
                  isPositive={result.Liver_Disease}
                />
                <ResultRow
                  label="Dehydration"
                  isPositive={result.Dehydration}
                />
              </div>

              <button
                onClick={() => window.location.reload()}
                className="mt-8 text-teal-600 font-bold hover:underline"
              >
                Start New Test
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const SelectInput = ({ label, name, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      {label}
    </label>
    <select
      name={name}
      onChange={onChange}
      className="w-full p-3 border bg-white rounded-lg outline-none focus:border-teal-500"
    >
      <option value="0">Negative / Normal</option>
      <option value="1">Positive / Abnormal</option>
    </select>
  </div>
);

const ResultRow = ({ label, isPositive }) => (
  <div
    className={`flex justify-between p-3 rounded-lg border ${isPositive ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}
  >
    <span className="font-semibold text-sm">{label}</span>
    <span className="flex items-center gap-2 font-bold text-sm">
      {isPositive ? (
        <>
          <AlertCircle size={16} /> Detected
        </>
      ) : (
        <>
          <CheckCircle size={16} /> Healthy
        </>
      )}
    </span>
  </div>
);

export default KidneyTest;
