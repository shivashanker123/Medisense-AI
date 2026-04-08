import { Activity, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/#services" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const { hasSupabaseConfig, isAuthenticated, profile, signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Unable to sign out.", error);
    }
  };

  const userLabel = profile?.full_name || user?.email || "Signed in";
  const profileMeta = [profile?.age ? `Age ${profile.age}` : null, profile?.gender]
    .filter(Boolean)
    .join(" | ");

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <div className="animate-heartbeat text-emerald-600">
            <Activity size={32} strokeWidth={2.5} />
          </div>
          <span className="animate-glow text-2xl font-bold tracking-wide text-emerald-700">
            MediSense <span className="text-emerald-500">AI</span>
          </span>
        </Link>

        <div className="hidden gap-8 font-medium text-slate-600 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="transition hover:text-emerald-600"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {hasSupabaseConfig && isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2 shadow-sm">
              <p className="text-sm font-semibold text-emerald-700">{userLabel}</p>
              {profileMeta ? (
                <p className="text-xs font-medium text-emerald-600/90">{profileMeta}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:from-emerald-600 hover:to-teal-700"
          >
            Login / Signup
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
