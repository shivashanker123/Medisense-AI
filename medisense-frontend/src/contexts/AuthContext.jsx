/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

import { hasSupabaseConfig, supabase } from "../lib/supabase";

const AuthContext = createContext(undefined);

const PROFILE_COLUMNS = "id, email, full_name, age, gender, created_at, updated_at";

function isProfileComplete(profile) {
  return Boolean(
    profile?.full_name?.trim() &&
      profile?.age &&
      profile?.gender?.trim(),
  );
}

async function fetchProfileByUserId(userId) {
  if (!supabase || !userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ?? null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    const syncProfile = async (userId) => {
      if (!userId) {
        if (active) {
          setProfile(null);
          setProfileLoading(false);
        }
        return null;
      }

      if (active) {
        setProfileLoading(true);
      }

      try {
        const nextProfile = await fetchProfileByUserId(userId);
        if (active) {
          setProfile(nextProfile);
        }
        return nextProfile;
      } catch (error) {
        console.error("Unable to load profile from Supabase.", error);
        if (active) {
          setProfile(null);
        }
        return null;
      } finally {
        if (active) {
          setProfileLoading(false);
        }
      }
    };

    const bootstrap = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!active) {
          return;
        }

        setSession(currentSession);
        await syncProfile(currentSession?.user?.id);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);

      if (nextSession?.user?.id) {
        void syncProfile(nextSession.user.id);
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    const userId = session?.user?.id;
    if (!userId) {
      setProfile(null);
      return null;
    }

    setProfileLoading(true);
    try {
      const nextProfile = await fetchProfileByUserId(userId);
      setProfile(nextProfile);
      return nextProfile;
    } catch (error) {
      console.error("Unable to refresh profile from Supabase.", error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  const saveProfile = async ({ fullName, age, gender }) => {
    if (!supabase || !session?.user) {
      throw new Error("You must be logged in before saving a profile.");
    }

    const trimmedName = fullName.trim();
    const parsedAge = Number.parseInt(age, 10);

    if (!trimmedName) {
      throw new Error("Name is required.");
    }

    if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
      throw new Error("Age must be a valid positive number.");
    }

    if (!gender) {
      throw new Error("Gender is required.");
    }

    const payload = {
      id: session.user.id,
      email: session.user.email,
      full_name: trimmedName,
      age: parsedAge,
      gender,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      throw error;
    }

    const nextProfile = { ...profile, ...payload };
    setProfile(nextProfile);
    return nextProfile;
  };

  const signOut = async () => {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const value = {
    hasSupabaseConfig,
    supabase,
    session,
    user: session?.user ?? null,
    profile,
    loading,
    profileLoading,
    isAuthenticated: Boolean(session?.user),
    isProfileComplete: isProfileComplete(profile),
    refreshProfile,
    saveProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
