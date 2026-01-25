{/* Card 2: Heart (Slide from RIGHT) */}
<motion.div
  initial={{ opacity: 0, x: 100 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  viewport={{ once: true }}
>
  <div className="bg-white p-10 rounded-3xl shadow-xl hover:-translate-y-2 transition duration-300 border-t-8 border-rose-400 group cursor-pointer">
    
    <div className="bg-rose-100/60 w-20 h-20 rounded-full flex items-center justify-center mb-6">
      <Heart size={40} className="text-rose-500" />
    </div>

    <h2 className="text-3xl font-bold text-slate-800 mb-4">
      Heart Disease
    </h2>

    <p className="text-slate-500 mb-8">
      Analyze ECG and Blood Pressure data to predict cardiac risks.
    </p>

    <Link to="/heart-checkup">
      <span className="text-rose-500 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
        Start Checkup <ArrowRight />
      </span>
    </Link>

  </div>
</motion.div>
