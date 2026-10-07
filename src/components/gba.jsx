import textBg from "../assets/images/text.png";

// Shared Game Boy Advance look for the About and Projects pages.
// The cream wall color from the intro's FireRed room
export const WALL = "#f4ecd8";

// FireRed-style text box. border-image keeps the frame a fixed thickness however tall the
// text gets (a stretched background made the frame thicker and crowd long text)
export const TextBox = ({ children, className = "" }) => (
  <div
    className={`bg-white px-4 py-3 text-xs leading-relaxed text-black sm:px-6 sm:text-sm ${className}`}
    style={{
      borderStyle: "solid",
      borderWidth: "10px",
      borderImage: `url(${textBg}) 30 fill / 10px stretch`,
      imageRendering: "pixelated",
    }}
  >
    {children}
  </div>
);

// Tiny CSS Pokéball: red top, black band, white bottom. `empty` draws a grey one.
export const MiniBall = ({ empty = false, className = "" }) => (
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
