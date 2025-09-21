import React from "react";
import { MAX_SLOTS } from "./projectData";

const RightSidebar = ({ categories, selectedCategory, setSelectedCategory, filteredProjects, categoryCounts }) => {
  return (
    <div className="w-80 pl-6 space-y-6">
      {/* Project Categories */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          📂 Categories
        </h3>
        <div className="space-y-3">
          {categoryCounts.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <button
                onClick={() => setSelectedCategory(item.category)}
                className={`text-left flex-1 ${
                  selectedCategory === item.category
                    ? "text-yellow-300 font-bold"
                    : "text-gray-200 hover:text-white"
                } transition-colors`}
              >
                {item.category}
              </button>
              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Info */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          💾 Storage Info
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-200">Used Slots:</span>
            <span className="text-green-400 font-bold">
              {filteredProjects.length}/{MAX_SLOTS}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(filteredProjects.length / MAX_SLOTS) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-200">Available:</span>
            <span className="text-blue-400 font-bold">
              {MAX_SLOTS - filteredProjects.length} slots
            </span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          💡 Tips
        </h3>
        <div className="space-y-2 text-sm text-gray-200">
          <p>• Click on projects to view details</p>
          <p>• Use box navigation to see more</p>
          <p>• Projects auto-save progress</p>
          <p>• Filter by category or status</p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;