import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useProgress } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import Pokeball1 from "../models/Pokeball1";
import BrainDesk from "../models/BrainDesk";
import GraduationHat from "../models/Graduation_Hat";
import Hobbies from "../models/Hobbies";
import Compass from "../models/Compass";
import textBg from "../assets/images/text.png";

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
        name: "CODE",
        color: "bg-[#6890f0]",
        items: ["Artificial Intelligence", "Machine Learning", "Data Science", "Computer & Network Security", "Algorithms"],
      },
      {
        name: "BRAIN",
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
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-[10px] text-[#484878]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-black bg-[linear-gradient(to_bottom,#e3350d_0_46%,#111_46%_54%,#f5f5f5_54%)]" />
      {Math.round(progress)}%
    </div>
  );
};

// Colors from the intro's FireRed room: the checkered desk top and the cream wall
const DESK_CHECKER = "repeating-conic-gradient(#e8dc9c 0% 25%, #d8c87c 0% 50%)";
const WALL = "#f4ecd8";

const Frame = ({ children, className = "" }) => (
  <div className={`rounded-md border-4 border-[#484878] bg-[#f8f8f0] shadow-[inset_0_0_0_2px_#c8c8e0] ${className}`}>
    {children}
  </div>
);

// Tiny CSS Pokéball: red top, black band, white bottom. `empty` draws a grey one.
const MiniBall = ({ empty = false, className = "" }) => (
  <span
    aria-hidden
    className={`inline-block rounded-full border-2 border-[#202030] ${className}`}
    style={{
      background: empty
        ? "linear-gradient(to bottom, #c8c8d0 0 44%, #202030 44% 56%, #e8e8f0 56%)"
        : "linear-gradient(to bottom, #e3350d 0 44%, #202030 44% 56%, #f8f8f8 56%)",
    }}
  />
);

const PageBody = ({ page }) => {
  if (page.fields) {
    return (
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs sm:text-sm">
        {page.fields.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-[#484878]">{label}</dt>
            <dd className="text-black">{value}</dd>
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
            <span className={`inline-block ${type.color} text-white text-xs px-3 py-1 rounded border-2 border-black/30 mb-2`}>
              {type.name}
            </span>
            <ul className="text-[11px] sm:text-xs space-y-1 text-black">
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
          <li key={name} className="rounded border-2 border-[#484878] bg-white px-3 py-2">
            <p className="text-xs text-[#484878]">{name}</p>
            <p className="text-[11px] sm:text-xs text-black leading-relaxed">{list}</p>
          </li>
        ))}
      </ul>
    );
  }
  if (page.hobbies) {
    return (
      <ul className="flex flex-wrap gap-2">
        {page.hobbies.map((hobby) => (
          <li key={hobby} className="rounded-full border-2 border-[#484878] bg-white px-3 py-1 text-xs text-black">
            {hobby}
          </li>
        ))}
      </ul>
    );
  }
  if (page.journey) {
    return (
      <ol className="space-y-2 border-l-4 border-[#484878] pl-4">
        {page.journey.map(([role, org, when]) => (
          <li key={role} className="text-black">
            <p className="text-xs">{role}</p>
            <p className="text-[11px] text-[#484878]">{org} · {when}</p>
          </li>
        ))}
      </ol>
    );
  }
  return null;
};

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
    <div
      className="min-h-dvh font-pokemon flex items-center justify-center p-3 pt-16 sm:p-6 sm:pt-16"
      style={{ background: `${DESK_CHECKER} 0 0 / 48px 48px` }}
    >
      <div
        className="w-full max-w-5xl"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        style={{ touchAction: "pan-y" }}
      >
        <Frame className="flex max-h-[calc(100dvh-4.75rem)] flex-col overflow-hidden shadow-[6px_6px_0_rgba(16,16,24,0.35),inset_0_0_0_2px_#c8c8e0] sm:max-h-[calc(100dvh-5.5rem)]">
          {/* Header */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b-4 border-[#e3350d] bg-[#484878] px-4 py-2 text-white">
            <h1 className="flex items-center gap-2 text-xs sm:text-lg sm:tracking-wide whitespace-nowrap">
              <MiniBall className="h-4 w-4 sm:h-5 sm:w-5" />
              {page.title}
            </h1>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs whitespace-nowrap">{pageIndex + 1}/{PAGES.length}</span>
              <button
                onClick={() => leaveTo("/")}
                className="rounded bg-[#e3350d] px-3 py-1 text-xs whitespace-nowrap hover:brightness-110"
              >
                ← EXIT
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
              {/* Sprite window: one shared canvas, only the current page's model is visible */}
              <Frame className="relative order-first md:order-last h-56 sm:h-72 md:h-80 overflow-hidden">
                {/* Solid cream backdrop (the intro room's wall color) behind the transparent canvas */}
                <div aria-hidden className="absolute inset-0" style={{ background: WALL }} />
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
              </Frame>

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
            <div
              key={`text-${pageIndex}`}
              className="mt-4 bg-white px-4 py-3 sm:px-6 text-xs sm:text-sm leading-relaxed text-black animate-[slide-in-from-right_300ms_ease-out]"
              // border-image keeps the FireRed frame a fixed thickness however tall the text gets
              // (a stretched background made the frame thicker and crowd long text)
              style={{
                borderStyle: "solid",
                borderWidth: "10px",
                borderImage: `url(${textBg}) 30 fill / 10px stretch`,
                imageRendering: "pixelated",
              }}
            >
              {page.text}
            </div>

            {page.final && (
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button onClick={() => leaveTo("/projects")} className="rounded border-4 border-[#484878] bg-[#6890f0] px-4 py-2 text-xs text-white hover:brightness-110">
                  VIEW PROJECTS
                </button>
                <button onClick={() => leaveTo("/contact")} className="rounded border-4 border-[#484878] bg-[#78c850] px-4 py-2 text-xs text-white hover:brightness-110">
                  CONTACT ME
                </button>
              </div>
            )}

            <p className="mt-4 font-sans text-[10px] text-[#484878]/80">
              3D:{" "}
              {page.credits.map((c, i) => (
                <span key={c.url}>
                  {i > 0 && ", "}
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {c.name}
                  </a>{" "}
                  by {c.author}
                </span>
              ))}{" "}
              (
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline">
                CC BY 4.0
              </a>
              )
            </p>
          </div>

          {/* Page navigation */}
          <nav className="flex shrink-0 items-center justify-center gap-3 border-t-4 border-[#484878] bg-[#e0e0f0] px-4 py-2" aria-label="Trainer card pages">
            <button
              onClick={() => goTo(pageIndex - 1)}
              disabled={pageIndex === 0}
              aria-label="Previous page"
              className="text-[#484878] text-lg disabled:opacity-30"
            >
              ◀
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
              className="text-[#484878] text-lg disabled:opacity-30"
            >
              ▶
            </button>
          </nav>
        </Frame>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-500 ${whiteOut ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

export default About;
