import { useEffect, useState } from "react";
import axios from "axios";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  UploadCloud,
  User,
} from "lucide-react";

import SavedProfileBanner from "../components/SavedProfileBanner";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const INITIAL_FORM_DATA = {
  name: "",
  age: "",
  gender: "Male",
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
};

const KidneyTest = () => {
  const { profile } = useAuth();
  const hasSavedProfile = Boolean(
    profile?.full_name && profile?.age && profile?.gender,
  );

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    if (!hasSavedProfile) {
      return;
    }

    setFormData((current) => ({
      ...current,
      name: profile.full_name,
      age: String(profile.age),
      gender: profile.gender,
    }));
    setStep((current) => (current === 1 ? 2 : current));
  }, [hasSavedProfile, profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const buildPredictionPayload = (data) => ({
    age: Number.parseInt(data.age, 10) || 25,
    gender: data.gender || "Male",
    glucose: Number.parseInt(data.glucose, 10) || 0,
    ketones: Number.parseInt(data.ketones, 10) || 0,
    protein: Number.parseInt(data.protein, 10) || 0,
    blood_rbc: Number.parseFloat(data.blood_rbc) || 0,
    wbc: Number.parseFloat(data.wbc) || 0,
    nitrite: Number.parseInt(data.nitrite, 10) || 0,
    leukocyte_esterase: Number.parseInt(data.leukocyte_esterase, 10) || 0,
    ph: Number.parseFloat(data.ph) || 6.0,
    specific_gravity: Number.parseFloat(data.specific_gravity) || 1.02,
    bilirubin: Number.parseInt(data.bilirubin, 10) || 0,
    urobilinogen: Number.parseInt(data.urobilinogen, 10) || 0,
    crystals: Number.parseInt(data.crystals, 10) || 0,
  });

  const runPrediction = async (data) => {
    const payload = buildPredictionPayload(data);
    const response = await axios.post(`${API_BASE_URL}/predict`, payload);
    setResult(response.data);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      window.alert("Please select an image first.");
      return;
    }

    setIsExtracting(true);
    const uploadData = new FormData();
    uploadData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload-report`,
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setFormData((current) => ({ ...current, ...response.data }));
    } catch (error) {
      console.error(error);
      const detail =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        "Failed to extract data. Please ensure the backend is running and the image is clear.";
      window.alert(detail);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await runPrediction(formData);
    } catch (error) {
      console.error(error);
      const detail =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        "Error: Is the Python backend running?";
      window.alert(detail);
    } finally {
      setLoading(false);
    }
  };

  const resetCheckup = () => {
    setLoading(false);
    setResult(null);
    setSelectedFile(null);
    setIsExtracting(false);
    setFormData({
      ...INITIAL_FORM_DATA,
      name: hasSavedProfile ? profile.full_name : "",
      age: hasSavedProfile ? String(profile.age) : "",
      gender: hasSavedProfile ? profile.gender : "Male",
    });
    setStep(hasSavedProfile ? 2 : 1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-[280px_1fr]">
        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-8 text-white">
          <h2 className="text-4xl font-bold leading-tight">Kidney & Liver Checkup</h2>
          <p className="mt-4 text-sm text-emerald-100">
            Step {hasSavedProfile ? 2 : Math.min(step, 2)} of 2
          </p>

          <div className="mt-12 space-y-5">
            <SidebarStep
              active={!hasSavedProfile && step === 1}
              complete={hasSavedProfile}
              icon={<User size={18} />}
              label={hasSavedProfile ? "Profile Saved" : "Patient Details"}
            />
            <SidebarStep
              active={step === 2 && !result}
              complete={Boolean(result)}
              icon={<FileText size={18} />}
              label="Clinical Data"
            />
            <SidebarStep
              active={Boolean(result)}
              complete={false}
              icon={<Activity size={18} />}
              label="AI Analysis"
            />
          </div>
        </div>

        <div className="p-8 md:p-10">
          {!hasSavedProfile && step === 1 ? (
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold text-slate-900">Patient Information</h3>
              <div className="mt-8 space-y-5">
                <Field
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-400"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700"
                >
                  Next Step
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 && !result ? (
            <div className="animate-fade-in">
              <SavedProfileBanner profile={hasSavedProfile ? profile : null} />

              <div className="mb-8 rounded-[1.75rem] border border-teal-100 bg-teal-50/70 p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-lg">
                    <h3 className="text-xl font-bold text-slate-900">
                      Auto-fill with your Lab Report
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Upload a urinalysis photo and let the backend extract values before you review them manually below.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <input
                      type="file"
                      id="kidney-report-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                    />
                    <label
                      htmlFor="kidney-report-upload"
                      className="cursor-pointer rounded-full border border-teal-200 bg-white px-5 py-2.5 text-sm font-semibold text-teal-700 shadow-sm transition hover:border-teal-400"
                    >
                      {selectedFile ? "Change Image" : "Select Image"}
                    </label>

                    {selectedFile ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm">
                          <FileText size={15} className="text-teal-500" />
                          {selectedFile.name}
                        </div>
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={isExtracting}
                          className="flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isExtracting ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              <UploadCloud size={16} />
                              Extract Data
                            </>
                          )}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <h3 className="border-b border-slate-200 pb-3 text-2xl font-bold text-slate-900">
                  Verify or enter details manually:
                </h3>

                <div className="mt-6 grid max-h-[440px] gap-4 overflow-y-auto pr-2 md:grid-cols-2">
                  <SelectInput
                    label="Glucose (Sugar)"
                    name="glucose"
                    value={formData.glucose}
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Protein"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Ketones"
                    name="ketones"
                    value={formData.ketones}
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Nitrite"
                    name="nitrite"
                    value={formData.nitrite}
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Leukocyte Esterase"
                    name="leukocyte_esterase"
                    value={formData.leukocyte_esterase}
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Bilirubin"
                    name="bilirubin"
                    value={formData.bilirubin}
                    onChange={handleChange}
                  />
                  <SelectInput
                    label="Urobilinogen"
                    name="urobilinogen"
                    value={formData.urobilinogen}
                    onChange={handleChange}
                  />
                  <Field
                    label="pH Level"
                    name="ph"
                    type="number"
                    step="0.1"
                    value={formData.ph}
                    onChange={handleChange}
                    placeholder="e.g. 6.0"
                  />
                  <Field
                    label="Specific Gravity"
                    name="specific_gravity"
                    type="number"
                    step="0.001"
                    value={formData.specific_gravity}
                    onChange={handleChange}
                    placeholder="e.g. 1.020"
                  />
                  <Field
                    label="WBC (Pus Cells)"
                    name="wbc"
                    type="number"
                    value={formData.wbc}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                  />
                  <Field
                    label="Red Blood Cells"
                    name="blood_rbc"
                    type="number"
                    value={formData.blood_rbc}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                  />
                  <SelectInput
                    label="Crystals"
                    name="crystals"
                    value={formData.crystals}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-8 flex gap-4">
                  {!hasSavedProfile ? (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Back
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${hasSavedProfile ? "w-full" : "w-2/3"} rounded-xl bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {loading ? "Analyzing..." : "Get Full Analysis"}
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {result ? (
            <div className="animate-fade-in">
              <SavedProfileBanner profile={hasSavedProfile ? profile : null} />
              <h3 className="text-3xl font-bold text-slate-900">Comprehensive Diagnosis</h3>
              <p className="mt-3 text-sm text-slate-500">
                Patient: {formData.name || "N/A"} | Age: {formData.age || "N/A"} | Gender: {formData.gender}
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                <ResultRow label="Kidney Stone" isPositive={result.Kidney_Stone} />
                <ResultRow label="UTI Infection" isPositive={result.UTI} />
                <ResultRow label="Diabetes" isPositive={result.Diabetes} />
                <ResultRow label="Nephritis" isPositive={result.Nephritis} />
                <ResultRow label="Pyelonephritis" isPositive={result.Pyelonephritis} />
                <ResultRow label="Chronic Kidney Disease" isPositive={result.CKD} />
                <ResultRow label="Liver Disease" isPositive={result.Liver_Disease} />
                <ResultRow label="Dehydration" isPositive={result.Dehydration} />
              </div>

              <button
                type="button"
                onClick={resetCheckup}
                className="mt-8 font-semibold text-teal-600 transition hover:text-teal-700 hover:underline"
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

const SidebarStep = ({ active, complete, icon, label }) => (
  <div className={`flex items-center gap-3 ${active || complete ? "opacity-100" : "opacity-60"}`}>
    <div className="rounded-xl bg-white/15 p-2.5">{icon}</div>
    <span className={active || complete ? "font-semibold" : ""}>{label}</span>
  </div>
);

const Field = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  step,
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-400"
    />
  </div>
);

const SelectInput = ({ label, name, value, onChange }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-600">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-teal-400"
    >
      <option value="0">Negative / Normal</option>
      <option value="1">Positive / Abnormal</option>
    </select>
  </div>
);

const ResultRow = ({ label, isPositive }) => (
  <div
    className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
      isPositive
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700"
    }`}
  >
    <span className="text-sm font-semibold">{label}</span>
    <span className="flex items-center gap-2 text-sm font-bold">
      {isPositive ? (
        <>
          <AlertCircle size={16} />
          Detected
        </>
      ) : (
        <>
          <CheckCircle size={16} />
          Healthy
        </>
      )}
    </span>
  </div>
);

export default KidneyTest;
