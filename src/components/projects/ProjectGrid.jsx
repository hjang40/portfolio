import React from "react";
import { FaFilePdf } from "react-icons/fa";
import { MAX_SLOTS } from "./projectData";
import { isPdf } from "./projectUtils";

const ProjectGrid = ({ filteredProjects, openProject }) => {
  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
        📦 My Projects Box
      </h1>

      {/* Project Grid / Slots */}
      <div className="grid grid-cols-6 gap-4 border-4 border-gray-600 p-6 rounded-lg bg-green-100 mb-6">
        {Array.from({ length: MAX_SLOTS }).map((_, slotIndex) => {
          const project = filteredProjects[slotIndex];
          const firstMedia = project?.images?.[0] || null;

          return (
            <div
              key={slotIndex}
              onClick={() => project && openProject(project)}
              className={`w-24 h-24 flex flex-col items-center justify-center border-2 rounded-lg shadow cursor-pointer transition-colors ${
                project ? "bg-white hover:bg-yellow-100" : "bg-gray-200"
              }`}
            >
              {project ? (
                <>
                  {isPdf(firstMedia) ? (
                    <FaFilePdf size={24} className="text-red-600" />
                  ) : (
                    <img
                      src={firstMedia}
                      alt={project.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <p className="text-xs mt-1 font-bold text-center truncate w-full px-1">
                    {project.name}
                  </p>
                </>
              ) : (
                <p className="text-gray-400 text-xs">Empty</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Box Controls */}
      <div className="flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">
          ← Previous Box
        </button>
        <span className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold">
          Box 1 / 5
        </span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">
          Next Box →
        </button>
      </div>
    </div>
  );
};

export default ProjectGrid;