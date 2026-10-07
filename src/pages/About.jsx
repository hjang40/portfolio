import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useProgress } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import Pokeball1 from "../models/Pokeball1";
import BrainDesk from "../models/BrainDesk";
import GraduationHat from "../models/Graduation_Hat";
import Hobbies from "../models/Hobbies";
import Compass from "../models/Compass";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { TextBox, MiniBall } from "../components/gba";
import { INK, PRESS, CHIP } from "../components/projects/theme";
import PixelScene from "../components/PixelScene";

// All Sketchfab models below are CC BY 4.0 and must stay credited on the page.
const credit = (name, author, url) => ({ name, author, url });

const PAGES = [
  {
    title: "TRAINER CARD",
    model: <GraduationHat rotation={[Math.PI / 12, Math.PI / 20, 0]} />,
    credits: [
      credit("Graduation Hat", "DevFaisal", "https://sketchfab.com/3d-models/graduation-hat-b0a7e821403b4c8cb8e1d32ea4075eac"),
    ],
    fields: [
      ["NAME", "Hyun Seo Jang"],
      ["SCHOOL", "University of Maryland, College Park"],
      ["DEGREE", "B.S. Computer Science"],
      ["MINOR", "Neuroscience"],
      ["GRADUATED", "May 2026"],
      ["REGION", "Maryland"],
      ["CERTIFICATIONS", "CITI Social & Behavioral Research (2025)\nLinkedIn Learning: Learning R (2025)"],
    ],
    text: "Hi! I'm Hyun. I graduated from the University of Maryland in May 2026 with a B.S. in Computer Science and a minor in Neuroscience. I've dabbled in web and mobile apps, machine learning, and network security, mostly for classes and on my own time. Since graduating, I've been traveling and exploring.",
  },
  {
    title: "DUAL EDUCATION",
    model: <BrainDesk rotation={[Math.PI / 16, -0.35, 0]} />,
    fit: { size: 3.6 },
    credits: [
      credit("pc desk", "Joele segreto", "https://sketchfab.com/3d-models/pc-desk-852f5b95e3ff4ef9a662c3190a2426ff"),
      credit("Brain in a Jar", "Citron Vert", "https://sketchfab.com/3d-models/brain-in-a-jar-6f6f748d02544a779a999d7cc9b0f6a6"),
    ],
    types: [
      {
        name: "COMPUTER SCIENCE",
        color: "bg-[#6890f0]",
        items: ["Artificial Intelligence", "Machine Learning", "Data Science", "Computer & Network Security", "Algorithms"],
      },
      {
        name: "NEUROSCIENCE",
        color: "bg-[#f85888]",
        items: ["Intro to Neuroscience", "Biological Psychology", "Perception", "Neuroscience Seminar", "Data Science in Psychology & Neuroscience"],
      },
    ],
    text: "I'm most interested in where my two fields meet, like brain-computer interfaces and AI modeled on how the brain works.",
  },
  {
    title: "SKILLS",
    model: <Pokeball1 toon rotation={[0.1, 4.7, 0]} />,
    credits: [
      credit("Realistic Pokéball", "SeppeHauspie", "https://sketchfab.com/3d-models/realistic-pokeball-9eb80f026a8947fda580abd229d4f9c8"),
    ],
    moves: [
      ["LANGUAGES", "Python · TypeScript/JavaScript · Java · C/C++ · Dart · SQL · HTML/CSS"],
      ["FRONTEND & MOBILE", "React · Tailwind CSS · Three.js · Flutter · Android"],
      ["BACKEND & DATA", "Node.js · PostgreSQL · MongoDB · PyTorch · NumPy"],
      ["TOOLS", "Git · GitHub · Linux"],
    ],
    text: "These are the languages, frameworks, and tools I've learned and use the most.",
  },
  {
    title: "HOBBIES",
    model: <Hobbies rotation={[Math.PI / 16, 0, 0]} />,
    // The pile's stray books stretch its bounds; zoom in on the main cluster (edges crop)
    fit: { size: 10, tilt: 0.3 },
    credits: [
      credit("Pile of Books", "M.Reslan", "https://sketchfab.com/3d-models/pile-of-books-468f4357f36c444c807125c7d3f64ed7"),
      credit("Soccer Ball", "FunctionalResearch_3D", "https://sketchfab.com/3d-models/soccer-ball-a51de12e975a425184496fbabc728ca3"),
      credit("Volleyball", "LF-Sketcher", "https://sketchfab.com/3d-models/volleyball-f6d0ef5d9f6f4359b7737fdc04b570b0"),
      credit("Nintendo Switch", "gabriel juan", "https://sketchfab.com/3d-models/nintendo-switch-b94e6a6a8c564fee81c2d794da6c5712"),
      credit("Bamboo Puzzle Prison House", "trinityscsp", "https://sketchfab.com/3d-models/bamboo-puzzle-prison-house-029bc92ed77040938d2018e79b5bc709"),
    ],
    hobbies: ["Soccer", "Volleyball", "Reading", "Gaming", "Puzzles", "Escape rooms", "Board games"],
    text: "I play soccer and volleyball, read a lot, and play video games. I also love escape rooms, puzzles, and board games.",
  },
  {
    title: "FUTURE GOALS",
    model: <Compass rotation={[Math.PI / 8, -Math.PI / 8, 0]} />,
    // The compass sits on a large map; let the map run off the edges so the compass reads
    fit: { size: 7, tilt: Math.PI / 6 },
    credits: [
      credit("compass", "Gnossiennes", "https://sketchfab.com/3d-models/compass-380bd555fe364b03a828d3f5fbf41bfa"),
    ],
    journey: [
      ["Graduated, B.S. Computer Science", "University of Maryland", "May 2026"],
      ["Substitute Teacher", "Montgomery County Public Schools", "2024 – now"],
    ],
    text: "Right now I'm looking for my first software engineering job, somewhere I can keep building apps that people use.",
    final: true,
  },
];

// Scales a model so its largest side is `size`, centers it, tilts it toward the camera
// by `tilt`, and gently sways it.
const ModelSlot = ({ visible, size = 3, tilt = 0, children }) => {
  const sway = useRef();
  const [scale, setScale] = useState(1);

  useFrame(({ clock }) => {
    if (!sway.current) return;
    const t = clock.elapsedTime;
    sway.current.rotation.y = Math.sin(t * 0.6) * 0.35;
    sway.current.position.y = Math.sin(t * 1.2) * 0.08;
  });

  return (
    <group ref={sway} visible={visible}>
      <group scale={scale} rotation={[tilt, 0, 0]}>
        <Center
          onCentered={({ width, height, depth }) =>
            setScale(size / Math.max(width, height, depth))
          }
        >
          {children}
        </Center>
      </group>
    </group>
  );
};

// Small Pokéball spinner over the sprite window while models are still downloading
const ModelLoading = () => {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 font-sans text-[11px] text-[#8a867b]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-black bg-[linear-gradient(to_bottom,#e3350d_0_46%,#111_46%_54%,#f5f5f5_54%)]" />
      {Math.round(progress)}%
    </div>
  );
};

const PageBody = ({ page }) => {
  if (page.fields) {
    return (
      <dl className="grid grid-cols-1 gap-x-4 text-xs sm:grid-cols-[auto_1fr] sm:gap-y-2 sm:text-sm">
        {page.fields.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-[10px] text-[#8a867b] sm:text-sm">{label}</dt>
            <dd className="mb-3 mt-0.5 whitespace-pre-line sm:m-0">{value}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (page.types) {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {page.types.map((type) => (
          <div key={type.name}>
            <span className={`mb-2 inline-block rounded-full ${type.color} px-3 py-1 text-xs text-white shadow-[0_6px_14px_-8px_rgba(0,0,0,0.5)]`}>
              {type.name}
            </span>
            <ul className="space-y-1 text-[11px] text-[#3a3934] sm:text-xs">
              {type.items.map((item) => <li key={item}>▸ {item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  if (page.moves) {
    return (
      <ul className="grid gap-2">
        {page.moves.map(([name, list]) => (
          <li key={name} className="rounded-xl border border-[#e2dccd] bg-[#fbf8f1] px-3 py-2.5 shadow-[0_6px_16px_-12px_rgba(40,36,24,0.4)]">
            <p className="mb-0.5 text-xs text-[#8a867b]">{name}</p>
            <p className="text-[11px] leading-relaxed sm:text-xs">{list}</p>
          </li>
        ))}
      </ul>
    );
  }
  if (page.hobbies) {
    return (
      <ul className="flex flex-wrap gap-2">
        {page.hobbies.map((hobby) => (
          <li key={hobby} className={`px-3 py-1 text-xs ${CHIP}`}>
            {hobby}
          </li>
        ))}
      </ul>
    );
  }
  if (page.journey) {
    return (
      <ol className="space-y-3 border-l-2 border-[#e3350d]/50 pl-4">
        {page.journey.map(([role, org, when]) => (
          <li key={role}>
            <p className="text-xs">{role}</p>
            <p className="font-sans text-xs text-[#8a867b]">{org} · {when}</p>
          </li>
        ))}
      </ol>
    );
  }
  return null;
};

const NAV_ARROW = `grid h-8 w-8 place-items-center rounded-full border border-[#e2dccd] bg-[#fbf8f1] text-[#55534c] hover:border-[#18181b] hover:text-[#18181b] disabled:pointer-events-none disabled:opacity-35 ${PRESS}`;

const About = () => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  // White overlay: starts opaque (matching the intro's fade-out), fades in, and fades out before leaving
  const [whiteOut, setWhiteOut] = useState(true);
  const scrollRef = useRef(null);
  const swipeStart = useRef(null);
  const lastWheel = useRef(0);
  const page = PAGES[pageIndex];

  useEffect(() => {
    const id = requestAnimationFrame(() => setWhiteOut(false));
    return () => cancelAnimationFrame(id);
  }, []);

  const goTo = (index) => {
    if (index < 0 || index >= PAGES.length || index === pageIndex) return;
    setDirection(index > pageIndex ? 1 : -1);
    setPageIndex(index);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const leaveTo = (path) => {
    setWhiteOut(true);
    setTimeout(() => navigate(path), 500);
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (["ArrowRight", "d", "D"].includes(event.key)) goTo(pageIndex + 1);
      if (["ArrowLeft", "a", "A"].includes(event.key)) goTo(pageIndex - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // Horizontal swipe turns the page; vertical movement is left to native scrolling
  const handlePointerDown = (event) => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };
  const handlePointerUp = (event) => {
    if (!swipeStart.current) return;
    const dx = event.clientX - swipeStart.current.x;
    const dy = event.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      goTo(pageIndex + (dx < 0 ? 1 : -1));
    }
  };

  // The wheel turns the page only once the card can't scroll any further that way
  const handleWheel = (event) => {
    const el = scrollRef.current;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const canScroll = delta > 0
      ? el.scrollTop + el.clientHeight < el.scrollHeight - 1
      : el.scrollTop > 0;
    if (canScroll || Math.abs(delta) < 20) return;
    const now = Date.now();
    if (now - lastWheel.current < 700) return;
    lastWheel.current = now;
    goTo(pageIndex + (delta > 0 ? 1 : -1));
  };

  return (
    <main
      className="relative min-h-dvh overflow-hidden font-pokemon flex items-center justify-center p-3 pt-16 sm:p-6 sm:pt-16"
      style={{ color: INK }}
    >
      {/* Pixel-art Route 1 behind the card (inspired by full-bleed pixel landscapes like Cofounder's) */}
      <PixelScene />

      <div
        className="relative w-full max-w-5xl"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex max-h-[calc(100dvh-4.75rem)] flex-col overflow-hidden rounded-2xl border border-[#1d3b2a]/15 bg-[#fbf8f1] shadow-[0_2px_0_rgba(29,59,42,0.12),0_30px_70px_-24px_rgba(20,50,30,0.55)] sm:max-h-[calc(100dvh-5.5rem)]">
          {/* Window bar */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b sm:grid sm:grid-cols-[1fr_auto_1fr] border-[#e2dccd] px-3 py-2 sm:px-4">
            <span aria-hidden className="hidden gap-1.5 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </span>
            <h1 className="flex min-w-0 items-center gap-2 whitespace-nowrap text-[10px] min-[360px]:text-[11px] sm:text-sm">
              <MiniBall className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {page.title}
            </h1>
            <div className="flex items-center justify-end gap-2 sm:gap-3">
              <span className="hidden whitespace-nowrap font-sans text-[11px] tabular-nums text-[#8a867b] min-[360px]:inline">
                {pageIndex + 1}/{PAGES.length}
              </span>
              <button
                onClick={() => leaveTo("/")}
                className={`whitespace-nowrap rounded-full bg-[#18181b] px-3 py-1 text-[10px] text-white hover:bg-[#2b2b30] sm:text-xs ${PRESS}`}
              >
                ← EXIT
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
              {/* Sprite window: one shared canvas, only the current page's model is visible */}
              <div className="relative order-first h-56 overflow-hidden rounded-xl border border-[#e2dccd] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_24px_-14px_rgba(40,36,24,0.35)] sm:h-72 md:order-last md:h-80">
                {/* Soft light behind the transparent canvas */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(circle at 50% 38%, #fffaf1 0%, #f3ead8 60%, #e9dfca 100%)" }}
                />
                <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[4, 5, 5]} intensity={1.6} />
                  {/* One Suspense per model so the current page's model shows as soon as it loads */}
                  {PAGES.map((p, i) => (
                    <Suspense key={p.title} fallback={null}>
                      <ModelSlot visible={i === pageIndex} {...p.fit}>
                        {p.model}
                      </ModelSlot>
                    </Suspense>
                  ))}
                </Canvas>
                <ModelLoading />
              </div>

              <div
                key={pageIndex}
                className={direction > 0
                  ? "animate-[slide-in-from-right_300ms_ease-out]"
                  : "animate-[slide-in-from-left_300ms_ease-out]"}
              >
                <PageBody page={page} />
              </div>
            </div>

            {/* FireRed-style text box */}
            <TextBox key={`text-${pageIndex}`} className="mt-5 animate-[slide-in-from-right_300ms_ease-out]">
              {page.text}
            </TextBox>

            {page.final && (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => leaveTo("/projects")}
                  className={`rounded-full bg-[#18181b] px-5 py-2.5 text-xs text-white shadow-[0_10px_24px_-10px_rgba(24,24,27,0.6)] hover:bg-[#2b2b30] ${PRESS}`}
                >
                  VIEW PROJECTS
                </button>
                <button
                  onClick={() => leaveTo("/contact")}
                  className={`rounded-full border border-[#18181b] px-5 py-2.5 text-xs text-[#18181b] hover:bg-[#18181b] hover:text-white ${PRESS}`}
                >
                  CONTACT ME
                </button>
              </div>
            )}

            <p className="mt-5 font-sans text-[10px] text-[#8a867b]">
              3D:{" "}
              {page.credits.map((c, i) => (
                <span key={c.url}>
                  {i > 0 && ", "}
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#18181b]">
                    {c.name}
                  </a>{" "}
                  by {c.author}
                </span>
              ))}{" "}
              (
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#18181b]">
                CC BY 4.0
              </a>
              )
            </p>
          </div>

          {/* Page navigation */}
          <nav className="flex shrink-0 items-center justify-center gap-3 border-t border-[#e2dccd] bg-[#f6f1e5]/70 px-4 py-2" aria-label="Trainer card pages">
            <button
              onClick={() => goTo(pageIndex - 1)}
              disabled={pageIndex === 0}
              aria-label="Previous page"
              className={NAV_ARROW}
            >
              <FaCaretLeft aria-hidden />
            </button>
            {PAGES.map((p, i) => (
              <button
                key={p.title}
                onClick={() => goTo(i)}
                aria-label={`Go to ${p.title}`}
                aria-current={i === pageIndex ? "page" : undefined}
                className="flex"
              >
                <MiniBall
                  empty={i !== pageIndex}
                  className={`transition-transform ${i === pageIndex ? "h-5 w-5" : "h-4 w-4 hover:scale-110"}`}
                />
              </button>
            ))}
            <button
              onClick={() => goTo(pageIndex + 1)}
              disabled={pageIndex === PAGES.length - 1}
              aria-label="Next page"
              className={NAV_ARROW}
            >
              <FaCaretRight aria-hidden />
            </button>
          </nav>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-500 ${whiteOut ? "opacity-100" : "opacity-0"}`}
      />
    </main>
  );
};

export default About;
