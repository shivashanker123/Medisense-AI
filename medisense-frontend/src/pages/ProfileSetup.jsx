import { useEffect, useState } from "react";
import { User, CalendarDays } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, saveProfile, profileLoading } = useAuth();

  const nextPath =
    new URLSearchParams(location.search).get("next") || "/kidney-test";

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "Male",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFormData({
      fullName: profile.full_name || "",
      age: profile.age ? String(profile.age) : "",
      gender: profile.gender || "Male",
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await saveProfile(formData);
      navigate(nextPath, { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to save your profile right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-6 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-10 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-100">
              Patient Profile
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              One quick step before your health modules
            </h1>
            <p className="mt-4 text-sm leading-6 text-emerald-100">
              Save your basic profile once and we will prefill it when you open
              kidney and heart analysis flows.
            </p>
            <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-5 text-sm">
              <p className="font-semibold">Signed in as</p>
              <p className="mt-1 break-all text-emerald-50">
                {user?.email || "Unknown account"}
              </p>
            </div>
          </div>

          <div className="p-10 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900">
              Complete your details
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              We will store your name, age, and gender in Supabase so the health
              modules can use them automatically.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Full Name
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <User size={18} className="text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-transparent outline-none"
                    disabled={saving || profileLoading}
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Age
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <CalendarDays size={18} className="text-slate-400" />
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      min="1"
                      className="w-full bg-transparent outline-none"
                      disabled={saving || profileLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                    disabled={saving || profileLoading}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving || profileLoading}
                className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving your profile..." : "Save and continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
