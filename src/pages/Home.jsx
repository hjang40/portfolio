import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import PokeballSelector from "../components/PokeballSelector";
import CameraFlyIn from "../components/CameraFlyIn";
import CameraIntro from "../components/CameraIntro";
import PlayersRoom from "../components/PlayersRoom";
import DialogueBox from "../components/DialogueBox";

// In PlayersRoom units: floor is y = 0, desk top is y = 0.76, and the free half of
// the desk (the computer takes the other half) is centered at x = -3.44, z = -2.5.
const DESK_SPOT = [-3.44, 0.76, -2.5];
const BALL_SCALE = 0.0075; // model is ~20 units wide, so ~0.15 wide here
const CAROUSEL_RADIUS = 0.3;
const CAROUSEL_POSITION = [DESK_SPOT[0], DESK_SPOT[1] + BALL_SCALE * 10, DESK_SPOT[2]];

// Module-level so the intro effect never restarts on re-render.
// Starts on a high, GBA-style view of the room, then zooms in on the desk.
const INTRO = {
  startPosition: [0.5, 7, 5.5],
  endPosition: [DESK_SPOT[0], 1.15, -1.6],
  startRotation: [-0.95, 0, 0],
  endRotation: [-0.35, 0, 0],
};

const INTRO_LINES = [
  "Hi! I'm Hyun. Welcome to my room... and my portfolio!",
  "Each Pokéball on this desk holds a part of my story.",
  "Use ← → or drag to spin them, then press Enter or click the front one to choose!",
];

const DESTINATIONS = [
  { name: "ABOUT", path: "/about" },
  { name: "PROJECTS", path: "/projects" },
  { name: "CONTACT", path: "/contact" },
];

// Lives for the whole visit (resets on reload), so coming back to Home skips the intro.
let introPlayed = false;

// Narrow (portrait) screens get a taller field of view so all three balls stay in frame.
const getFov = () => {
  const aspect = window.innerWidth / window.innerHeight;
  const halfFov = Math.atan(Math.max(Math.tan((37.5 * Math.PI) / 180), 0.5 / aspect));
  return Math.min((2 * halfFov * 180) / Math.PI, 100);
};

// Eases the white overlay's opacity from `from` to `to`, then calls onDone.
const runFade = (setOpacity, { from, to, delay = 0, duration }, onDone) => {
  let start = null;
  const step = (timestamp) => {
    start ??= timestamp;
    const elapsed = timestamp - start - delay;
    if (elapsed < 0) return requestAnimationFrame(step);
    const progress = Math.min(elapsed / duration, 1);
    const ease =
      progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    setOpacity(from + (to - from) * ease);
    if (progress < 1) requestAnimationFrame(step);
    else onDone?.();
  };
  requestAnimationFrame(step);
};

const LoadingScreen = () => {
  const { progress } = useProgress();
  const loaded = progress >= 100;
  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#101018] text-white transition-opacity duration-500 ${
        loaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={loaded}
    >
      <div className="w-14 h-14 rounded-full border-4 border-black bg-[linear-gradient(to_bottom,#e3350d_0_46%,#111_46%_54%,#f5f5f5_54%)] animate-spin" />
      <p className="text-sm">Loading... {Math.round(progress)}%</p>
    </div>
  );
};

const Home = () => {
  const [skipIntro] = useState(() => introPlayed);
  const [fov] = useState(getFov);
  const [flyTarget, setFlyTarget] = useState(null);
  // Returning visitors arrive on a white screen that fades in (mirrors the fade out)
  const [fadeOpacity, setFadeOpacity] = useState(skipIntro ? 1 : 0);
  const [lineIndex, setLineIndex] = useState(skipIntro ? INTRO_LINES.length : 0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [introComplete, setIntroComplete] = useState(skipIntro);
  const [chosen, setChosen] = useState(false);
  const chosenRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (skipIntro) runFade(setFadeOpacity, { from: 1, to: 0, duration: 800 });
  }, [skipIntro]);

  const handleIntroComplete = useCallback(() => {
    introPlayed = true;
    setIntroComplete(true);
  }, []);

  const dialogueDone = lineIndex >= INTRO_LINES.length;
  const destination = DESTINATIONS[selectedIndex];

  const handlePokeballClick = (pos, index) => {
    // Ignore repeat clicks/keys once a ball is chosen (the ref updates synchronously)
    if (chosenRef.current) return;
    chosenRef.current = true;
    setChosen(true);
    setFlyTarget(pos);
    runFade(setFadeOpacity, { from: 0, to: 1, delay: 1500, duration: 3000 }, () =>
      navigate(DESTINATIONS[index].path)
    );
  };

  let dialogue = null;
  if (introComplete) {
    if (!dialogueDone) {
      dialogue = (
        <DialogueBox
          key={lineIndex}
          text={INTRO_LINES[lineIndex]}
          onAdvance={() => setLineIndex((i) => i + 1)}
        />
      );
    } else {
      const text = chosen
        ? `${destination.name} Pokéball, I choose you!`
        : `So, you want the ${destination.name} Pokéball?`;
      dialogue = <DialogueBox key={text} text={text} />;
    }
  }

  return (
    <section className="w-full h-screen relative font-pokemon bg-[#101018]">
      <Canvas
        className="w-full h-screen bg-transparent"
        camera={{
          fov,
          position: skipIntro ? INTRO.endPosition : INTRO.startPosition,
          rotation: skipIntro ? INTRO.endRotation : INTRO.startRotation,
          near: 0.001,
          far: 20000,
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#101018"]} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[-2, 4, 2]} intensity={2} />
          <PlayersRoom />

          {!introComplete && (
            <CameraIntro
              {...INTRO}
              duration={3}
              onComplete={handleIntroComplete}
            />
          )}

          {flyTarget && (
            <CameraFlyIn
              target={flyTarget}
              duration={3}
              delay={1.5}
              offset={0.15}
              onFinish={() => setFlyTarget(null)}
            />
          )}

          <PokeballSelector
            scale={[BALL_SCALE, BALL_SCALE, BALL_SCALE]}
            basePosition={CAROUSEL_POSITION}
            rotation={[0.1, 4.7, 0]}
            radius={CAROUSEL_RADIUS}
            toon
            locked={chosen}
            canChoose={introComplete && dialogueDone}
            onPokeballClick={handlePokeballClick}
            onSelectionChange={setSelectedIndex}
          />
        </Suspense>
      </Canvas>

      <LoadingScreen />

      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{ opacity: fadeOpacity }}
      />

      {dialogue}

      {/* Required by the room model's CC-BY-4.0 license */}
      <p className="absolute bottom-2 right-3 text-[10px] text-white/60 font-sans">
        Room:{" "}
        <a
          href="https://sketchfab.com/3d-models/pokemon-firered-players-room-b23b6b253207463c97db2a7092adff74"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          "Pokemon FireRed - Player's Room"
        </a>{" "}
        by Wesai,{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          CC BY 4.0
        </a>
      </p>
    </section>
  );
};

export default Home;
