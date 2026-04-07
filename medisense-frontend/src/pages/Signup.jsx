import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { hasSupabaseConfig, supabase } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is not configured yet. Add your frontend environment keys first.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName.trim(),
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }

    if (data.session) {
      navigate("/", { replace: true });
      return;
    }

    setMessage("Your account was created. Confirm your email, then log in.");
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-10 shadow-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-emerald-600">
          Sign Up
        </h1>
        <p className="mb-8 text-center text-gray-500">
          Create your MediSense AI account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full bg-transparent outline-none"
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full bg-transparent outline-none"
                autoComplete="new-password"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-emerald-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
