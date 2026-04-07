import React, { useState, useRef } from "react";
import { Brain, Upload, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BrainMRI = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.includes("jpeg") && !selectedFile.type.includes("jpg") && !selectedFile.type.includes("png")) {
      setError("Please upload a JPG/PNG image only.");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResult(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/predict-brain", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to analyze the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border-t-8 border-amber-500 max-w-2xl w-full"
      >

        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-amber-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Brain size={42} className="text-amber-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
            Brain MRI Analysis
          </h2>
          <p className="text-slate-500 max-w-md">
            Our AI diagnostic tool analyzes Brain MRI scans to detect tumors with high precision. (JPG/PNG supported)
          </p>
        </div>

        {/* Upload/Preview Section */}
        <div className="mb-8">
          {!preview ? (
            <div 
              onClick={handleClick}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 hover:border-amber-300 transition-all group"
            >
              <div className="bg-slate-100 p-4 rounded-full group-hover:bg-amber-50 group-hover:scale-110 transition-all duration-300">
                <Upload size={32} className="text-slate-400 group-hover:text-amber-500" />
              </div>
              <div className="text-center">
                <p className="text-slate-700 font-semibold text-lg">Click to upload scan</p>
                <p className="text-slate-400 text-sm mt-1">Supports JPG, JPEG, and PNG images</p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white aspect-square max-w-xs mx-auto">
              <img src={preview} alt="MRI Preview" className="w-full h-full object-cover" />
              <button 
                onClick={handleReset}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-xl shadow-md transition-all active:scale-95"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {file && !result && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-200 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analyzing Scan...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Run Diagnostic
                </>
              )}
            </button>
          )}

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 border border-red-100"
              >
                <AlertCircle className="flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 text-white p-6 rounded-3xl overflow-hidden relative shadow-xl"
              >
                {/* Decorative background pulse */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl -mr-10 -mt-10 animate-pulse" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Diagnosis Report</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      AI Verified
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black mb-1 leading-tight">
                    {result.prediction.toUpperCase()}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                    <span>Confidence Score:</span>
                    <span className="text-amber-400 font-bold">{(result.confidence * 100).toFixed(2)}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full mb-6 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
                    />
                  </div>

                  <button 
                    onClick={handleReset}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold py-3 rounded-xl transition-all border border-slate-700"
                  >
                    Start New Analysis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
};

export default BrainMRI;
