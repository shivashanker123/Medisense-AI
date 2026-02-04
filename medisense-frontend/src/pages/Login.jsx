import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-emerald-100">

        {/* Header */}
        <h1 className="text-3xl font-bold text-emerald-600 text-center mb-2">
          Login
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Welcome to MediSense AI
        </p>

        {/* Google Login (NO BLACK) */}
        <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 mb-6 bg-white hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        <div className="text-center text-gray-400 mb-6">or</div>

        {/* Email Login */}
        <form className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          <button className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition">
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-emerald-600 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
