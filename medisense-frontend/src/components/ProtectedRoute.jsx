import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function StatusScreen({ title, description }) {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ requireProfile = true }) {
  const location = useLocation();
  const {
    hasSupabaseConfig,
    loading,
    profileLoading,
    isAuthenticated,
    isProfileComplete,
  } = useAuth();

  const nextPath = `${location.pathname}${location.search}${location.hash}`;

  if (!hasSupabaseConfig) {
    return (
      <StatusScreen
        title="Supabase setup is required"
        description="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your frontend environment before using the protected health modules."
      />
    );
  }

  if (loading || (isAuthenticated && requireProfile && profileLoading)) {
    return (
      <StatusScreen
        title="Preparing your account"
        description="Checking your sign-in session and loading your saved profile."
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(nextPath)}`}
        replace
      />
    );
  }

  if (requireProfile && !isProfileComplete) {
    return (
      <Navigate
        to={`/complete-profile?next=${encodeURIComponent(nextPath)}`}
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
