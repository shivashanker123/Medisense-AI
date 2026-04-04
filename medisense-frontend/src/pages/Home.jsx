import React from "react";
import {
  Droplet,
  Droplets,
  Heart,
  Stethoscope,
  Brain,
  ArrowRight,
  ShieldPlus,
  Users,
  Activity,
  Microscope,
  Clock,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const CHECKUP_CARDS = [
  {
    to: "/kidney-test",
    icon: <Droplets size={36} className="text-teal-600" />,
    iconBg: "bg-teal-50",
    border: "border-teal-500",
    accent: "text-teal-600",
    title: "Kidney Health",
    desc: "Detect kidney stones, UTI, and diabetes using urinalysis reports with AI-powered analysis.",
  },
  {
    to: "/heart-checkup",
    icon: <Heart size={36} className="text-red-500" />,
    iconBg: "bg-red-50",
    border: "border-red-500",
    accent: "text-red-500",
    title: "Heart Disease",
    desc: "Predict cardiac risks using ECG and blood pressure data through deep learning models.",
  },
  {
    to: "/blood-checkup",
    icon: <Droplet size={36} className="text-rose-600" />,
    iconBg: "bg-rose-50",
    border: "border-rose-500",
    accent: "text-rose-600",
    title: "Blood Picture",
    desc: "Analyze CBC reports for anemia, infections, and blood disorders automatically.",
  },
  {
    to: "/lung-checkup",
    icon: <Stethoscope size={36} className="text-sky-500" />,
    iconBg: "bg-sky-50",
    border: "border-sky-500",
    accent: "text-sky-600",
    title: "Lung Health",
    desc: "Detect pneumonia and lung cancer from chest X-rays using computer vision.",
  },
  {
    to: "/brain-mri",
    icon: <Brain size={36} className="text-amber-500" />,
    iconBg: "bg-amber-50",
    border: "border-amber-400",
    accent: "text-amber-600",
    title: "Brain MRI",
    desc: "Analyze MRI scans to detect tumors, stroke, and neurological abnormalities.",
  },
];

const FEATURES = [
  {
    icon: <ShieldPlus size={28} className="text-teal-600" />,
    title: "Emergency Help",
    desc: "Instant AI alerts to surface critical findings and guide you on priority medical actions.",
  },
  {
    icon: <Users size={28} className="text-teal-600" />,
    title: "Collaborative Communities",
    desc: "Share health insights and connect with others to build wellness communities together.",
  },
  {
    icon: <Activity size={28} className="text-teal-600" />,
    title: "Medical Treatment",
    desc: "Professional AI-driven analysis to diagnose, monitor, and manage your health conditions.",
  },
  {
    icon: <Microscope size={28} className="text-teal-600" />,
    title: "Lab Report Scanning",
    desc: "Upload any lab report image and let our AI extract and interpret values automatically.",
  },
  {
    icon: <Clock size={28} className="text-teal-600" />,
    title: "Real-Time Insights",
    desc: "Get instant health analysis results the moment you submit your report data.",
  },
  {
    icon: <Star size={28} className="text-teal-600" />,
    title: "Trusted by Doctors",
    desc: "Models trained on validated clinical datasets and reviewed by medical professionals.",
  },
];

const Home = () => {

  return (
    <div className="w-full bg-white min-h-screen font-sans overflow-x-hidden">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-emerald-50 overflow-hidden min-h-[520px] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-100 rounded-full opacity-40 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center relative z-10 w-full">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-teal-100 text-teal-700 text-sm font-semibold px-4 py-1 rounded-full mb-5">
              AI-Powered Health Platform
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Monitor{" "}
              <span className="text-teal-600">Smarter,</span>
              <br />
              Live{" "}
              <span className="text-teal-600">Healthier</span>
            </h1>
            <p className="text-slate-500 text-lg mb-8 max-w-lg">
              Health monitoring system that keeps track of vital metrics, providing
              real-time insights to help you make informed health choices and live
              a healthier life.
            </p>
            <div className="flex gap-4">
              <Link
                to="/kidney-test"
                className="bg-teal-600 text-white px-7 py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-200"
              >
                Get Report
              </Link>
              <Link
                to="/about"
                className="bg-slate-900 text-white px-7 py-3 rounded-xl font-bold hover:bg-slate-700 transition"
              >
                About Us
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-10">
              {[["10K+", "Reports Analyzed"], ["98%", "Accuracy Rate"], ["5", "Health Modules"]].map(
                ([num, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-extrabold text-teal-600">{num}</p>
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Doctor image */}
          <motion.div
            className="relative flex justify-center items-end"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Glowing ring */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-teal-200 rounded-full opacity-30 blur-2xl" />
            <img
              src="/hero_doctor.png"
              alt="MediSense AI Doctor"
              className="relative z-10 max-h-[420px] object-contain drop-shadow-2xl"
            />
            {/* Floating badge */}
            <div className="absolute top-8 right-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-teal-100">
              <div className="bg-teal-100 p-2 rounded-full">
                <Activity size={18} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Live Analysis</p>
                <p className="text-sm font-bold text-slate-800">AI Ready</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SERVICE CARDS (overlapping hero) ═══════════════ */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <ShieldPlus size={24} />,
              title: "Smart Diagnostics",
              desc: "Upload lab reports and get AI insights and possible health conditions for informed actions.",
            },
            {
              icon: <Activity size={24} />,
              title: "Track Your Progress",
              desc: "Monitor your health metrics over time and enhance performance to achieve your goals.",
            },
            {
              icon: <Clock size={24} />,
              title: "Real-Time Monitoring",
              desc: "Keep track of vital metrics, delivering real-time insights for proactive and personalized care.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-teal-600 text-white rounded-2xl p-7 shadow-xl relative overflow-hidden group hover:bg-teal-700 transition"
            >
              <div className="absolute right-4 bottom-4 opacity-10 group-hover:opacity-20 transition">
                <div className="w-20 h-20">{item.icon}</div>
              </div>
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-teal-100 text-sm mb-4">{item.desc}</p>
              <button className="flex items-center gap-1 text-sm font-bold tracking-wide text-white hover:gap-3 transition-all">
                LEARN MORE <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CHECKUP CARDS — ALL 5 ═══════════════ */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-widest">
              Our Services
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-3">
              AI Health Checkups
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Choose from our suite of AI-powered diagnostic tools. Upload your
              reports and get instant, accurate health insights.
            </p>
          </div>

          {/* Row 1 — 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {CHECKUP_CARDS.slice(0, 3).map((card) => (
              <CheckupCard key={card.to} card={card} />
            ))}
          </div>

          {/* Row 2 — 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:max-w-2xl md:mx-auto">
            {CHECKUP_CARDS.slice(3).map((card) => (
              <CheckupCard key={card.to} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CONNECT SECTION ═══════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3">
              Connect To The Doctor Nearby
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Providing reliable care and support for you and your family with
              compassion and cutting-edge AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-teal-600 transition">
                  <div className="group-hover:[&_svg]:text-white transition">
                    {f.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="bg-gradient-to-r from-teal-600 to-emerald-600 py-16 px-6 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Start with any of our AI-powered checkups today. No specialist
            appointment needed — just upload your report.
          </p>
          <Link
            to="/kidney-test"
            className="bg-white text-teal-600 px-8 py-3 rounded-xl font-bold hover:bg-teal-50 transition shadow-xl"
          >
            Start Your First Checkup →
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

/* ── Reusable Checkup Card ── */
const CheckupCard = ({ card }) => (
  <Link to={card.to} className="block group">
    <div
      className={`bg-white rounded-3xl p-8 shadow-md border-t-4 ${card.border} hover:-translate-y-3 hover:shadow-xl transition-all duration-300 h-full`}
    >
      <div className={`${card.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-5`}>
        {card.icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{card.desc}</p>
      <span className={`${card.accent} font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all`}>
        Start Checkup <ArrowRight size={16} />
      </span>
    </div>
  </Link>
);

export default Home;