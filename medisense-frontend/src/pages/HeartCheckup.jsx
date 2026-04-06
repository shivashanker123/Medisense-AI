import React, { useState } from "react";
import axios from "axios";
import { Upload, User, FileText, Activity, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const HeartCheckup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
  });
  const [ecgImage, setEcgImage] = useState(null);

  const handlePatientChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setEcgImage(file);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ecgImage) {
      setError("Please upload an ECG image before running analysis.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", ecgImage);

      const response = await axios.post(
        `${API_BASE_URL}/heart/predict-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setResult(response.data);
      setStep(3);
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        "Unable to analyze ECG image. Please check backend and try again.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const sortedProbs = result?.probabilities
    ? Object.entries(result.probabilities).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
        {/* LEFT SIDEBAR */}
        <div className="bg-gradient-to-b from-rose-500 to-pink-600 text-white p-10 flex flex-col gap-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Heart Checkup</h1>
            <p className="text-rose-100">Step {Math.min(step, 3)} of 3</p>
          </div>

          <div className="space-y-6">
            <div className={`flex items-center gap-4 ${step === 1 ? "font-semibold" : "text-white/70"}`}>
              <div className={`p-3 rounded-lg ${step === 1 ? "bg-white/20" : "bg-white/10"}`}>
                <User />
              </div>
              Patient Details
            </div>

            <div className={`flex items-center gap-4 ${step === 2 ? "font-semibold" : "text-white/70"}`}>
              <div className={`p-3 rounded-lg ${step === 2 ? "bg-white/20" : "bg-white/10"}`}>
                <FileText />
              </div>
              ECG Upload
            </div>

            <div className={`flex items-center gap-4 ${step === 3 ? "font-semibold" : "text-white/70"}`}>
              <div className={`p-3 rounded-lg ${step === 3 ? "bg-white/20" : "bg-white/10"}`}>
                <Activity />
              </div>
              AI Analysis
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="md:col-span-2 p-12">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Patient Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={patient.name}
                  onChange={handlePatientChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={patient.age}
                    onChange={handlePatientChange}
                    placeholder="45"
                    className="w-full rounded-lg border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={patient.gender}
                    onChange={handlePatientChange}
                    className="w-full rounded-lg border px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition"
              >
                Next Step
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload ECG Image</h2>
              <p className="text-sm text-gray-500">
                Upload a clear ECG graph image (PNG/JPG). We convert it into a 1D signal and run the trained ECG model.
              </p>

              <label className="w-full border-2 border-dashed border-rose-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-rose-50/40 cursor-pointer hover:bg-rose-50 transition">
                <Upload className="text-rose-600 mb-3" />
                <span className="font-semibold text-gray-700">
                  {ecgImage ? ecgImage.name : "Click to choose ECG image"}
                </span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-3">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-slate-300 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition disabled:opacity-70"
                >
                  {loading ? "Analyzing..." : "Run AI Analysis"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && result && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Analysis Result</h2>
                <p className="text-gray-500 text-sm">
                  Patient: {patient.name || "N/A"} | Age: {patient.age || "N/A"} | Gender:{" "}
                  {patient.gender}
                </p>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
                <div className="text-sm text-rose-700 mb-1">Predicted Rhythm Class</div>
                <div className="text-xl font-bold text-rose-900">{result.predicted_class}</div>
                <div className="text-sm text-rose-700 mt-1">
                  Confidence: {(result.confidence * 100).toFixed(2)}%
                </div>
              </div>

              <div className="space-y-2">
                {sortedProbs.map(([label, prob]) => (
                  <div
                    key={label}
                    className={`flex justify-between items-center p-3 rounded-lg border ${
                      label === result.predicted_class
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-green-50 border-green-200 text-green-700"
                    }`}
                  >
                    <span className="font-semibold text-sm flex items-center gap-2">
                      {label === result.predicted_class ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                      {label}
                    </span>
                    <span className="text-sm font-bold">{(prob * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep(2);
                    setResult(null);
                    setError("");
                  }}
                  className="w-1/2 border border-slate-300 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Try Another ECG
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-1/2 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition"
                >
                  Start New Checkup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeartCheckup;
