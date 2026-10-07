import { useState, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";
import textBg from "../assets/images/text.png";

// Pokémon-style text box. Text types out letter by letter; click / Enter / Space
// first finishes the line, then calls onAdvance (if given). Remount with a new
// `key` per line so the typing restarts.
const DialogueBox = ({ text, onAdvance }) => {
  const [shown, setShown] = useState(0);
  const done = shown >= text.length;

  useEffect(() => {
    const id = setInterval(() => {
      setShown((count) => {
        if (count >= text.length) clearInterval(id);
        return Math.min(count + 1, text.length);
      });
    }, 25);
    return () => clearInterval(id);
  }, [text]);

  const advance = () => {
    if (!done) setShown(text.length);
    else onAdvance?.();
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (done && !onAdvance) return; // let Enter fall through (e.g. to choose a ball)
      event.preventDefault();
      advance();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <div
      onClick={advance}
      role="status"
      aria-live="polite"
      className="font-pokemon absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 w-[min(700px,calc(100vw-2rem))] min-h-24 sm:h-32 px-4 py-3 rounded-lg flex items-center cursor-pointer select-none"
      style={{
        backgroundImage: `url(${textBg})`,
        backgroundColor: "white",
        backgroundSize: "100% 100%",
      }}
    >
      <p className="text-black text-xs sm:text-sm leading-relaxed flex-1 px-2 sm:px-4 pr-8">
        {text.slice(0, shown)}
      </p>
      {done && onAdvance && (
        <FaCaretDown
          aria-hidden
          className="absolute bottom-3 right-4 text-black text-xl animate-bounce"
        />
      )}
    </div>
  );
};

export default DialogueBox;
