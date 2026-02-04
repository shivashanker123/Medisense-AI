import React, { useState } from "react";
import { Droplet, FileText, Activity } from "lucide-react";

const BloodCheckup = () => {
  const [step, setStep] = useState(1);

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
  });

  const [cbc, setCbc] = useState({
    Hb: "",
    RBC: "",
    WBC: "",
    PLATELETS: "",
    LYMP: "",
    MONO: "",
    HCT: "",
    MCV: "",
    MCH: "",
    MCHC: "",
    RDW: "",
    PDW: "",
    MPV: "",
    PCT: "",
  });

  const handlePatientChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleCbcChange = (e) => {
    setCbc({ ...cbc, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Patient:", patient);
    console.log("CBC Data:", cbc);
    alert("CBC data ready for backend connection");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex">
        {/* LEFT PANEL */}
        <div className="w-1/3 bg-rose-500 text-white p-10">
          <h2 className="text-3xl font-bold mb-2">Blood Picture</h2>
          <p className="text-rose-100 mb-10">Step {step} of 2</p>

          <div className="space-y-5">
            <div
              className={`flex items-center gap-3 ${step === 1 ? "font-bold" : "opacity-70"}`}
            >
              <div className="bg-white/20 p-2 rounded-lg">
                <Droplet />
              </div>
              Patient Details
            </div>

            <div
              className={`flex items-center gap-3 ${step === 2 ? "font-bold" : "opacity-70"}`}
            >
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText />
              </div>
              CBC Clinical Data
            </div>

            <div className="flex items-center gap-3 opacity-70">
              <div className="bg-white/20 p-2 rounded-lg">
                <Activity />
              </div>
              AI Analysis
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-2/3 p-10">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Patient Information
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={patient.name}
                    onChange={handlePatientChange}
                    placeholder="John Doe"
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg 
                               focus:border-rose-400 focus:ring-2 focus:ring-rose-200 
                               outline-none text-slate-800"
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
                      value={patient.age}
                      onChange={handlePatientChange}
                      placeholder="45"
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg 
                                 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 
                                 outline-none text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={patient.gender}
                      onChange={handlePatientChange}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg 
                                 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 
                                 outline-none text-slate-800"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-rose-500 text-white py-3 rounded-xl 
                             font-bold hover:bg-rose-600 transition"
                >
                  Next Step
                </button>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                CBC Clinical Data
              </h3>

              <div className="grid grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-2">
                <CbcInput
                  label="Hemoglobin"
                  unit="g/dL"
                  name="Hb"
                  onChange={handleCbcChange}
                />
                <CbcInput
                  label="RBC Count"
                  unit="million/µL"
                  name="RBC"
                  onChange={handleCbcChange}
                />
                <CbcInput
                  label="WBC Count"
                  unit="cells/µL"
                  name="WBC"
                  onChange={handleCbcChange}
                />
                <CbcInput
                  label="Platelets"
                  unit="cells/µL"
                  name="PLATELETS"
                  onChange={handleCbcChange}
                />

                <CbcInput
                  label="Lymphocytes"
                  unit="%"
                  name="LYMP"
                  onChange={handleCbcChange}
                />
                <CbcInput
                  label="Monocytes"
                  unit="%"
                  name="MONO"
                  onChange={handleCbcChange}
                />
                <CbcInput
                  label="Hematocrit"
                  unit="%"
                  name="HCT"
                  onChange={handleCbcChange}
                />
                <CbcInput
                  label="MCV"
                  unit="fL"
                  name="MCV"
                  onChange={handleCbcChange}
                />

                <CbcInput
                  label="MCH"
                  unit="pg"
                  name="MCH"
                  onChange={handleCbcChange}
                />
                <CbcInput
                  label="MCHC"
                  unit="g/dL"
                  name="MCHC"
                  onChange={handleCbcChange}
                />
                <CbcInput
                  label="RDW"
                  unit="%"
                  name="RDW"
                  onChange={handleCbcChange}
                />
                <CbcInput
                  label="PDW"
                  unit="fL"
                  name="PDW"
                  onChange={handleCbcChange}
                />

                <CbcInput
                  label="MPV"
                  unit="fL"
                  name="MPV"
                  onChange={handleCbcChange}
                />
                <CbcInput
                  label="Plateletcrit"
                  unit="%"
                  name="PCT"
                  onChange={handleCbcChange}
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-slate-300 py-3 rounded-xl 
                             font-semibold hover:bg-slate-50"
                >
                  Back
                </button>

                <button
                  onClick={handleSubmit}
                  className="w-2/3 bg-rose-500 text-white py-3 rounded-xl 
                             font-bold hover:bg-rose-600 transition"
                >
                  Get Full Analysis
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= HELPER ================= */

const CbcInput = ({ label, unit, name, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      {label} <span className="text-xs text-slate-400">({unit})</span>
    </label>
    <input
      type="number"
      step="any"
      name={name}
      onChange={onChange}
      className="w-full p-3 bg-white border border-slate-300 rounded-lg 
                 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 
                 outline-none text-slate-800"
    />
  </div>
);

export default BloodCheckup;
