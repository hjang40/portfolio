import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

// Pokemon-style UI Frame (matching About page)
const PokemonFrame = ({ children, variant = "blue", className = "" }) => {
  const colors = {
    blue: "from-blue-600 to-blue-800",
    purple: "from-purple-600 to-purple-800",
    green: "from-green-600 to-green-800",
    orange: "from-orange-600 to-orange-800",
    yellow: "from-yellow-600 to-yellow-800",
    red: "from-red-600 to-red-800",
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main frame */}
      <div
        className={`bg-gradient-to-br ${colors[variant]} p-1 rounded-2xl shadow-2xl border-4 border-white/20`}
      >
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-700/50">
          {children}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-white"></div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-400 rounded-full border-2 border-white"></div>
    </div>
  );
};

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await emailjs.send(
        "service_3pjafyh",
        "template_8717rqo",
        formData,
        "YUu5oiMyx834ATfmr"
      );

      console.log("Email sent:", result.text);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Email error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const contactMethods = [
    {
      type: "Email",
      value: "hyun@gmail.com",
      icon: "📧",
      color: "blue",
    },
    {
      type: "LinkedIn",
      value: "www.linkedin.com/in/hyun-jang",
      icon: "💼",
      color: "purple",
    },
    {
      type: "GitHub",
      value: "github.com/hjang40",
      icon: "💻",
      color: "green",
    },
    {
      type: "Phone",
      value: "(301) 377 - 2321",
      icon: "📱",
      color: "orange",
    },
  ];

  return (
    <div
      className="min-h-screen text-white font-pokemon relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at bottom, #0f1419 0%, #020617 100%)",
      }}
    >
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Exit Button */}
      <div className="fixed top-8 right-8 z-50">
        <PokemonFrame variant="red">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg border-2 border-red-400 transition-all duration-300 transform hover:scale-105"
          >
            ← HOME
          </button>
        </PokemonFrame>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-7xl">
          {/* Title */}
          <div className="text-center mb-12">
            <PokemonFrame variant="blue" className="inline-block mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white font-bold text-2xl">📞</span>
                </div>
                <div>

                  <div className="text-white text-2xl font-bold">
                    CONTACT
                  </div>
                </div>
              </div>
            </PokemonFrame>

            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 drop-shadow-lg">
              LET'S CONNECT
            </h1>
            <div className="h-1 w-64 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full mx-auto mt-4"></div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Contact Methods */}
            <div className="space-y-6">
              <PokemonFrame variant="blue">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🎯</span>
                    <h2 className="text-2xl text-yellow-300 font-bold">
                      CONTACT CHANNELS
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <div
                        key={index}
                        className={`bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl border-2 border-gray-600 hover:border-${method.color}-400 transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600">
                            <span className="text-2xl">{method.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-yellow-300 font-bold text-sm uppercase tracking-wider">
                              {method.type}
                            </div>
                            <div className="text-white text-sm break-all">
                              {method.value}
                            </div>
                          </div>
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PokemonFrame>

              {/* Info Message */}
              {/* <PokemonFrame variant="green">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💭</span>
                    <h3 className="text-xl text-yellow-300 font-bold">
                      NOTE
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Ready to embark on collaborative adventures! Whether you're interested in 
                    discussing cutting-edge tech, neuroscience breakthroughs, or potential 
                    project partnerships, I'm always excited to connect with fellow innovators 
                    and curious minds.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {["Collaboration", "Research", "Innovation", "Networking"].map((tag, i) => (
                      <span
                        key={i}
                        className="bg-green-600/20 border border-green-400 px-3 py-1 rounded-full text-green-300 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </PokemonFrame> */}
            </div>

            {/* Right Side - Contact Form */}
            <div>
              <PokemonFrame variant="purple">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">📨</span>
                    <h2 className="text-2xl text-yellow-300 font-bold">
                      SEND MESSAGE
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-yellow-300 font-bold text-sm uppercase tracking-wider mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none transition-all duration-300"
                        placeholder="Enter your name..."
                      />
                    </div>

                    <div>
                      <label className="block text-yellow-300 font-bold text-sm uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white  focus:border-purple-400 focus:outline-none transition-all duration-300"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-yellow-300 font-bold text-sm uppercase tracking-wider mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-white  resize-none focus:border-purple-400 focus:outline-none transition-all duration-300"
                        placeholder="Write your message here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                        isSubmitting
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                      } border-2 border-purple-400 text-white`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          SENDING MESSAGE...
                        </span>
                      ) : (
                        "🚀 LAUNCH MESSAGE"
                      )}
                    </button>

                    {/* Status Messages */}
                    {submitStatus === "success" && (
                      <PokemonFrame variant="green" className="text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-2xl">✅</span>
                          <span className="text-green-300 font-bold">
                            Message sent successfully! I'll get back to you soon.
                          </span>
                        </div>
                      </PokemonFrame>
                    )}

                    {submitStatus === "error" && (
                      <PokemonFrame variant="red" className="text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-2xl">❌</span>
                          <span className="text-red-300 font-bold">
                            Message failed to send. Please try again.
                          </span>
                        </div>
                      </PokemonFrame>
                    )}
                  </form>
                </div>
              </PokemonFrame>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-6 mt-12">
            {[
              { label: "ABOUT", to: "/about", variant: "blue" },
              { label: "PROJECTS", to: "/projects", variant: "orange" },
              { label: "HOME", to: "/", variant: "yellow" },
            ].map((btn) => (
              <NavLink key={btn.to} to={btn.to}>
                <PokemonFrame variant={btn.variant}>
                  <div className="px-6 py-3 font-bold text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
                    {btn.label}
                  </div>
                </PokemonFrame>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;