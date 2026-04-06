import React, { useState } from "react";
import axios from "axios";
import { Droplet, FileText, Activity, UploadCloud, Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CBC_FIELDS = [
  { name: "Hb",        label: "Hemoglobin",   unit: "g/dL" },
  { name: "RBC",       label: "RBC Count",    unit: "million/µL" },
  { name: "WBC",       label: "WBC Count",    unit: "cells/µL" },
  { name: "PLATELETS", label: "Platelets",    unit: "cells/µL" },
  { name: "LYMP",      label: "Lymphocytes",  unit: "%" },
  { name: "MONO",      label: "Monocytes",    unit: "%" },
  { name: "HCT",       label: "Hematocrit",   unit: "%" },
  { name: "MCV",       label: "MCV",          unit: "fL" },
  { name: "MCH",       label: "MCH",          unit: "pg" },
  { name: "MCHC",      label: "MCHC",         unit: "g/dL" },
  { name: "RDW",       label: "RDW",          unit: "%" },
  { name: "PDW",       label: "PDW",          unit: "fL" },
  { name: "MPV",       label: "MPV",          unit: "fL" },
  { name: "PCT",       label: "Plateletcrit", unit: "%" },
];

const EMPTY_CBC = CBC_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});

const BloodCheckup = () => {
  const [step, setStep] = useState(1);

  const [patient, setPatient] = useState({ name: "", age: "", gender: "Male" });
  const [cbc, setCbc] = useState(EMPTY_CBC);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePatientChange = (e) =>
    setPatient({ ...patient, [e.target.name]: e.target.value });

  const handleCbcChange = (e) =>
    setCbc({ ...cbc, [e.target.name]: e.target.value });

  /* ---- Image extraction ---- */
  const handleImageUpload = async () => {
    if (!selectedFile) { alert("Please select an image first."); return; }
    setIsExtracting(true);
    const form = new FormData();
    form.append("file", selectedFile);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload-cbc-report`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCbc((prev) => ({ ...prev, ...res.data }));
      alert("✅ CBC data extracted! Please verify the values below, then click Get Full Analysis.");
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        "Failed to extract data. Please ensure the backend is running and the image is clear.";
      alert(detail);
    } finally {
      setIsExtracting(false);
    }
  };

  /* ---- Prediction ---- */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = CBC_FIELDS.reduce((acc, f) => ({
        ...acc,
        [f.name]: parseFloat(cbc[f.name]) || 0,
      }), {});

      const res = await axios.post(`${API_BASE_URL}/predict-cbc`, payload);
      setResult(res.data);
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        "Error: Is the Python backend running?";
      alert(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* ── LEFT PANEL ── */}
        <div className="md:w-1/3 bg-rose-500 text-white p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Blood Picture</h2>
            <p className="text-rose-100 mb-10">Step {step} of 2</p>
            <div className="space-y-5">
              <SideStep icon={<Droplet size={20}/>} label="Patient Details"   active={step === 1} done={step > 1}/>
              <SideStep icon={<FileText size={20}/>} label="CBC Clinical Data" active={step === 2} done={!!result}/>
              <SideStep icon={<Activity  size={20}/>} label="AI Analysis"      active={!!result}   done={false}/>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="md:w-2/3 p-10">

          {/* STEP 1 – Patient Info */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Patient Information</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text" name="name" value={patient.name}
                    onChange={handlePatientChange} placeholder="John Doe"
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-rose-400 outline-none text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
                    <input
                      type="number" name="age" value={patient.age}
                      onChange={handlePatientChange} placeholder="45"
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-rose-400 outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Gender</label>
                    <select
                      name="gender" value={patient.gender} onChange={handlePatientChange}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-rose-400 outline-none text-slate-800"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 transition mt-4"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 – CBC Data + Upload */}
          {step === 2 && !result && (
            <div className="animate-fade-in">

              {/* ── AI Auto-fill Upload ── */}
              <div className="bg-rose-50 border-2 border-dashed border-rose-200 rounded-2xl p-6 mb-8 text-center hover:bg-rose-50/80 transition">
                <div className="flex justify-center mb-3">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <UploadCloud className="text-rose-500 w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Auto-fill with your CBC Report</h3>
                <p className="text-slate-500 text-sm mb-5 max-w-md mx-auto">
                  Upload a photo of your blood test report and our AI will scan and fill the form for you automatically.
                </p>

                <div className="flex flex-col items-center gap-3">
                  <input
                    type="file" id="cbc-upload" className="hidden" accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="cbc-upload"
                    className="cursor-pointer bg-white text-rose-600 font-semibold py-2 px-6 rounded-xl border border-rose-200 hover:border-rose-400 shadow-sm transition"
                  >
                    {selectedFile ? "Change Image" : "Select Image"}
                  </label>

                  {selectedFile && (
                    <div className="flex flex-col items-center gap-3 mt-1">
                      <div className="flex items-center text-sm text-slate-600 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                        <FileText className="w-4 h-4 mr-2 text-rose-400" />
                        {selectedFile.name}
                      </div>
                      <button
                        type="button" onClick={handleImageUpload} disabled={isExtracting}
                        className="bg-rose-500 text-white font-bold py-2 px-6 rounded-xl shadow-md hover:bg-rose-600 transition flex items-center disabled:opacity-70"
                      >
                        {isExtracting
                          ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Scanning...</>
                          : "Extract Data"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Manual / Verified Inputs ── */}
              <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">
                Verify or enter details manually:
              </h3>

              <div className="grid grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-2">
                {CBC_FIELDS.map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      {f.label} <span className="text-xs text-slate-400">({f.unit})</span>
                    </label>
                    <input
                      type="number" step="any" name={f.name} value={cbc[f.name]}
                      onChange={handleCbcChange}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-rose-400 outline-none text-slate-800"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-slate-300 py-3 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit} disabled={loading}
                  className="w-2/3 bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 transition disabled:opacity-70"
                >
                  {loading ? "Analyzing..." : "Get Full Analysis"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 – Results */}
          {result && (
            <div className="text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Blood Pattern Analysis</h3>
              <p className="text-slate-500 mb-8">
                Patient: {patient.name || "—"} | Age: {patient.age || "—"}
              </p>

              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 inline-block mx-auto min-w-[260px]">
                <Activity className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <p className="text-sm text-slate-500 mb-2">Detected Blood Pattern</p>
                <p className="text-3xl font-extrabold text-rose-600 tracking-wide">
                  {result.pattern}
                </p>
              </div>

              <p className="text-xs text-slate-400 mt-6 max-w-sm mx-auto">
                This result is AI-generated and meant for informational purposes only.
                Please consult a qualified medical professional for diagnosis.
              </p>

              <button
                onClick={() => { setResult(null); setCbc(EMPTY_CBC); setStep(1); setSelectedFile(null); }}
                className="mt-8 text-rose-500 font-bold hover:underline"
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

/* ── Side step indicator ── */
const SideStep = ({ icon, label, active, done }) => (
  <div className={`flex items-center gap-3 transition-opacity ${active || done ? "opacity-100 font-bold" : "opacity-60"}`}>
    <div className="bg-white/20 p-2 rounded-lg">{icon}</div>
    {label}
    {done && <span className="ml-auto text-xs bg-white/30 px-2 py-0.5 rounded-full">✓</span>}
  </div>
);

export default BloodCheckup;
