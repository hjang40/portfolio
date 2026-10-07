import { useState, useEffect, useRef } from "react";
import { FaFilePdf, FaExternalLinkAlt, FaCaretLeft, FaCaretRight, FaTimes } from "react-icons/fa";
import { MiniBall, WALL, TextBox } from "../gba";
import { PANEL, CHIP, PRESS } from "./theme";
import { isPdf, isVideo } from "./projectData";

const Media = ({ src, name, onZoom }) => {
  if (isVideo(src)) {
    return <video src={src} controls preload="metadata" playsInline className="h-full w-full bg-black object-contain" />;
  }
  if (isPdf(src)) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full w-full flex-col items-center justify-center gap-3 text-[#55534c] hover:text-[#e3350d]"
      >
        <FaFilePdf size={48} className="text-[#e3350d]" />
        <span className="flex items-center gap-2 text-xs">
          OPEN PDF <FaExternalLinkAlt size={10} />
        </span>
      </a>
    );
  }
  return (
    <button onClick={onZoom} aria-label="Enlarge image" className="h-full w-full cursor-zoom-in">
      <img src={src} alt={name} draggable={false} className="h-full w-full object-contain" />
    </button>
  );
};

// Pokédex entry for one project: media viewer, data table, and the description in a FireRed text box.
// Mount with key={project.id} so the media index resets per project.
const Pokedex = ({ project, number, onClose }) => {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef(null);
  const swipeStart = useRef(null);
  const media = project.images;
  const current = media[mediaIndex];

  const step = (delta) => setMediaIndex((i) => (i + delta + media.length) % media.length);

  useEffect(() => closeRef.current?.focus(), []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") zoomed ? setZoomed(false) : onClose();
      if (media.length > 1 && event.key === "ArrowRight") step(1);
      if (media.length > 1 && event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // Horizontal swipe on the media flips through it
  const handlePointerUp = (event) => {
    if (!swipeStart.current || media.length < 2) return;
    const dx = event.clientX - swipeStart.current.x;
    const dy = event.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center bg-[#2a2519]/45 p-3 font-pokemon text-[#18181b] backdrop-blur-sm"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="pokedex-title" className="w-full max-w-4xl">
        <div className={`flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden shadow-[0_40px_80px_-30px_rgba(40,36,24,0.55)] ${PANEL}`}>
          <div className="flex shrink-0 items-center gap-3 bg-[#e3350d] px-4 py-2.5 text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]">
            <MiniBall className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            <h2 id="pokedex-title" className="min-w-0 flex-1 text-xs leading-relaxed sm:text-base">
              <span className="mr-2 opacity-80">No.{String(number).padStart(3, "0")}</span>
              {project.name}
            </h2>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black/20 text-xs hover:bg-black/35 focus-visible:outline-white ${PRESS}`}
            >
              <FaTimes aria-hidden className="text-sm" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-[#e2dccd] shadow-[0_10px_24px_-14px_rgba(40,36,24,0.4)]">
                  <div
                    className="h-full w-full"
                    style={{ background: WALL, touchAction: "pan-y" }}
                    onPointerDown={(event) => (swipeStart.current = { x: event.clientX, y: event.clientY })}
                    onPointerUp={handlePointerUp}
                  >
                    <Media key={current} src={current} name={project.name} onZoom={() => setZoomed(true)} />
                  </div>
                  {/* Centered with -mt-4, not -translate-y-1/2: PRESS's active:translate-y-px would replace the
                      translate on mousedown, jump the button out from under the cursor, and drop the click */}
                  {media.length > 1 && (
                    <>
                      <button
                        onClick={() => step(-1)}
                        aria-label="Previous media"
                        className={`absolute left-2 top-1/2 -mt-4 grid h-8 w-8 place-items-center rounded-full border border-[#e2dccd] bg-[#fbf8f1]/90 text-[10px] text-[#18181b] shadow-sm hover:bg-[#fbf8f1] ${PRESS}`}
                      >
                        <FaCaretLeft aria-hidden className="text-base" />
                      </button>
                      <button
                        onClick={() => step(1)}
                        aria-label="Next media"
                        className={`absolute right-2 top-1/2 -mt-4 grid h-8 w-8 place-items-center rounded-full border border-[#e2dccd] bg-[#fbf8f1]/90 text-[10px] text-[#18181b] shadow-sm hover:bg-[#fbf8f1] ${PRESS}`}
                      >
                        <FaCaretRight aria-hidden className="text-base" />
                      </button>
                    </>
                  )}
                </div>
                {media.length > 1 && (
                  <div className="mt-2 flex justify-center gap-2">
                    {media.map((src, i) => (
                      <button key={src} onClick={() => setMediaIndex(i)} aria-label={`Show media ${i + 1}`} className="flex">
                        <MiniBall empty={i !== mediaIndex} className={i === mediaIndex ? "h-4 w-4" : "h-3 w-3"} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <dl className="grid grid-cols-[auto_1fr] overflow-hidden rounded-xl border border-[#e2dccd] text-[11px] shadow-[0_10px_24px_-16px_rgba(40,36,24,0.35)] sm:text-xs">
                  {[
                    ["TIME", project.timeFrame],
                    ["TYPE", [].concat(project.category).join(" · ")],
                    ["STATUS", project.status],
                  ].map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="border-b border-white/10 bg-[#484878] px-3 py-2.5 text-white">{label}</dt>
                      <dd className="border-b border-[#e2dccd] bg-[#fbf8f1] px-3 py-2.5">{value.toUpperCase()}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="flex flex-wrap gap-2" aria-label="Skills">
                  {project.skills.map((skill) => (
                    <li key={skill} className={`px-3 py-1 text-xs ${CHIP}`}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <TextBox className="mt-4">
              {project.description}
            </TextBox>

            {project.link && (
              <div className="mt-4 flex justify-center">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 rounded-full bg-[#6890f0] px-6 py-3 text-xs text-white shadow-[0_10px_24px_-10px_rgba(72,100,200,0.7)] hover:brightness-110 ${PRESS}`}
                >
                  VIEW PROJECT <FaExternalLinkAlt size={10} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-10001 flex cursor-zoom-out items-center justify-center bg-[#101018]/90 p-4"
          onClick={() => setZoomed(false)}
        >
          <img src={current} alt={project.name} className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
};

export default Pokedex;
