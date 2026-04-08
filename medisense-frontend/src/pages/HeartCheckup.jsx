import { useEffect, useState } from "react";
import axios from "axios";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  FileText,
  Upload,
  User,
} from "lucide-react";

import SavedProfileBanner from "../components/SavedProfileBanner";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const HeartCheckup = () => {
  const { profile } = useAuth();
  const hasSavedProfile = Boolean(
    profile?.full_name && profile?.age && profile?.gender,
  );

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [ecgImage, setEcgImage] = useState(null);
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
  });

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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setEcgImage(file);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
    } catch (submitError) {
      const detail =
        submitError?.response?.data?.detail ||
        "Unable to analyze ECG image. Please check backend and try again.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const resetCheckup = () => {
    setLoading(false);
    setError("");
    setResult(null);
    setEcgImage(null);
    setPatient({
      name: hasSavedProfile ? profile.full_name : "",
      age: hasSavedProfile ? String(profile.age) : "",
      gender: hasSavedProfile ? profile.gender : "Male",
    });
    setStep(hasSavedProfile ? 2 : 1);
  };

  const sortedProbs = result?.probabilities
    ? Object.entries(result.probabilities).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-[300px_1fr]">
        <div className="bg-gradient-to-b from-rose-500 to-pink-600 p-8 text-white">
          <h1 className="text-4xl font-bold">Heart Checkup</h1>
          <p className="mt-3 text-sm text-rose-100">
            Step {hasSavedProfile ? Math.max(step, 2) : Math.min(step, 3)} of 3
          </p>

          <div className="mt-12 space-y-5">
            <SidebarStep
              active={!hasSavedProfile && step === 1}
              complete={hasSavedProfile}
              icon={<User size={18} />}
              label={hasSavedProfile ? "Profile Saved" : "Patient Details"}
            />
            <SidebarStep
              active={step === 2}
              complete={step > 2}
              icon={<FileText size={18} />}
              label="ECG Upload"
            />
            <SidebarStep
              active={step === 3}
              complete={false}
              icon={<Activity size={18} />}
              label="AI Analysis"
            />
          </div>
        </div>

        <div className="p-8 md:p-10">
          {!hasSavedProfile && step === 1 ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Patient Information</h2>

              <Field
                label="Full Name"
                name="name"
                value={patient.name}
                onChange={handlePatientChange}
                placeholder="John Doe"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Age"
                  name="age"
                  type="number"
                  value={patient.age}
                  onChange={handlePatientChange}
                  placeholder="45"
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={patient.gender}
                    onChange={handlePatientChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-rose-400"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3 font-semibold text-white transition hover:from-rose-600 hover:to-pink-700"
              >
                Next Step
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <SavedProfileBanner
                profile={hasSavedProfile ? profile : null}
                tone="rose"
              />

              <div>
                <h2 className="text-3xl font-bold text-slate-900">Upload ECG Image</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                  Upload a clear ECG graph image. The backend converts it into a 1D signal and runs the trained ECG model.
                </p>
              </div>

              <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-[1.8rem] border-2 border-dashed border-rose-200 bg-rose-50/50 p-10 text-center transition hover:bg-rose-50">
                <div className="rounded-full bg-white p-4 shadow-sm">
                  <Upload className="text-rose-600" />
                </div>
                <span className="mt-4 text-lg font-semibold text-slate-800">
                  {ecgImage ? ecgImage.name : "Click to choose an ECG image"}
                </span>
                <span className="mt-1 text-sm text-slate-500">PNG, JPG, JPEG</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="flex gap-4">
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
                  className={`${hasSavedProfile ? "w-full" : "w-2/3"} rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3 font-semibold text-white transition hover:from-rose-600 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  {loading ? "Analyzing..." : "Run AI Analysis"}
                </button>
              </div>
            </form>
          ) : null}

          {step === 3 && result ? (
            <div className="space-y-6">
              <SavedProfileBanner
                profile={hasSavedProfile ? profile : null}
                tone="rose"
              />

              <div>
                <h2 className="text-3xl font-bold text-slate-900">AI Analysis Result</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Patient: {patient.name || "N/A"} | Age: {patient.age || "N/A"} | Gender: {patient.gender}
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-rose-200 bg-rose-50 p-5">
                <div className="text-sm text-rose-700">Predicted Rhythm Class</div>
                <div className="mt-2 text-2xl font-bold text-rose-900">
                  {result.predicted_class}
                </div>
                <div className="mt-2 text-sm text-rose-700">
                  Confidence: {(result.confidence * 100).toFixed(2)}%
                </div>
              </div>

              <div className="space-y-3">
                {sortedProbs.map(([label, probability]) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                      label === result.predicted_class
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      {label === result.predicted_class ? (
                        <AlertCircle size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      {label}
                    </span>
                    <span className="text-sm font-bold">
                      {(probability * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setError("");
                    setStep(2);
                  }}
                  className="w-1/2 rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Try Another ECG
                </button>
                <button
                  type="button"
                  onClick={resetCheckup}
                  className="w-1/2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3 font-semibold text-white transition hover:from-rose-600 hover:to-pink-700"
                >
                  Start New Checkup
                </button>
              </div>
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
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-rose-400"
    />
  </div>
);

export default HeartCheckup;
