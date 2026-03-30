import React, { useState } from "react";
import axios from "axios";
import {
  User,
  FileText,
  Activity,
  CheckCircle,
  AlertCircle,
  UploadCloud, // Added for image upload
  Loader2      // Added for loading spinner
} from "lucide-react";

const KidneyTest = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // --- NEW: State for Image Upload ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

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

  // --- NEW: Function to send image to Flask backend for extraction ---
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsExtracting(true);
    const uploadData = new FormData();
    uploadData.append('file', selectedFile);
    uploadData.append('type', 'kidney'); // Tells backend to use the Kidney prompt

    try {
      const response = await axios.post('http://localhost:5000/upload-report', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Merge the AI extracted data into our existing form data to auto-fill inputs
      setFormData(prevData => ({
        ...prevData,
        ...response.data
      }));

      alert("Extraction complete! Please review the auto-filled values below.");
    } catch (error) {
      console.error(error);
      alert("Failed to extract data. Please ensure the backend is running and the image is clear.");
    }
    setIsExtracting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mapping Frontend Data to the Exact Keys/Types your Python Model expects
      const payload = {
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

      // Ensure your Flask URL is correct
      const response = await axios.post(
        "http://localhost:5000/predict",
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
                    value={formData.name} // Added value binding
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
                      value={formData.age} // Added value binding
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
                      value={formData.gender} // Added value binding
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
            <div className="animate-fade-in">

              {/* --- NEW: AUTO-FILL UPLOAD SECTION --- */}
              <div className="bg-teal-50/50 border-2 border-dashed border-teal-200 rounded-2xl p-6 mb-8 text-center transition-all hover:bg-teal-50">
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <UploadCloud className="text-teal-600 w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Auto-fill with your Lab Report</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                  Save time by uploading a photo of your Urinalysis report. Our AI will scan the image and fill out the form below for you.
                </p>

                <div className="flex flex-col items-center justify-center gap-4">
                  <input
                    type="file"
                    id="report-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="report-upload"
                    className="cursor-pointer bg-white text-teal-700 font-semibold py-2 px-6 rounded-xl border border-teal-200 hover:border-teal-400 shadow-sm transition-all"
                  >
                    {selectedFile ? 'Change Image' : 'Select Image'}
                  </label>

                  {selectedFile && (
                    <div className="flex flex-col items-center mt-2 gap-3">
                      <div className="flex items-center text-sm text-slate-600 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                        <FileText className="w-4 h-4 mr-2 text-teal-500" />
                        {selectedFile.name}
                      </div>
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={isExtracting}
                        className="bg-teal-600 text-white font-bold py-2 px-6 rounded-xl shadow-md hover:bg-teal-700 transition-all flex items-center disabled:opacity-70"
                      >
                        {isExtracting ? (
                          <> <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Scanning... </>
                        ) : (
                          "Extract Data"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* --- END AUTO-FILL SECTION --- */}

              <form onSubmit={handleSubmit}>
                <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">
                  Verify or enter details manually:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {/* 1. Chemical Examination */}
                  <SelectInput
                    label="Glucose (Sugar)"
                    name="glucose"
                    value={formData.glucose} // Bind value to state
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Protein"
                    name="protein"
                    value={formData.protein} // Bind value to state
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Ketones"
                    name="ketones"
                    value={formData.ketones} // Bind value to state
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Nitrite"
                    name="nitrite"
                    value={formData.nitrite} // Bind value to state
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Leukocyte Esterase"
                    name="leukocyte_esterase"
                    value={formData.leukocyte_esterase} // Bind value to state
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Bilirubin"
                    name="bilirubin"
                    value={formData.bilirubin} // Bind value to state
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Urobilinogen"
                    name="urobilinogen"
                    value={formData.urobilinogen} // Bind value to state
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
                      value={formData.ph} // Bind value to state
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
                      value={formData.specific_gravity} // Bind value to state
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
                      value={formData.wbc} // Bind value to state
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
                      value={formData.blood_rbc} // Bind value to state
                      placeholder="e.g. 2"
                      className="w-full p-3 border rounded-lg focus:border-teal-500 outline-none"
                      onChange={handleChange}
                    />
                  </div>

                  <SelectInput
                    label="Crystals"
                    name="crystals"
                    value={formData.crystals} // Bind value to state
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
            </div>
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
// --- NEW: Added 'value' to props to support controlled components ---
const SelectInput = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value} // Added value binding here!
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