import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilePdf, FaFilter, FaThLarge, FaGlobe, FaBrain, FaMobileAlt, FaFlask, FaFolder, FaUndoAlt, FaCaretLeft, FaCaretRight, FaGamepad, FaCode, FaGraduationCap, FaShieldAlt, FaChevronRight, FaChevronLeft,
} from "react-icons/fa";
import Pokedex from "../components/projects/Pokedex";
import { projectData, isPdf, isVideo } from "../components/projects/projectData";
import { MiniBall } from "../components/gba";
import nSprite from "../assets/images/n-overworld.png";
import nHands from "../assets/images/n-overworld-hands.png";
import { ACCENT, INK, PRESS, PANEL, CHIP, PAGE_BG, DOTS } from "../components/projects/theme";

const SLOTS = 30; // a PC box is 6 across, 5 down

// A project's category is a string or a list of them (class projects are also "School")
const categoriesOf = (p) => [].concat(p.category);
const CATEGORIES = ["All", ...new Set(projectData.flatMap(categoriesOf))];
const CATEGORY_ICONS = {
  All: [FaThLarge, "ALL"],
  "Web Application": [FaGlobe, "WEB"],
  "Machine Learning": [FaBrain, "ML"],
  "Mobile Application": [FaMobileAlt, "MOBILE"],
  "Research Project": [FaFlask, "RESEARCH"],
  "Game Development": [FaGamepad, "GAME"],
  "Programming Languages": [FaCode, "LANGS"],
  School: [FaGraduationCap, "SCHOOL"],
  Security: [FaShieldAlt, "SECURITY"],
};

// FRLG "Forest" box wallpaper: flat grass with staggered light/dark tufts (pixel art as an SVG tile)
const TUFT = [[3, 0, 2, 1], [2, 1, 4, 2], [0, 2, 2, 1], [8, 2, 2, 1], [1, 3, 3, 2], [6, 3, 3, 2]];
const tuft = (x, y, fill) =>
  TUFT.map(([tx, ty, w, h]) => `<rect x='${x + tx}' y='${y + ty}' width='${w}' height='${h}' fill='${fill}'/>`).join("");
const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const GRASS = `${svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='34' height='30' shape-rendering='crispEdges'>${tuft(3, 3, "#b0e078")}${tuft(20, 3, "#80b048")}${tuft(3, 18, "#80b048")}${tuft(20, 18, "#b0e078")}</svg>`
)} 0 0 / 68px 60px, #98c860`;
// Header strip: sky between two tree canopies, with a trunk on the right
const FOREST = `${svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 16' preserveAspectRatio='none'>
    <defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#c8e8f8'/><stop offset='1' stop-color='#78b0f0'/></linearGradient></defs>
    <rect width='100' height='16' fill='url(#s)'/>
    <path d='M78 16 L84 2 L90 2 L86 16 Z' fill='#c89848'/><path d='M84 16 L88 6 L90 6 L88 16 Z' fill='#a07030'/>
    <path d='M8 16 L11 9 L14 9 L13 16 Z' fill='#c89848'/>
    <path d='M0 0 H38 Q36 6 30 7 Q26 12 18 10 Q12 13 6 10 Q2 12 0 11 Z' fill='#58a848'/>
    <path d='M0 0 H32 Q30 4 24 5 Q18 8 10 6 Q4 8 0 6 Z' fill='#78d068'/>
    <path d='M58 0 H100 V9 Q96 12 90 9 Q84 13 76 10 Q68 12 64 7 Q59 5 58 0 Z' fill='#58a848'/>
    <path d='M64 0 H100 V5 Q94 8 86 5 Q78 8 72 5 Q66 4 64 0 Z' fill='#78d068'/>
  </svg>`
)} center / 100% 100% no-repeat`;
const ARROW = `grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#e2dccd] bg-[#f6f1e5] text-[10px] text-[#55534c] hover:border-[#18181b] hover:text-[#18181b] disabled:pointer-events-none disabled:opacity-35 lg:h-8 lg:w-8 ${PRESS}`;
const OUTLINE = "1px 1px 0 #303050, -1px -1px 0 #303050, 1px -1px 0 #303050, -1px 1px 0 #303050";

const inCategory = (category) =>
  category === "All" ? projectData : projectData.filter((p) => categoriesOf(p).includes(category));
const withSkill = (skill) => projectData.filter((p) => p.skills.includes(skill));

// Skills across the given projects, most used first
const topSkills = (projects) => {
  const counts = {};
  projects.flatMap((p) => p.skills).forEach((s) => (counts[s] = (counts[s] ?? 0) + 1));
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};
const ALL_SKILLS = topSkills(projectData).map(([skill]) => skill);

const Thumbnail = ({ src }) => {
  if (isPdf(src)) return <FaFilePdf className="h-1/2 w-1/2" style={{ color: ACCENT }} />;
  if (isVideo(src)) return <MiniBall className="h-1/3 w-1/3" />;
  return <img src={src} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" />;
};

const Panel = ({ label, children, className = "" }) => (
  <section aria-label={label} className={`${PANEL} ${className}`}>
    {children}
  </section>
);

const PanelLabel = ({ children }) => (
  <p className="flex items-center gap-2 text-[10px] text-[#8a867b] lg:text-xs">
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
    {children}
  </p>
);

const Projects = () => {
  const navigate = useNavigate();
  // The box shows one filter at a time: a category or a skill
  const [filter, setFilter] = useState({ type: "category", value: "All" });
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(null);
  // Funnel menu: closed (null), the Category/Skill choice ("root"), or one of their lists
  const [menu, setMenu] = useState(null);
  const filterOpen = menu !== null;
  const category = filter.type === "category" ? filter.value : null;
  const filterRef = useRef(null);
  // White overlay: starts opaque (matching the intro's fade-out), fades in, and fades out before leaving
  const [whiteOut, setWhiteOut] = useState(true);
  const projects = category ? inCategory(category) : withSkill(filter.value);
  const skills = topSkills(projects);
  // Projects fill boxes of 30 like Bill's PC; ◀ ▶ page through the boxes
  const [box, setBox] = useState(0);
  const boxCount = Math.max(1, Math.ceil(projects.length / SLOTS));
  const boxProjects = projects.slice(box * SLOTS, (box + 1) * SLOTS);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWhiteOut(false));
    return () => cancelAnimationFrame(id);
  }, []);

  // A new filter starts back at the first box
  const pick = (next) => {
    setFilter({ type: "category", value: next });
    setBox(0);
    setMenu(null);
  };
  const pickSkill = (skill) => {
    setFilter({ type: "skill", value: skill });
    setBox(0);
    setMenu(null);
  };
  // Wraps from the last box back to the first (and the other way); does nothing with only one box
  const turnBox = (delta) => setBox((b) => (b + delta + boxCount) % boxCount);
  const filterName = category ?? filter.value;

  const leaveTo = (path) => {
    setWhiteOut(true);
    setTimeout(() => navigate(path), 500);
  };

  // ← → turn the box page while no entry is open (the entry uses them for its media)
  useEffect(() => {
    if (open) return;
    const handleKey = (event) => {
      if (event.key === "ArrowRight") turnBox(1);
      if (event.key === "ArrowLeft") turnBox(-1);
      if (event.key === "Escape") setMenu(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // A press anywhere outside the filter bar closes its menu
  useEffect(() => {
    if (!filterOpen) return;
    const handlePointer = (event) => {
      if (!filterRef.current?.contains(event.target)) setMenu(null);
    };
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [filterOpen]);

  const stats = [
    ["PROJECTS", projects.length],
    ["COMPLETED", projects.filter((p) => p.status === "Completed").length],
    ["ONGOING", projects.filter((p) => p.status === "Ongoing").length],
    ["SKILLS", skills.length],
  ];

  return (
    <main
      className="relative min-h-dvh overflow-hidden font-pokemon flex items-center justify-center p-3 pt-16 sm:p-6 sm:pt-16 lg:pb-4"
      style={{ background: PAGE_BG, color: INK }}
    >
      {/* Halftone dots, strongest in the middle and fading toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        style={{ background: DOTS }}
      />

      {/* One big soft wash of grass green rising from the bottom, behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[45%] left-1/2 h-[95%] w-[120%] -translate-x-1/2 rounded-[50%] opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #7fcf5a, #4fb878 55%, transparent)" }}
      />

      <div className="relative w-full max-w-[1800px]">
        <h1 className="sr-only">Projects</h1>
        {/* On wide screens the box is sized from the viewport height (5 rows of square slots plus
            the window bar, header strip and filter bar) so it fills the screen */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:h-[calc(100dvh-5rem)] lg:grid-cols-[minmax(0,1fr)_min(calc((100dvh-15.5rem)*1.2),56vw)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-6">
          {/* Center: the box, shown as a window */}
          <section aria-label="Project box" className="relative min-w-0 sm:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-span-2">
            {/* N hanging on the window's top edge ("N Overworld Sprites" by Luckygirl88, free to use with credit):
                his body sits behind the window (which comes later in the DOM and hides his lower half),
                and a hands-only copy of the same frame sits in front so his hands grip the edge */}
            <img
              src={nSprite}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute right-10 top-0 h-[58px] w-[44px] -translate-y-[72%] select-none [image-rendering:pixelated]"
            />
            <img
              src={nHands}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute right-10 top-0 z-20 h-[58px] w-[44px] -translate-y-[72%] select-none [image-rendering:pixelated]"
            />

            <div className={`relative flex flex-col overflow-hidden ${PANEL}`}>
              {/* Window bar */}
              <div className="flex items-center gap-3 border-b border-[#e2dccd] px-3 py-2 lg:px-4">
                <span aria-hidden className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </span>
                <p className="flex-1 truncate text-center text-[10px] text-[#8a867b] lg:text-xs">HYUN&apos;S PC</p>
                <span className="w-[42px]" />
              </div>

              <div className="flex flex-col gap-2.5 p-2.5 sm:p-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => turnBox(-1)} disabled={boxCount === 1} aria-label="Previous box" className={ARROW}>
                    <FaCaretLeft aria-hidden className="text-sm lg:text-base" />
                  </button>
                  <p
                    className="flex-1 rounded-xl px-2 py-2 text-center text-[11px] text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,0.45)] sm:text-sm lg:py-2.5 lg:text-base"
                    style={{ background: FOREST, textShadow: OUTLINE }}
                    aria-live="polite"
                  >
                    {`BOX ${box + 1}`}
                    <span className="opacity-80">
                      {" · "}
                      {category === "All" ? "ALL PROJECTS" : category ? category.toUpperCase() : `SKILL: ${filter.value.toUpperCase()}`}
                    </span>
                  </p>
                  <button onClick={() => turnBox(1)} disabled={boxCount === 1} aria-label="Next box" className={ARROW}>
                    <FaCaretRight aria-hidden className="text-sm lg:text-base" />
                  </button>
                </div>

                <ul
                  key={`${filter.type}:${filter.value}:${box}`}
                  className="grid grid-cols-6 gap-1.5 rounded-xl p-2 shadow-[inset_0_2px_0_rgba(224,248,168,0.7),inset_0_-3px_0_rgba(80,100,40,0.35)] sm:gap-2.5 sm:p-3"
                  style={{ background: GRASS }}
                  onMouseLeave={() => setHovered(null)}
                >
                  {Array.from({ length: SLOTS }, (_, i) => {
                    const project = boxProjects[i];
                    if (!project) {
                      return <li key={`empty-${i}`} aria-hidden className="aspect-square" />;
                    }
                    const isHovered = hovered === project;
                    return (
                      <li
                        key={project.id}
                        className="relative aspect-square animate-[slot-pop_260ms_ease-out_both]"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        {/* The game's pointer, bobbing over the slot under the cursor */}
                        {isHovered && (
                          <span aria-hidden className="pointer-events-none absolute -top-4 left-1/2 z-20 -translate-x-1/2 animate-bounce text-xs text-white [text-shadow:1px_1px_0_#303050] sm:text-sm">
                            ▼
                          </span>
                        )}
                        <button
                          onClick={() => setOpen(project)}
                          onMouseEnter={() => setHovered(project)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(project)}
                          onBlur={() => setHovered(null)}
                          aria-label={project.name}
                          title={project.name}
                          className={`flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-[#f8f8f0] sm:rounded-xl ${PRESS} ${
                            isHovered
                              ? "-translate-y-1 scale-[1.04] shadow-[0_0_0_2px_#fff,0_14px_24px_-8px_rgba(30,60,20,0.7)]"
                              : "shadow-[0_0_0_2px_rgba(40,60,20,0.25),0_8px_16px_-8px_rgba(30,60,20,0.55)]"
                          }`}
                        >
                          <Thumbnail src={project.images[0]} />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Filter bar */}
                <div ref={filterRef} className="relative flex items-center gap-2 rounded-full border border-[#e2dccd] bg-[#f6f1e5] px-1.5 py-1">
                  <button
                    onClick={() => setMenu((m) => (m ? null : "root"))}
                    aria-label="Filter projects"
                    aria-expanded={filterOpen}
                    className={`grid h-8 w-8 place-items-center rounded-full text-[#55534c] hover:bg-[#fbf8f1] hover:text-[#18181b] ${PRESS}`}
                  >
                    <FaFilter />
                  </button>
                  <p className="flex-1 truncate text-center text-[10px] text-[#18181b] sm:text-xs lg:text-sm">
                    <span className="text-[#a29e92]">{category ? "FILTER · " : "SKILL · "}</span>
                    {filterName.toUpperCase()}
                  </p>
                  <button
                    onClick={() => pick("All")}
                    aria-label="Show all projects"
                    className={`grid h-8 w-8 place-items-center rounded-full text-[#55534c] hover:bg-[#fbf8f1] hover:text-[#18181b] ${PRESS}`}
                  >
                    <FaThLarge />
                  </button>
                  {filterOpen && (
                    <div className={`absolute bottom-full left-0 z-30 mb-2 w-64 animate-[slot-pop_160ms_ease-out_both] p-1.5 text-xs ${PANEL}`}>
                      {menu === "root" ? (
                        <ul>
                          {[
                            ["category", "Category", category ?? "—"],
                            ["skill", "Skill", category ? "—" : filter.value],
                          ].map(([id, label, current]) => (
                            <li key={id}>
                              <button
                                onClick={() => setMenu(id)}
                                className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-[#18181b] hover:bg-[#ece5d6] ${PRESS}`}
                              >
                                <span>{label}</span>
                                <span className="flex min-w-0 items-center gap-2 font-sans text-[11px] text-[#8a867b]">
                                  <span className="truncate">{current}</span>
                                  <FaChevronRight aria-hidden className="shrink-0 text-[9px]" />
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <>
                          <button
                            onClick={() => setMenu("root")}
                            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[#8a867b] hover:bg-[#ece5d6] ${PRESS}`}
                          >
                            <FaChevronLeft aria-hidden className="text-[9px]" />
                            {menu === "category" ? "CATEGORY" : "SKILL"}
                          </button>
                          <ul className="max-h-64 overflow-y-auto border-t border-[#e2dccd] pt-1">
                            {(menu === "category" ? CATEGORIES : ALL_SKILLS).map((option) => {
                              const active = option === filterName && (menu === "category") === Boolean(category);
                              return (
                                <li key={option}>
                                  <button
                                    onClick={() => (menu === "category" ? pick(option) : pickSkill(option))}
                                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-[#ece5d6] ${
                                      active ? "text-[#18181b]" : "text-[#6b685f]"
                                    } ${menu === "skill" ? "font-sans text-[13px]" : ""} ${PRESS}`}
                                  >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: active ? ACCENT : "transparent" }} />
                                    {option}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Top left: stats, or the hovered project like the PC's summary screen */}
          <Panel label={hovered ? hovered.name : "Project stats"} className="flex min-h-64 flex-col gap-3 p-4 lg:col-start-1 lg:row-start-1 lg:min-h-0 lg:overflow-hidden lg:p-5">
            {hovered ? (
              <>
                <PanelLabel>SELECTED</PanelLabel>
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-[#e2dccd] bg-[#f8f8f0]">
                  <Thumbnail src={hovered.images[0]} />
                </div>
                <p className="text-sm leading-snug [text-wrap:balance] lg:text-lg">{hovered.name}</p>
                <p className="font-sans text-xs leading-relaxed text-[#6b685f] lg:text-sm">
                  {categoriesOf(hovered).join(" · ")} · {hovered.timeFrame}
                </p>
                <span className={`flex items-center gap-1.5 self-start px-2.5 py-1 text-[11px] ${CHIP}`}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: hovered.status === "Completed" ? "#28c840" : ACCENT }} />
                  {hovered.status}
                </span>
              </>
            ) : (
              <>
                <PanelLabel>PROJECT STATS</PanelLabel>
                {/* Empty Pokéball emblem, like the PC's summary screen with nothing selected */}
                <div aria-hidden className="mx-auto my-1 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-[#d6cfbe] bg-[linear-gradient(to_bottom,#ece6d8_0_44%,#d6cfbe_44%_56%,#ece6d8_56%)] lg:my-2 lg:h-[min(7rem,11dvh)] lg:w-[min(7rem,11dvh)] lg:[@media(max-height:800px)]:hidden">
                  <div className="h-[38%] w-[38%] rounded-full border-4 border-[#d6cfbe] bg-[#f6f1e5]" />
                </div>
                <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 px-1 text-[10px] sm:text-xs lg:gap-y-3 lg:text-sm">
                  {stats.map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="text-[#6b685f]">{label}</dt>
                      <dd className="text-right tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </Panel>

          {/* Top right: categories, laid out like the party slots */}
          <Panel label="Categories" className="p-4 lg:col-start-3 lg:row-start-1 lg:p-5">
            <PanelLabel>CATEGORIES</PanelLabel>
            <ul className="mt-4 grid grid-cols-3 gap-2 lg:mx-auto lg:max-w-60 lg:grid-cols-2 lg:gap-3 lg:pb-4" style={{ "--rows": Math.ceil(CATEGORIES.length / 2) }}>
              {CATEGORIES.map((c, i) => {
                const [Icon, label] = CATEGORY_ICONS[c] ?? [FaFolder, c.toUpperCase()];
                const active = c === category;
                return (
                  <li key={c} className={i % 2 ? "lg:translate-y-4" : ""}>
                    <button
                      onClick={() => pick(c)}
                      aria-pressed={active}
                      title={c}
                      className={`flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border lg:aspect-auto lg:h-[clamp(2.4rem,calc((53.5dvh-13rem)/var(--rows)),5.5rem)] lg:gap-0.5 text-[9px] lg:text-xs ${PRESS} ${
                        active
                          ? "border-[#18181b] bg-[#18181b] text-white shadow-[0_10px_20px_-10px_rgba(24,24,27,0.6)]"
                          : "border-[#e2dccd] bg-[#f6f1e5] text-[#55534c] hover:border-[#c9c1ae] hover:bg-[#fbf8f1] hover:text-[#18181b]"
                      }`}
                    >
                      <Icon className="shrink-0 text-lg lg:text-xl" />
                      <span className="text-[8px] leading-none lg:text-[10px]">{label}</span>
                      <span className={`tabular-nums leading-none lg:[@media(max-height:800px)]:hidden ${active ? "text-white/60" : "text-[#a29e92]"}`}>{inCategory(c).length}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* Bottom left: skills */}
          <Panel label="Skills" className="flex flex-col p-4 lg:col-start-1 lg:row-start-2 lg:min-h-0 lg:p-5">
            <PanelLabel>SKILLS</PanelLabel>
            <ul className="mt-4 flex max-h-56 flex-wrap content-start gap-1.5 overflow-y-auto lg:max-h-none lg:min-h-0 lg:flex-1 lg:gap-2">
              {skills.map(([skill]) => {
                const active = filter.type === "skill" && filter.value === skill;
                return (
                  <li key={skill}>
                    <button
                      onClick={() => (active ? pick("All") : pickSkill(skill))}
                      aria-pressed={active}
                      className={`px-3 py-1 text-xs lg:text-[13px] ${CHIP} ${PRESS} ${
                        active ? "!border-[#18181b] !bg-[#18181b] !text-white" : "hover:border-[#c9c1ae] hover:bg-[#fbf8f1]"
                      }`}
                    >
                      {skill}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* Bottom right: return */}
          <div className="flex items-end justify-end sm:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-2">
            <button
              onClick={() => leaveTo("/")}
              aria-label="Back to the room"
              className={`flex items-center gap-2 rounded-full bg-[#18181b] px-5 py-2.5 text-xs text-white shadow-[0_10px_24px_-10px_rgba(24,24,27,0.6)] hover:bg-[#2b2b30] lg:px-7 lg:py-3.5 lg:text-sm ${PRESS}`}
            >
              <FaUndoAlt /> EXIT
            </button>
          </div>
        </div>
      </div>

      <p className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap font-sans text-[10px] text-[#8a867b]">
        N sprite by{" "}
        <a
          href="https://www.deviantart.com/luckygirl88/art/N-Overworld-Sprites--Full-Sheet-301745929"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#18181b]"
        >
          Luckygirl88
        </a>
      </p>

      {open && (
        <Pokedex
          key={open.id}
          project={open}
          number={projectData.indexOf(open) + 1}
          onClose={() => setOpen(null)}
        />
      )}

      <div
        className={`fixed inset-0 z-10002 bg-white pointer-events-none transition-opacity duration-500 ${whiteOut ? "opacity-100" : "opacity-0"}`}
      />
    </main>
  );
};

export default Projects;
