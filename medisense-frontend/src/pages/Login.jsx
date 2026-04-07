import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { hasSupabaseConfig, supabase } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is not configured yet. Add your frontend environment keys first.");
      return;
    }

    setSubmitting(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-10 shadow-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-emerald-600">
          Login
        </h1>
        <p className="mb-8 text-center text-gray-500">
          Welcome to MediSense AI
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
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
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500">
          Do not have an account?{" "}
          <Link to="/signup" className="font-semibold text-emerald-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
