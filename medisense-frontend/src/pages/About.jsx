export default function About() {
  return (
    <section className="px-12 py-24 max-w-7xl mx-auto">

      <h2 className="text-5xl font-extrabold text-teal-600 text-center mb-10">
        About MediSense AI
      </h2>

      <p className="text-gray-700 text-lg leading-8 text-center max-w-4xl mx-auto mb-16">
        <span className="font-semibold">MediSense AI</span> is an intelligent healthcare
        prediction platform developed by second-year Computer Science Engineering
        students from <span className="font-semibold">JNTU Hyderabad</span>.
        The project leverages Artificial Intelligence and Machine Learning to
        assist in early disease risk assessment and preventive healthcare.
      </p>

      <div className="grid md:grid-cols-2 gap-12 mb-20">

        <div className="bg-gray-50 p-10 rounded-2xl shadow-sm">
          <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
          <p className="text-gray-700 leading-8">
            To develop accessible, scalable, and reliable AI systems that support
            early diagnosis and healthcare decision-making through data-driven
            insights.
          </p>
        </div>

        <div className="bg-gray-50 p-10 rounded-2xl shadow-sm">
          <h3 className="text-2xl font-bold mb-4">Disease Prediction Models</h3>
          <ul className="list-disc list-inside text-gray-700 leading-7">
            <li>Kidney Disease Prediction</li>
            <li>Lung Disease Prediction</li>
            <li>Heart Disease Prediction</li>
            <li>Blood Test Analysis</li>
          </ul>
        </div>

      </div>

      <h3 className="text-4xl font-bold text-center mb-12">
        Core Development Team
      </h3>

      <div className="grid md:grid-cols-2 gap-10">

        <div className="p-8 border rounded-2xl shadow-sm">
          <h4 className="text-2xl font-bold text-teal-600">P. Shiva Shanker</h4>
          <p className="mt-2 text-gray-600">
            Frontend Developer & ML Engineer
          </p>
          <p className="mt-4 text-gray-700">
            Frontend development, Kidney and Lung disease prediction models.
          </p>
        </div>

        <div className="p-8 border rounded-2xl shadow-sm">
          <h4 className="text-2xl font-bold text-teal-600">C. Abhinav</h4>
          <p className="mt-2 text-gray-600">
            Backend Developer & ML Engineer
          </p>
          <p className="mt-4 text-gray-700">
            Backend development, Kidney and Lung disease prediction models.
          </p>
        </div>

        <div className="p-8 border rounded-2xl shadow-sm">
          <h4 className="text-2xl font-bold text-teal-600">
            N. S. V. Chiranjeevi
          </h4>
          <p className="mt-2 text-gray-600">
            Backend Developer & ML Engineer
          </p>
          <p className="mt-4 text-gray-700">
            Blood Test and Heart disease prediction models.
          </p>
        </div>

        <div className="p-8 border rounded-2xl shadow-sm">
          <h4 className="text-2xl font-bold text-teal-600">
            K. Chandrasekhar
          </h4>
          <p className="mt-2 text-gray-600">
            Frontend Developer & ML Engineer
          </p>
          <p className="mt-4 text-gray-700">
            Frontend development, Blood Test and Heart disease prediction models.
          </p>
        </div>

      </div>

      <p className="text-center text-gray-600 mt-20">
        Built by CSE students with a passion for AI-driven healthcare innovation.
      </p>

    </section>
  );
}
