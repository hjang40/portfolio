import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import Pokeball1 from "../models/Pokeball1";
import BrainComp from "../models/Brain_Comp";
import GraduationHat from "../models/Graduation_Hat";
import Hobbies from "../models/Hobbies";
import Compass from "../models/Compass";
import textBg from "../assets/images/text.png";

// Pokemon-style UI Frame
const PokemonFrame = ({ children, variant = "blue", className = "" }) => {
  const colors = {
    blue: "from-blue-600 to-blue-800",
    purple: "from-purple-600 to-purple-800",
    green: "from-green-600 to-green-800",
    orange: "from-orange-600 to-orange-800",
    yellow: "from-yellow-600 to-yellow-800",
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

// Generic 3D Model Component that can render different models
const Animated3DModel = ({ modelJSX, sectionIndex, isActive }) => {
  const modelRef = useRef();
  const particleRef = useRef();

  const colors = ["#60a5fa", "#a78bfa", "#34d399", "#fb923c", "#fbbf24"];

  useFrame((state) => {
    if (modelRef.current) {
      const time = state.clock.elapsedTime;

      // Set floating animation to a stable sine wave (not adding to position)
      modelRef.current.position.y = Math.sin(time * 1.2 + sectionIndex) * 0.5;

      // Active scaling effect
      const targetScale = isActive ? 1.1 : 1.0;
      modelRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15
      );
    }

    // Energy particles around model
    if (particleRef.current && isActive) {
      const time = state.clock.elapsedTime;
      particleRef.current.rotation.y = time * 2;
      particleRef.current.children.forEach((particle, i) => {
        particle.position.y = Math.sin(time * 3 + i) * 0.5;
        particle.material.opacity = 0.5 + Math.sin(time * 4 + i) * 0.3;
      });
    }
  });

  return (
    <group>
      <group ref={modelRef}>{modelJSX}</group>

      {/* Energy particles */}
      {isActive && (
        <group ref={particleRef}>
          {[...Array(12)].map((_, i) => (
            <mesh
              key={i}
              position={[Math.cos(i * 0.524) * 4, 0, Math.sin(i * 0.524) * 4]}
            >
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color={colors[sectionIndex]} transparent />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// Pokemon-style Section Component
const PokemonSection = ({ section, index, isActive }) => {
  const variants = ["blue", "purple", "green", "orange", "yellow"];

  return (
    <div
      className={`min-h-screen flex items-center justify-between px-8 py-12 transition-all duration-1000 ${
        isActive ? "opacity-100" : "opacity-30"
      }`}
    >
      {/* Left side - Game UI Style */}
      <div className="flex-1 max-w-2xl space-y-8">
        {/* Pokemon-style header */}
        <PokemonFrame variant={variants[index]} className="inline-block">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white font-bold text-lg">{index + 1}</span>
            </div>
            <div>
              <div className="text-yellow-300 text-sm font-mono uppercase tracking-wider">
                {/* {section.category} */}
              </div>
              <div className="text-white text-lg font-bold">
                {section.category}
              </div>
            </div>
          </div>
        </PokemonFrame>

        {/* Title with Pokemon-style effects */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white leading-tight">
            {section.title.split(" ").map((word, i) => (
              <span
                key={i}
                className={`inline-block mr-4 transition-all duration-700 delay-${
                  i * 150
                } drop-shadow-lg`}
                style={{
                  color: section.color,
                  transform: isActive
                    ? "translateY(0) scale(1)"
                    : "translateY(30px) scale(0.9)",
                  opacity: isActive ? 1 : 0.7,
                  textShadow: isActive ? `0 0 20px ${section.color}` : "none",
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"></div>
        </div>

        {/* Pokemon-style text box */}
        <PokemonFrame variant={variants[index]} className="max-w-xl">
          <div className="space-y-4">
            <h2 className="text-xl text-yellow-300 font-semibold border-b border-gray-600 pb-2">
              {section.subtitle}
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg font-mono">
              {section.content}
            </p>
          </div>
        </PokemonFrame>

        {/* Skills as Pokemon-style badges */}
        {section.skills && (
          <div className="space-y-4">
            <div className="text-yellow-300 font-bold text-lg flex items-center gap-2">
              <span>⭐</span> SKILLS
            </div>
            <div className="grid grid-cols-2 gap-3">
              {section.skills.map((skill, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-3 rounded-xl border-2 border-gray-600 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-mono text-sm">
                      {skill}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right side - 3D Model */}
      <div className="flex-1 flex justify-center items-center relative h-screen">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            right: 0,
          }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <pointLight
              position={[-5, -5, 5]}
              intensity={0.8}
              color={section.color}
            />

            <Animated3DModel
              modelJSX={section.modelJSX}
              sectionIndex={index}
              isActive={isActive}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

// Pokemon-style Progress HUD
const PokemonHUD = ({ currentSection, totalSections, onSectionChange }) => {
  const progress = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="fixed top-8 left-8 z-50">
      <PokemonFrame variant="blue" className="w-64">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-yellow-300 font-bold text-sm">JOURNEY</span>
            <span className="text-white font-mono text-sm">
              {currentSection + 1}/{totalSections}
            </span>
          </div>

          {/* Pokemon-style health bar as progress */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden border-2 border-gray-600">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
            <div className="text-gray-400 text-xs font-mono">
              EXPLORATION PROGRESS
            </div>
          </div>

          {/* Section navigator */}
          <div className="flex gap-2">
            {[...Array(totalSections)].map((_, i) => (
              <button
                key={i}
                onClick={() => onSectionChange(i)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  i === currentSection
                    ? "bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/50"
                    : i < currentSection
                    ? "bg-green-400 border-green-300"
                    : "bg-gray-600 border-gray-500 hover:border-gray-400"
                }`}
              >
                <span className="text-white text-xs font-bold">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </PokemonFrame>
    </div>
  );
};

// Pokemon-style Navigation Menu
const PokemonMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-8 right-8 z-50">
      <PokemonFrame variant="yellow">
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg border-2 border-red-400 transition-all duration-300 transform hover:scale-105"
          >
            ← EXIT
          </button>
        </div>
      </PokemonFrame>
    </div>
  );
};

// Main About Component
const About = () => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "HYUN SEO JANG",
      subtitle: "About Me",
      content:
        "Hello! I'm a Senior majoring in Computer Science with a minor in Neuroscience at the University of Maryland, College Park. I'm fascinated by how technology and the human body function—two seemingly different worlds I’ve chosen to explore together.",
      category: "Profile",
      color: "#60a5fa",
      modelJSX: (
        <GraduationHat
          scale={[2.0, 2.0, 2.0]}
          rotation={[Math.PI / 12, Math.PI / 20, 0]}
        />
      ),
      skills: ["Computer Science", "Neuroscience", "Curiosity", "Learning"],
    },
    {
      title: "DUAL STUDY",
      subtitle: "Computer Science × Neuroscience",
      content:
        "My dual interests in tech and biology led me to pursue both CS and Neuroscience. I aim to study each field deeply, while exploring how they intersect in areas like brain-computer interfaces and intelligent systems.",
      category: "Specialty",
      color: "#a78bfa",
      modelJSX: (
        <BrainComp
          scale={[2.0, 2.0, 2.0]}
          rotation={[Math.PI / 16, -Math.PI / 2, 0]}
        />
      ),
      skills: [
        "Interdisciplinary Thinking",
        "Systems Understanding",
        "Brain-Computer Interface",
        "Analytical Skills",
      ],
    },
    {
      title: "ADVENTURE LOG",
      subtitle: "Beyond the Lab",
      content:
        "Outside of academics, I enjoy soccer, volleyball, reading, gaming, and especially escape rooms and puzzles. I usually spend hours every day reading and challenging myself with brain-teasing fun.",
      category: "Hobbies",
      color: "#34d399",
      modelJSX: (
        <Hobbies
          scale={[2.8, 2.8, 2.8]}
          position={[0, -0.3, 3]}
          rotation={[Math.PI / 16, 0, 0]}
        />
      ),
      skills: ["Soccer", "Volleyball", "Reading", "Gaming", "Puzzle Solving"],
    },
    {
      title: "FUTURE PATHS",
      subtitle: "Exploring Projects & Careers",
      content:
        "I'm actively exploring new projects, job opportunities, and career directions that align with my values and ambitions. This phase is about learning, experimenting, and building toward a future where I can create meaningful impact through technology and design.",
      category: "Exploration",
      color: "#fb923c",
      modelJSX: (
        <Compass scale={[1, 1, 1]} rotation={[Math.PI / 8, -Math.PI / 8, 0]} />
      ),
      skills: [],
    },

    {
      title: "FINAL",
      subtitle: "Explore More",
      content:
        "Thanks for visiting my e-portfolio! Feel free to explore my projects or get in touch to connect.",
      category: "Future",
      color: "#fbbf24",
      modelJSX: <Pokeball1 scale={[0.1, 0.1, 0.1]} />,
      skills: [],
    },
  ];

  // Game-like controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          if (currentSection < sections.length - 1) {
            setCurrentSection((prev) => prev + 1);
          }
          break;
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          if (currentSection > 0) {
            setCurrentSection((prev) => prev - 1);
          }
          break;
        case " ":
          e.preventDefault();
          if (currentSection < sections.length - 1) {
            setCurrentSection((prev) => prev + 1);
          }
          break;
        default:
          break;
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();

      const now = Date.now();
      if (now - (handleWheel.lastCall || 0) < 1000) return;
      handleWheel.lastCall = now;

      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        setCurrentSection((prev) => prev + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        setCurrentSection((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentSection, sections.length]);

  return (
    <div
      className="min-h-screen text-white overflow-hidden font-mono relative"
      style={{
        background:
          "radial-gradient(ellipse at bottom, #0f1419 0%, #020617 100%)",
      }}
    >
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
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

      {/* UI Components */}
      <PokemonHUD
        currentSection={currentSection}
        totalSections={sections.length}
        onSectionChange={setCurrentSection}
      />
      <PokemonMenu />

      {/* Main Content */}
      <main className="relative z-10">
        {sections.map((section, index) => (
          <div
            key={section.category}
            className={`fixed inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSection ? "z-20 opacity-100" : "z-10 opacity-0"
            }`}
            style={{
              transform: `translateX(${
                index === currentSection
                  ? "0%"
                  : index < currentSection
                  ? "-100%"
                  : "100%"
              })`,
            }}
          >
            <PokemonSection
              section={section}
              index={index}
              isActive={index === currentSection}
            />
          </div>
        ))}
      </main>

      {/* Final section action buttons */}
      {currentSection === sections.length - 1 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <PokemonFrame variant="yellow">
            <div className="flex gap-6 items-center">
              <span className="text-yellow-300 font-bold">THE END</span>
              <button
                onClick={() => (window.location.href = "/projects")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 border-2 border-blue-400"
              >
                🚀 VIEW PROJECTS
              </button>
              <button
                onClick={() => (window.location.href = "/contact")}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 border-2 border-green-400"
              >
                📞 CONNECT
              </button>
            </div>
          </PokemonFrame>
        </div>
      )}

      {/* Game-style controls hint */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-black/80 text-white px-4 py-2 rounded-lg border border-gray-600 text-sm font-mono">
          <div>Controls: ↑↓ WASD Space Scroll</div>
        </div>
      </div>
    </div>
  );
};

export default About;
