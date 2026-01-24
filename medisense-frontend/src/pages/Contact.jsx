import { Phone, Mail, MapPin, GraduationCap } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10 border border-emerald-100">

        {/* Header */}
        <h1 className="text-3xl font-bold text-emerald-500 text-center mb-2">
          Contact Us
        </h1>
        <p className="text-center text-gray-500 mb-10">
          MediSense AI – About & Contact Information
        </p>

        {/* Team Section */}
        <div className="space-y-4 mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            👨‍💻 Team Members
          </h2>

          {[
            { name: "P Shiva Shanker", phone: "+91 88865 38260" },
            { name: "C H Abhinav", phone: "+91  90144 10846" },
            { name: "N S V Chiranjeevi", phone: "+91 81069 39375" },
            { name: "K Chandrasekhar", phone: "+91 9347274730" },
          ].map((member) => (
            <div
              key={member.name}
              className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-3"
            >
              <span className="font-medium text-gray-700">
                {member.name}
              </span>
              <a
                href={`tel:${member.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-emerald-600 hover:underline"
              >
                <Phone size={16} />
                {member.phone}
              </a>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="space-y-4 text-gray-600">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-emerald-500" />
            Hyderabad, Telangana
          </div>

          <div className="flex items-center gap-3">
            <GraduationCap size={18} className="text-emerald-500" />
            JNTU Hyderabad
          </div>

          <div className="flex items-center gap-3">
            <Mail size={18} className="text-emerald-500" />
            <a
              href="mailto:koduruchandrasekhar10@gmail.com"
              className="text-emerald-600 hover:underline font-medium"
            >
              koduruchandrasekhar10@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
