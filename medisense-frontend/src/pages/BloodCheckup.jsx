import { useEffect, useState } from "react";
import axios from "axios";
import {
  Activity,
  Droplet,
  FileText,
  Loader2,
  UploadCloud,
} from "lucide-react";

import SavedProfileBanner from "../components/SavedProfileBanner";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CBC_FIELDS = [
  { name: "Hb", label: "Hemoglobin", unit: "g/dL" },
  { name: "RBC", label: "RBC Count", unit: "million/uL" },
  { name: "WBC", label: "WBC Count", unit: "cells/uL" },
  { name: "PLATELETS", label: "Platelets", unit: "cells/uL" },
  { name: "LYMP", label: "Lymphocytes", unit: "%" },
  { name: "MONO", label: "Monocytes", unit: "%" },
  { name: "HCT", label: "Hematocrit", unit: "%" },
  { name: "MCV", label: "MCV", unit: "fL" },
  { name: "MCH", label: "MCH", unit: "pg" },
  { name: "MCHC", label: "MCHC", unit: "g/dL" },
  { name: "RDW", label: "RDW", unit: "%" },
  { name: "PDW", label: "PDW", unit: "fL" },
  { name: "MPV", label: "MPV", unit: "fL" },
  { name: "PCT", label: "Plateletcrit", unit: "%" },
];

const EMPTY_CBC = CBC_FIELDS.reduce((accumulator, field) => {
  accumulator[field.name] = "";
  return accumulator;
}, {});

const BloodCheckup = () => {
  const { profile } = useAuth();
  const hasSavedProfile = Boolean(
    profile?.full_name && profile?.age && profile?.gender,
  );

  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState({ name: "", age: "", gender: "Male" });
  const [cbc, setCbc] = useState(EMPTY_CBC);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!hasSavedProfile) {
      return;
    }

    setPatient({
      name: profile.full_name,
      age: String(profile.age),
      gender: profile.gender,
    });
    setStep((current) => (current === 1 ? 2 : current));
  }, [hasSavedProfile, profile]);

  const handlePatientChange = (event) => {
    const { name, value } = event.target;
    setPatient((current) => ({ ...current, [name]: value }));
  };

  const handleCbcChange = (event) => {
    const { name, value } = event.target;
    setCbc((current) => ({ ...current, [name]: value }));
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      window.alert("Please select an image first.");
      return;
    }

    setIsExtracting(true);
    const form = new FormData();
    form.append("file", selectedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload-cbc-report`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCbc((current) => ({ ...current, ...response.data }));
      window.alert("CBC data extracted. Please verify the values below, then continue.");
    } catch (error) {
      const detail =
        error?.response?.data?.detail ||
        "Failed to extract data. Please ensure the backend is running and the image is clear.";
      window.alert(detail);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = CBC_FIELDS.reduce((accumulator, field) => {
        accumulator[field.name] = Number.parseFloat(cbc[field.name]) || 0;
        return accumulator;
      }, {});

      const response = await axios.post(`${API_BASE_URL}/predict-cbc`, payload);
      setResult(response.data);
    } catch (error) {
      const detail =
        error?.response?.data?.detail ||
        "Error: Is the Python backend running?";
      window.alert(detail);
    } finally {
      setLoading(false);
    }
  };

  const resetCheckup = () => {
    setResult(null);
    setCbc(EMPTY_CBC);
    setSelectedFile(null);
    setStep(hasSavedProfile ? 2 : 1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl md:flex-row">
        <div className="flex md:w-1/3 flex-col justify-between bg-rose-500 p-10 text-white">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Blood Picture</h2>
            <p className="mb-10 text-rose-100">
              Step {hasSavedProfile ? 2 : step} of 2
            </p>
            <div className="space-y-5">
              <SideStep
                icon={<Droplet size={20} />}
                label={hasSavedProfile ? "Profile Saved" : "Patient Details"}
                active={!hasSavedProfile && step === 1}
                done={hasSavedProfile}
              />
              <SideStep
                icon={<FileText size={20} />}
                label="CBC Clinical Data"
                active={step === 2 && !result}
                done={Boolean(result)}
              />
              <SideStep
                icon={<Activity size={20} />}
                label="AI Analysis"
                active={Boolean(result)}
                done={false}
              />
            </div>
          </div>
        </div>

        <div className="md:w-2/3 p-10">
          {!hasSavedProfile && step === 1 ? (
            <div className="animate-fade-in">
              <h3 className="mb-6 text-2xl font-bold text-slate-800">Patient Information</h3>
              <div className="space-y-5">
                <Field
                  label="Full Name"
                  name="name"
                  value={patient.name}
                  onChange={handlePatientChange}
                  placeholder="John Doe"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Age"
                    name="age"
                    type="number"
                    value={patient.age}
                    onChange={handlePatientChange}
                    placeholder="45"
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">Gender</label>
                    <select
                      name="gender"
                      value={patient.gender}
                      onChange={handlePatientChange}
                      className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 outline-none focus:border-rose-400"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-4 w-full rounded-xl bg-rose-500 py-3 font-bold text-white transition hover:bg-rose-600"
                >
                  Next Step
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 && !result ? (
            <div className="animate-fade-in">
              <SavedProfileBanner
                profile={hasSavedProfile ? profile : null}
                tone="rose"
              />

              <div className="mb-8 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50 p-6 text-center transition hover:bg-rose-50/80">
                <div className="mb-3 flex justify-center">
                  <div className="rounded-full bg-white p-3 shadow-sm">
                    <UploadCloud className="h-8 w-8 text-rose-500" />
                  </div>
                </div>
                <h3 className="mb-1 text-lg font-bold text-slate-800">Auto-fill with your CBC Report</h3>
                <p className="mx-auto mb-5 max-w-md text-sm text-slate-500">
                  Upload a photo of your blood test report and our AI will scan and fill the form for you automatically.
                </p>

                <div className="flex flex-col items-center gap-3">
                  <input
                    type="file"
                    id="cbc-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  />
                  <label
                    htmlFor="cbc-upload"
                    className="cursor-pointer rounded-xl border border-rose-200 bg-white px-6 py-2 font-semibold text-rose-600 shadow-sm transition hover:border-rose-400"
                  >
                    {selectedFile ? "Change Image" : "Select Image"}
                  </label>

                  {selectedFile ? (
                    <div className="mt-1 flex flex-col items-center gap-3">
                      <div className="flex items-center rounded-full border border-slate-100 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
                        <FileText className="mr-2 h-4 w-4 text-rose-400" />
                        {selectedFile.name}
                      </div>
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={isExtracting}
                        className="flex items-center rounded-xl bg-rose-500 px-6 py-2 font-bold text-white shadow-md transition hover:bg-rose-600 disabled:opacity-70"
                      >
                        {isExtracting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          "Extract Data"
                        )}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <h3 className="mb-4 border-b pb-2 text-xl font-bold text-slate-800">
                Verify or enter details manually:
              </h3>

              <div className="grid max-h-[380px] grid-cols-2 gap-4 overflow-y-auto pr-2">
                {CBC_FIELDS.map((field) => (
                  <div key={field.name}>
                    <label className="mb-1 block text-sm font-medium text-slate-600">
                      {field.label} <span className="text-xs text-slate-400">({field.unit})</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      name={field.name}
                      value={cbc[field.name]}
                      onChange={handleCbcChange}
                      className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 outline-none focus:border-rose-400"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                {!hasSavedProfile ? (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 rounded-xl border border-slate-300 py-3 font-semibold transition hover:bg-slate-50"
                  >
                    Back
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`${hasSavedProfile ? "w-full" : "w-2/3"} rounded-xl bg-rose-500 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-70`}
                >
                  {loading ? "Analyzing..." : "Get Full Analysis"}
                </button>
              </div>
            </div>
          ) : null}

          {result ? (
            <div className="animate-fade-in text-center">
              <SavedProfileBanner
                profile={hasSavedProfile ? profile : null}
                tone="rose"
              />

              <h3 className="mb-2 text-2xl font-bold text-slate-800">Blood Pattern Analysis</h3>
              <p className="mb-8 text-slate-500">
                Patient: {patient.name || "-"} | Age: {patient.age || "-"}
              </p>

              <div className="mx-auto inline-block min-w-[260px] rounded-2xl border border-rose-200 bg-rose-50 p-8">
                <Activity className="mx-auto mb-4 h-12 w-12 text-rose-500" />
                <p className="mb-2 text-sm text-slate-500">Detected Blood Pattern</p>
                <p className="text-3xl font-extrabold tracking-wide text-rose-600">
                  {result.pattern}
                </p>
              </div>

              <p className="mx-auto mt-6 max-w-sm text-xs text-slate-400">
                This result is AI-generated and meant for informational purposes only.
                Please consult a qualified medical professional for diagnosis.
              </p>

              <button
                type="button"
                onClick={resetCheckup}
                className="mt-8 font-bold text-rose-500 hover:underline"
              >
                Start New Test
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const SideStep = ({ icon, label, active, done }) => (
  <div
    className={`flex items-center gap-3 transition-opacity ${
      active || done ? "opacity-100 font-bold" : "opacity-60"
    }`}
  >
    <div className="rounded-lg bg-white/20 p-2">{icon}</div>
    {label}
    {done ? (
      <span className="ml-auto rounded-full bg-white/30 px-2 py-0.5 text-xs">OK</span>
    ) : null}
  </div>
);

const Field = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-slate-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 outline-none focus:border-rose-400"
    />
  </div>
);

export default BloodCheckup;
