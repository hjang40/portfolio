// Full-screen pixel-art backdrop for the About page: a FireRed-style Route 1 at midday.
// Drawn as an SVG on a 320x180 pixel grid (crisp edges, no gradients), so it stays sharp at any size.
const W = 320;
const H = 180;

// Banded sky, lightest near the horizon
const SKY = [
  [0, "#86cff8"],
  [28, "#98d7fa"],
  [52, "#acdffb"],
  [72, "#c2e8fb"],
  [88, "#d8f1f8"],
];

// Deterministic "random" so the scene is the same on every load
const noise = (i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// Stepped hill silhouette: one column per pixel, height from layered sine waves
const hill = (base, amp, freq, phase) =>
  Array.from({ length: W }, (_, x) =>
    Math.round(base - amp * (0.6 * Math.sin(x * freq + phase) + 0.4 * Math.sin(x * freq * 2.3 + phase * 1.7)))
  );

const columns = (heights, color, bottom) =>
  heights.map((top, x) => <rect key={`${color}${x}`} x={x} y={top} width={1} height={bottom - top} fill={color} />);

const FAR_HILLS = hill(96, 9, 0.035, 1.2);
const NEAR_HILLS = hill(108, 6, 0.06, 4.1);

// Pixel cloud made of stacked bars
const Cloud = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={6} y={0} width={10} height={2} fill="#ffffff" />
    <rect x={3} y={2} width={18} height={2} fill="#ffffff" />
    <rect x={0} y={4} width={26} height={3} fill="#ffffff" />
    <rect x={2} y={7} width={22} height={2} fill="#dcefff" />
  </g>
);

// Round pixel tree: canopy rows, a highlight and a trunk
const Tree = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={3} y={0} width={6} height={1} fill="#2f7a4d" />
    <rect x={1} y={1} width={10} height={2} fill="#3a8f5a" />
    <rect x={0} y={3} width={12} height={5} fill="#3a8f5a" />
    <rect x={1} y={8} width={10} height={2} fill="#2f7a4d" />
    <rect x={3} y={2} width={3} height={2} fill="#5cb878" />
    <rect x={5} y={10} width={2} height={3} fill="#7a5530" />
  </g>
);

const TREES = Array.from({ length: 28 }, (_, i) => ({ x: i * 12 - 4 + Math.round(noise(i) * 4), y: 104 + Math.round(noise(i + 50) * 4) }));

// Grass tufts scattered over the field (same shape as the PC box wallpaper)
const TUFT = [[3, 0, 2, 1], [2, 1, 4, 2], [0, 2, 2, 1], [8, 2, 2, 1], [1, 3, 3, 2], [6, 3, 3, 2]];
const TUFTS = Array.from({ length: 70 }, (_, i) => ({
  x: Math.round(noise(i + 100) * (W - 10)),
  y: 124 + Math.round(noise(i + 200) * (H - 130)),
  c: noise(i + 300) > 0.5 ? "#b0e078" : "#80b048",
}));

// Winding dirt path from the bottom edge up toward the trees
const PATH = Array.from({ length: H - 118 }, (_, i) => {
  const y = 118 + i;
  const t = i / (H - 118);
  const center = 196 + Math.round(Math.sin(i * 0.09) * 10 - t * 6);
  const half = 4 + Math.round(t * 14);
  return { y, x: center - half, w: half * 2 };
});

const PixelScene = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden bg-[#88c860]">
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      className="h-full w-full"
    >
      {SKY.map(([y], i) => (
        <rect key={y} x={0} y={y} width={W} height={(SKY[i + 1]?.[0] ?? 120) - y} fill={SKY[i][1]} />
      ))}
      <g className="animate-[cloud-drift_90s_linear_infinite]">
        <Cloud x={24} y={18} />
        <Cloud x={118} y={36} s={0.8} />
        <Cloud x={212} y={14} s={1.2} />
        <Cloud x={290} y={44} s={0.7} />
        <Cloud x={344} y={18} />
        <Cloud x={438} y={36} s={0.8} />
        <Cloud x={532} y={14} s={1.2} />
        <Cloud x={610} y={44} s={0.7} />
      </g>
      {columns(FAR_HILLS, "#9fd3a8", 120)}
      {columns(NEAR_HILLS, "#7cc08f", 120)}
      <rect x={0} y={116} width={W} height={H - 116} fill="#88c860" />
      {TREES.map((t, i) => <Tree key={i} {...t} />)}
      {PATH.map((r) => (
        <g key={r.y}>
          <rect x={r.x - 1} y={r.y} width={r.w + 2} height={1} fill="#c8a86a" />
          <rect x={r.x} y={r.y} width={r.w} height={1} fill="#e6cf92" />
        </g>
      ))}
      {TUFTS.map((t, i) =>
        TUFT.map(([tx, ty, w, h], j) => (
          <rect key={`${i}-${j}`} x={t.x + tx} y={t.y + ty} width={w} height={h} fill={t.c} />
        ))
      )}
    </svg>
  </div>
);

export default PixelScene;
