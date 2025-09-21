import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import background from "../assets/images/background.png";
import background2 from "../assets/images/background2.png";
import background3 from "../assets/images/background3.png";
import panel from "../assets/images/panel.png";
import panel2 from "../assets/images/panel2.png";
import exitImg from "../assets/images/exit.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formattedTime, setFormattedTime] = useState("");
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setFormattedTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const links = [
    { to: "/", label: "HOME" },
    { to: "/about", label: "ABOUT" },
    { to: "/projects", label: "PROJECTS" },
    { to: "/contact", label: "CONTACT" },
    // { to: "/services", label: "Services" },
    // { to: "/blog", label: "Blog" },
  ];

  const topOverlayHeight = (40 / 464) * 768; // ≈ 66px
  const bottomOverlayHeight = (56 / 464) * 768; // ≈ 92px

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-[9999] text-2xl p-2 rounded focus:outline-none bg-gray-200/30 hover:bg-gray-300/90 backdrop-blur-md transition"
      >
        <FaBars />
      </button>

      {menuOpen && (
        <div className="fixed inset-0 z-40">
          {/* Overlay to detect outside clicks */}
          <div className="absolute inset-0 bg-black/30"></div>

          <nav
            ref={menuRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden shadow-lg"
            style={{ width: "1024px", height: "768px" }}
          >
            {/* Base background */}
            <div
              className="absolute inset-0 bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "contain",
              }}
            />

            {/* Overlay top (background2) */}
            <div
              className="absolute top-0 left-0 w-full"
              style={{
                backgroundImage: `url(${background2})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                height: `${topOverlayHeight}px`,
              }}
            />

            {/* Overlay bottom (background3) */}
            <div
              className="absolute bottom-0 left-0 w-full"
              style={{
                backgroundImage: `url(${background3})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                height: `${bottomOverlayHeight}px`,
              }}
            />

            {/* Current time inside menu, top-left */}
            <div className="font-pokemon absolute top-3 left-3 z-10 text-white text-lg drop-shadow">
              {formattedTime}
            </div>

            {/* Panels grid */}
            <div
              className="font-pokemon absolute left-0 right-0 grid grid-cols-2 grid-rows-3 p-8 gap-6"
              style={{
                top: `${topOverlayHeight}px`,
                bottom: `${bottomOverlayHeight}px`,
              }}
            >
              {Array.from({ length: 6 }).map((_, idx) => {
                const link = links[idx] || null; // If no link, use null
                return link ? (
                  <NavLink key={link.to} to={link.to} onClick={closeMenu}>
                    {({ isActive }) => (
                      <div
                        className="w-full h-full flex items-center justify-center bg-center bg-no-repeat transition duration-200 ease-in-out hover:brightness-110 hover:scale-105"
                        style={{
                          backgroundImage: `url(${isActive ? panel2 : panel})`,
                          backgroundSize: "contain",
                        }}
                      >
                        <span
                          className={`z-10 text-[35px] font-pokemon transition duration-200 ease-in-out text-white `}
                          style={{
                            textShadow: "3px 3px 0 #b0b0b070", // light gray shadow at bottom-right
                          }}
                        >
                          {link.label}
                        </span>
                      </div>
                    )}
                  </NavLink>
                ) : (
                  // Empty panel placeholder
                  <div
                    key={idx}
                    className="w-full h-full flex items-center justify-center bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${panel})`,
                      backgroundSize: "contain",
                      cursor: "default",
                      opacity: 0.3,
                    }}
                  />
                );
              })}
            </div>

            {/* Exit button overlaying background3 */}
            <button
              onClick={closeMenu}
              className="absolute transition duration-200 ease-in-out hover:brightness-110 hover:scale-110"
              style={{
                right: "16px",
                bottom: "16px",
                width: "60px",
                height: "60px",
                backgroundImage: `url(${exitImg})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
