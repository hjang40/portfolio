import React from "react";
import {
  FaSearchPlus,
  FaFilePdf,
  FaExternalLinkAlt,
  FaPlay,
} from "react-icons/fa";
import { isPdf, isVideo } from "./projectUtils";

import pokedex from "../../assets/images/pokedex/pokedex.png";
import pokedexTitle from "../../assets/images/pokedex/pokedexTitle.png";

const Pokedex = ({
  selected,
  closeProject,
  imgIndex,
  nextImage,
  prevImage,
  setImgIndex,
  openSkillsModal,
  openImageZoom,
  showSkillsModal,
  closeSkillsModal,
  showImageZoom,
  closeImageZoom,
}) => {
  if (!selected) return null;

  // Handle media click with enlarge as priority
  const handleMediaClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openImageZoom();
  };

  return (
    <>
      {/* === Project Viewer Popup === */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
        <div
          className="relative border-4 border-black rounded-xl shadow-2xl w-full max-w-5xl"
          style={{
            aspectRatio: "4/3",
            backgroundImage: `url(${pokedex})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeProject}
            className="absolute top-4 right-4 z-20 bg-red-700 hover:bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg transition-colors"
          >
            ×
          </button>

          <div className="relative z-10 flex h-full w-full p-8">
            {/* Left Side: Media Viewer */}
            <div className="w-2/5 flex flex-col items-center justify-center pr-6">
              <div className="relative">
                {selected.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold transition-all duration-200 shadow-lg border-2 border-blue-300 hover:scale-105 active:scale-95 z-10"
                      aria-label="Previous image"
                    >
                      ◀
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg w-12 h-12 flex items-center justify-center font-bold transition-all duration-200 shadow-lg border-2 border-blue-300 hover:scale-105 active:scale-95 z-10"
                      aria-label="Next image"
                    >
                      ▶
                    </button>
                  </>
                )}

                {/* Display PDF preview, video preview, or image with enlarge priority */}
                <div
                  className="relative cursor-pointer hover:scale-105 transition-transform duration-200 select-none"
                  onClick={handleMediaClick}
                  onMouseDown={handleMediaClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleMediaClick(e);
                    }
                  }}
                  aria-label="Click to enlarge media"
                >
                  {isPdf(selected.images[imgIndex]) ? (
                    <div className="w-40 h-40 bg-white rounded shadow-lg border">
                      <object
                        data={selected.images[imgIndex]}
                        type="application/pdf"
                        className="w-full h-full rounded pointer-events-none"
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <FaFilePdf size={48} className="text-red-600 mb-2" />
                          <span className="text-xs text-gray-600">
                            PDF Document
                          </span>
                        </div>
                      </object>
                    </div>
                  ) : isVideo(selected.images[imgIndex]) ? (
                    <div className="w-40 h-40 bg-black rounded shadow-lg border relative overflow-hidden">
                      <video
                        src={selected.images[imgIndex]}
                        className="w-full h-full object-cover rounded pointer-events-none"
                        muted
                        playsInline
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                          <FaPlay size={48} className="text-white mb-2" />
                          <span className="text-xs text-white">Video File</span>
                        </div>
                      </video>
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                        <FaPlay
                          size={32}
                          className="text-white drop-shadow-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={selected.images[imgIndex]}
                      alt={`${selected.name} ${imgIndex + 1}`}
                      className="w-40 h-40 rounded shadow-lg object-cover select-none"
                      draggable={false}
                    />
                  )}
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white p-1 rounded-full pointer-events-none">
                    <FaSearchPlus />
                  </div>
                </div>
              </div>

              {selected.images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {selected.images.map((media, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImgIndex(idx)}
                      className={`w-4 h-4 rounded-full transition-all duration-200 flex items-center justify-center ${
                        idx === imgIndex
                          ? "bg-yellow-400 scale-125"
                          : "bg-gray-400 hover:scale-110"
                      }`}
                    >
                      {/* Optionally, add an icon or number here for extra feedback */}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Details - Fixed with proper height constraints */}
            <div className="w-3/5 flex flex-col pl-6 pt-8 h-full">
              <div
                className="mb-4 rounded overflow-hidden relative flex-shrink-0"
                style={{
                  height: "60px",
                  backgroundImage: `url(${pokedexTitle})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-white text-xl font-bold drop-shadow-lg">
                    {selected.name}
                  </h2>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-0 border-4 border-gray-600 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                <div className="bg-gray-300">
                  <div className="p-3 border-b border-gray-500">
                    <span className="text-sm font-bold text-gray-800">
                      TIME FRAME:
                    </span>
                  </div>
                  <div className="p-3 border-b border-gray-500">
                    <span className="text-sm font-bold text-gray-800">
                      CATEGORY:
                    </span>
                  </div>
                  <div className="p-3 border-b border-gray-500">
                    <span className="text-sm font-bold text-gray-800">
                      SKILLS:
                    </span>
                  </div>
                  <div className="p-3">
                    <span className="text-sm font-bold text-gray-800">
                      STATUS:
                    </span>
                  </div>
                </div>

                <div className="bg-white">
                  <div className="p-3 border-b border-gray-400">
                    <span className="text-sm text-gray-900">
                      {selected.timeFrame?.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-3 border-b border-gray-400">
                    <span className="text-sm text-gray-900">
                      {Array.isArray(selected.category)
                        ? selected.category.join(", ").toUpperCase()
                        : selected.category?.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-3 border-b border-gray-400">
                    <div className="flex flex-wrap gap-2">
                      {selected.skills.slice(0, 1).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs border border-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {selected.skills.length > 2 && (
                        <button
                          onClick={openSkillsModal}
                          className="bg-blue-100 text-black px-2 py-0.5 rounded text-xs border border-gray-800 ml-1"
                          aria-label={`Show ${
                            selected.skills.length - 1
                          } more skills`}
                        >
                          +{selected.skills.length - 1}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <span
                      className={`text-sm font-bold ${
                        selected.status?.toLowerCase() === "completed"
                          ? "text-green-600"
                          : selected.status?.toLowerCase() === "ongoing"
                          ? "text-green-400" // lighter green
                          : "text-yellow-600"
                      }`}
                    >
                      {selected.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description section with controlled height and scrolling */}
              <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg min-h-0 flex flex-col">
                <div className="p-6 pb-0 flex-shrink-0">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {selected.name}
                  </h3>
                </div>
                
                <div className="flex-1 min-h-0 px-6 pb-2">
                  <div className="overflow-y-auto h-full pr-2">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {selected.description}
                    </p>
                  </div>
                </div>

                {selected.link && (
                  <div className="p-6 pt-4 flex-shrink-0 border-t border-gray-200/50">
                    <a
                      href={selected.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold text-sm transition-colors border-2 border-red-700 shadow"
                    >
                      VIEW PROJECT →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills Modal */}
          {showSkillsModal && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-6">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={closeSkillsModal}
              />
              <div className="relative bg-white border-4 border-black rounded-lg p-6 w-[520px] max-w-full z-40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">All Skills</h3>
                  <button
                    onClick={closeSkillsModal}
                    className="bg-red-700 hover:bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
                    aria-label="Close skills modal"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {selected.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-2 border rounded bg-gray-100 flex items-center"
                    >
                      <span className="text-sm text-gray-800">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === Image/PDF/Video Zoom Modal === */}
      {showImageZoom && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[100] p-4">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={closeImageZoom}
              className="absolute -top-12 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg transition-colors z-10"
            >
              ×
            </button>

            {/* Navigation arrows if multiple media */}
            {selected.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg w-14 h-14 flex items-center justify-center font-bold transition-all duration-200 shadow-lg border-2 border-blue-300 hover:scale-105 active:scale-95 z-10"
                  aria-label="Previous"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg w-14 h-14 flex items-center justify-center font-bold transition-all duration-200 shadow-lg border-2 border-blue-300 hover:scale-105 active:scale-95 z-10"
                >
                  ▶
                </button>
              </>
            )}

            {/* Zoomed media display */}
            {isPdf(selected.images[imgIndex]) ? (
              <div className="max-w-[95vw] max-h-[95vh] bg-white rounded-lg shadow-2xl border-4 border-white/20 overflow-hidden">
                <object
                  data={selected.images[imgIndex]}
                  type="application/pdf"
                  className="w-full h-full"
                  style={{ minHeight: "80vh", minWidth: "70vw" }}
                >
                  <div className="w-full h-96 flex flex-col items-center justify-center p-8">
                    <FaFilePdf size={64} className="text-red-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      PDF Preview
                    </h3>
                    <a
                      href={selected.images[imgIndex]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                    >
                      <FaExternalLinkAlt />
                      Open PDF
                    </a>
                  </div>
                </object>
              </div>
            ) : isVideo(selected.images[imgIndex]) ? (
              <div className="max-w-[95vw] max-h-[95vh] bg-black rounded-lg shadow-2xl border-4 border-white/20 overflow-hidden">
                <video
                  src={selected.images[imgIndex]}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  style={{ maxHeight: "90vh", maxWidth: "95vw" }}
                >
                  <div className="w-full h-96 flex flex-col items-center justify-center p-8 bg-gray-800">
                    <FaPlay size={64} className="text-white mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Video Preview
                    </h3>
                    <p className="text-gray-300 text-center">
                      Your browser doesn't support video playbook.
                    </p>
                  </div>
                </video>
              </div>
            ) : (
              <img
                src={selected.images[imgIndex]}
                alt={`${selected.name} - Enlarged`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border-4 border-white/20"
              />
            )}
          </div>

          <div className="absolute inset-0 -z-10" onClick={closeImageZoom} />
        </div>
      )}
    </>
  );
};

export default Pokedex;