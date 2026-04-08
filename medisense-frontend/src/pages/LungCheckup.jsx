import { useEffect, useState } from "react";
import { Activity, FileText, Stethoscope, User } from "lucide-react";

import SavedProfileBanner from "../components/SavedProfileBanner";
import { useAuth } from "../contexts/AuthContext";

const CLINICAL_FIELDS = [
  "Smoking History (years)",
  "Cough Duration (days)",
  "Chest Pain (0/1)",
  "Shortness of Breath (0/1)",
];

const LungCheckup = () => {
  const { profile } = useAuth();
  const hasSavedProfile = Boolean(
    profile?.full_name && profile?.age && profile?.gender,
  );

  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState({ name: "", age: "", gender: "Male" });

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-20">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl md:flex-row">
        <div className="md:w-1/3 bg-sky-500 p-10 text-white">
          <h2 className="mb-2 text-3xl font-bold">Lung Health</h2>
          <p className="mb-10 text-sky-100">Step {hasSavedProfile ? 2 : step} of 2</p>

          <div className="space-y-5">
            <SideStep
              icon={<User size={20} />}
              label={hasSavedProfile ? "Profile Saved" : "Patient Details"}
              active={!hasSavedProfile && step === 1}
              done={hasSavedProfile}
            />
            <SideStep
              icon={<FileText size={20} />}
              label="Clinical Data"
              active={step === 2}
              done={false}
            />
            <SideStep
              icon={<Activity size={20} />}
              label="AI Analysis"
              active={false}
              done={false}
            />
          </div>
        </div>

        <div className="md:w-2/3 p-10">
          {!hasSavedProfile && step === 1 ? (
            <>
              <h3 className="mb-6 text-2xl font-bold text-slate-800">
                Patient Information
              </h3>

              <div className="space-y-4">
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
                    <label className="mb-1 block text-sm font-medium text-slate-600">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={patient.gender}
                      onChange={handlePatientChange}
                      className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-sky-400"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-6 w-full rounded-xl bg-sky-500 py-3 font-bold text-white transition hover:bg-sky-600"
                >
                  Next Step
                </button>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <SavedProfileBanner
                profile={hasSavedProfile ? profile : null}
                tone="sky"
              />

              <h3 className="mb-6 text-2xl font-bold text-slate-800">
                Lung Clinical Data
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {CLINICAL_FIELDS.map((label) => (
                  <div key={label}>
                    <label className="mb-1 block text-sm font-medium text-slate-600">
                      {label}
                    </label>
                    <input
                      type="number"
                      placeholder="Enter value"
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 outline-none focus:border-sky-400"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                {!hasSavedProfile ? (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 rounded-xl border border-slate-300 py-3 font-semibold transition hover:bg-slate-100"
                  >
                    Back
                  </button>
                ) : null}
                <button
                  className={`${hasSavedProfile ? "w-full" : "w-2/3"} rounded-xl bg-sky-500 py-3 font-bold text-white transition hover:bg-sky-600`}
                >
                  Get AI Analysis
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const SideStep = ({ icon, label, active, done }) => (
  <div className={`flex items-center gap-3 ${active || done ? "font-bold opacity-100" : "opacity-70"}`}>
    <div className="rounded-lg bg-white/20 p-2">{icon}</div>
    {label}
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
      className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 outline-none focus:border-sky-400"
    />
  </div>
);

export default LungCheckup;
