import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  Droplet,
  Droplets,
  Heart,
  Microscope,
  ScanSearch,
  Stethoscope,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import Homedynamictext from "../components/Homedynamictext";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1631556764629-b51c3ae40d18?auto=format&fit=crop&fm=jpg&q=80&w=1600",
    alt: "Clinical laboratory workflow",
    eyebrow: "Laboratory Research",
    title: "Clinical Lab Workflow",
    caption: "A cleaner workflow for structured report capture and AI-guided interpretation.",
  },
  {
    src: "https://images.unsplash.com/photo-1666214277657-e60f05c40b04?auto=format&fit=crop&fm=jpg&q=80&w=1600",
    alt: "Radiology team reviewing diagnostic scans",
    eyebrow: "Radiology Review",
    title: "Imaging Diagnostics",
    caption: "Bring scan review, model output, and guided analysis into one visual flow.",
  },
  {
    src: "https://images.unsplash.com/photo-1576765608741-911f44c98546?auto=format&fit=crop&fm=jpg&q=80&w=1600",
    alt: "Microscopy diagnostics in a lab",
    eyebrow: "Microscope Analysis",
    title: "Precision Screening",
    caption: "Use focused workflows for report extraction, microscopy support, and early signal review.",
  },
];

const HERO_PHRASES = [
  "Kidney Reports",
  "Heart Signals",
  "CBC Panels",
  "Lung Scans",
  "Brain MRI",
];

const HERO_SUPPORT_LINE =
  "Move from raw reports to clearer, earlier health signals across multiple modules.";

const HERO_TAGS = [
  "ECG Interpretation",
  "CBC Pattern Analysis",
  "Report Extraction",
  "MRI Review",
];

const SERVICE_LINKS = [
  { label: "Kidney", to: "/kidney-test" },
  { label: "Heart", to: "/heart-checkup" },
  { label: "Blood", to: "/blood-checkup" },
  { label: "Lung", to: "/lung-checkup" },
  { label: "Brain MRI", to: "/brain-mri" },
];

const HEALTH_MODULES = [
  {
    to: "/kidney-test",
    icon: Droplets,
    accent: "from-teal-300 via-emerald-400 to-cyan-400",
    iconClass: "text-teal-600",
    iconBg: "bg-teal-50",
    title: "Kidney Health",
    description: "Detect kidney stones, UTI, diabetes indicators, and report-level abnormalities from urinalysis workflows.",
  },
  {
    to: "/heart-checkup",
    icon: Heart,
    accent: "from-rose-300 via-pink-400 to-fuchsia-400",
    iconClass: "text-rose-600",
    iconBg: "bg-rose-50",
    title: "Heart Disease",
    description: "Upload ECG imagery and receive rhythm-focused AI analysis for cardiac screening support.",
  },
  {
    to: "/blood-checkup",
    icon: Droplet,
    accent: "from-red-300 via-orange-400 to-amber-400",
    iconClass: "text-red-600",
    iconBg: "bg-red-50",
    title: "Blood Picture",
    description: "Interpret CBC patterns for anemia, infection, and blood-disorder related diagnostic clues.",
  },
  {
    to: "/lung-checkup",
    icon: Stethoscope,
    accent: "from-sky-300 via-cyan-400 to-blue-400",
    iconClass: "text-sky-600",
    iconBg: "bg-sky-50",
    title: "Lung Health",
    description: "Explore lung screening workflows that support scan-based review and respiratory risk interpretation.",
  },
  {
    to: "/brain-mri",
    icon: Brain,
    accent: "from-amber-300 via-orange-300 to-yellow-400",
    iconClass: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "Brain MRI",
    description: "Review MRI-oriented analysis pathways for tumor, stroke, and neurological abnormality screening.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Activity,
    title: "Choose a workflow",
    description: "Open the health module that matches the report, scan, or ECG you want to analyze.",
  },
  {
    icon: Microscope,
    title: "Upload and verify",
    description: "Add your image or enter values manually, then confirm the extracted clinical details.",
  },
  {
    icon: ScanSearch,
    title: "Review AI guidance",
    description: "Get structured output that helps you understand the screening result faster.",
  },
];

const PLATFORM_HIGHLIGHTS = [
  {
    icon: Activity,
    title: "Smart diagnostics",
    description: "Bring multiple clinical inputs into one cleaner, guided frontend experience.",
  },
  {
    icon: Microscope,
    title: "Profile-aware flow",
    description: "Save user details once and reduce repeated entry across the protected checkup modules.",
  },
  {
    icon: ScanSearch,
    title: "Faster screening",
    description: "Move from upload to AI-supported review with less friction and clearer steps.",
  },
];

const Home = () => {
  const location = useLocation();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % HERO_IMAGES.length);
    }, 3600);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.replace("#", "");
    const target = document.getElementById(sectionId);

    if (!target) {
      return;
    }

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  const currentImage = HERO_IMAGES[activeImageIndex];
  const currentImageSrc = failedImages[currentImage.src]
    ? "/hero_doctor.png"
    : currentImage.src;

  const handleImageError = (src) => {
    setFailedImages((current) => ({ ...current, [src]: true }));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.18),transparent_28%),linear-gradient(180deg,#f7fffd_0%,#ffffff_68%)] px-6 pb-20 pt-16">
        <div className="absolute left-8 top-12 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute bottom-10 right-8 h-52 w-52 rounded-full bg-teal-100/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              AI-Powered Health Platform
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
              Early Screening For Modern Diagnostics
            </p>

            <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">
              <span className="block">Monitor Smarter,</span>
              <span className="mt-2 block">Analyze</span>
              <span className="mt-5 block">
                <span className="inline-flex h-[82px] min-w-[360px] max-w-full items-center rounded-[1.75rem] bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 px-7 text-white shadow-[0_18px_40px_rgba(13,148,136,0.22)] md:h-[92px] md:min-w-[470px]">
                  <Homedynamictext
                    strings={HERO_PHRASES}
                    className="block whitespace-nowrap text-[2.1rem] font-black leading-none md:text-[3.2rem]"
                  />
                </span>
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
              {HERO_SUPPORT_LINE}
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              {HERO_TAGS.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/kidney-test"
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-7 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-600 hover:to-teal-700"
              >
                Get Report
              </Link>
              <Link
                to="/about"
                className="rounded-xl bg-slate-950 px-7 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                About Us
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mx-auto w-full max-w-[490px]"
          >
            <div className="relative overflow-hidden rounded-[2.4rem] border border-slate-200 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
              <img
                src={currentImageSrc}
                alt={currentImage.alt}
                onError={() => handleImageError(currentImage.src)}
                className="h-[560px] w-full rounded-[1.9rem] object-cover"
              />
              <div className="absolute inset-x-8 bottom-8 rounded-[1.6rem] bg-gradient-to-t from-slate-950/92 via-slate-900/70 to-transparent px-6 pb-6 pt-20 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/70">
                  {currentImage.eyebrow}
                </p>
                <h3 className="mt-3 text-2xl font-bold">{currentImage.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                  {currentImage.caption}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="px-6 pb-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,118,110,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
                Services
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Jump straight into the five health modules
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {SERVICE_LINKS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-6">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {PLATFORM_HIGHLIGHTS.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-[1.7rem] border border-emerald-100 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,253,250,0.95)_100%)] p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Diagnostic Modules
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              One platform, five AI-supported screening paths
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Each module is tailored for a different report or imaging workflow so the user journey feels focused instead of generic.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {HEALTH_MODULES.map((module, index) => {
              const Icon = module.icon;

              return (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  <Link
                    to={module.to}
                    className="group block h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className={`h-2 rounded-full bg-gradient-to-r opacity-85 ${module.accent}`} />
                    <div className="mt-6 flex items-start justify-between gap-4">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${module.iconBg}`}>
                        <Icon size={32} className={module.iconClass} />
                      </div>
                      <ArrowRight className="mt-2 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
                    </div>
                    <h3 className="mt-8 text-2xl font-bold text-slate-900">
                      {module.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {module.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
              How It Works
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Guided workflows designed to feel simple
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              MediSense AI turns a complicated diagnostic journey into a clear set of steps, from upload to interpretation.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(248,250,252,1)_100%)] p-7 shadow-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
