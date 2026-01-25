import React, { useRef } from "react";
import { Brain, Upload } from "lucide-react";

const BrainMRI = () => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate JPG only
    if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
      alert("❌ Please upload a JPG image only");
      e.target.value = "";
      return;
    }

    alert(`✅ File selected: ${file.name}`);
    // Later: send file to backend / model
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20">
      <div className="bg-white p-10 rounded-3xl shadow-xl border-t-8 border-amber-400 max-w-xl w-full">

        <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <Brain size={40} className="text-amber-600" />
        </div>

        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          Brain MRI
        </h2>

        <p className="text-slate-500 mb-8">
          Upload a Brain MRI scan (JPG format only) for AI-based analysis.
        </p>

        {/* Hidden file input */}
        <input
          type="file"
          accept=".jpg,.jpeg"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          onClick={handleClick}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition"
        >
          <Upload />
          Upload JPG Image
        </button>

      </div>
    </div>
  );
};

export default BrainMRI;
