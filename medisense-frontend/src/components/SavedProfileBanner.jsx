import { User } from "lucide-react";

const TONE_STYLES = {
  teal: {
    wrapper: "border-teal-100 bg-teal-50",
    icon: "bg-white text-teal-600",
    title: "text-teal-700",
  },
  rose: {
    wrapper: "border-rose-100 bg-rose-50",
    icon: "bg-white text-rose-600",
    title: "text-rose-700",
  },
  sky: {
    wrapper: "border-sky-100 bg-sky-50",
    icon: "bg-white text-sky-600",
    title: "text-sky-700",
  },
  amber: {
    wrapper: "border-amber-100 bg-amber-50",
    icon: "bg-white text-amber-600",
    title: "text-amber-700",
  },
};

function SavedProfileBanner({
  profile,
  tone = "teal",
  title = "Using your saved profile",
}) {
  if (!profile) {
    return null;
  }

  const styles = TONE_STYLES[tone] ?? TONE_STYLES.teal;

  return (
    <div
      className={`mb-6 flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 ${styles.wrapper}`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${styles.icon}`}
      >
        <User size={18} />
      </div>

      <div className="min-w-[180px] flex-1">
        <p className={`text-sm font-semibold ${styles.title}`}>{title}</p>
        <p className="text-sm text-slate-600">{profile.full_name}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
        {profile.age ? (
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">
            Age {profile.age}
          </span>
        ) : null}
        {profile.gender ? (
          <span className="rounded-full bg-white px-3 py-1 shadow-sm">
            {profile.gender}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default SavedProfileBanner;
