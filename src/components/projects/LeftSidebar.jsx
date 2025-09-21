import React, { useState } from "react";

const LeftSidebar = ({ stats, skills }) => {
  const [showAllSkills, setShowAllSkills] = useState(false);

  const openSkillsModal = () => setShowAllSkills(true);
  const closeSkillsModal = () => setShowAllSkills(false);

  return (
    <>
      <div className="w-80 pr-6 space-y-6">
        {/* Stats Panel */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            📊 Project Stats
          </h3>
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-200">{stat.label}:</span>
                <span className={`font-bold text-lg ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🛠️ Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="bg-blue-600/20 border border-blue-400 px-3 py-1 rounded-full text-blue-200 text-sm"
              >
                {skill}
              </span>
            ))}
            {skills.length > 5 && (
              <button
                onClick={openSkillsModal}
                className="bg-blue-600/20 border border-gray-400 px-3 py-1 rounded-full text-gray-300 text-sm hover:bg-blue-600/30 hover:border-blue-300 hover:text-blue-200 transition-colors cursor-pointer"
              >
                +{skills.length - 5}
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            ⚡ Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => console.log("Navigate to /about")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-left"
            >
              👤 View About
            </button>
            <button
              onClick={() => console.log("Navigate to /contact")}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-left"
            >
              📧 Contact Me
            </button>
            <button
              onClick={() => console.log("Navigate to /")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-left"
            >
              🏠 Go Home
            </button>
          </div>
        </div>
      </div>

      {/* All Skills Modal */}
      {showAllSkills && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl border-2 border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🛠️ All Skills
              </h2>
              <button
                onClick={closeSkillsModal}
                className="text-gray-300 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-600/20 border border-blue-400 px-4 py-2 rounded-full text-blue-200 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-6 text-gray-300 text-sm">
                Total Skills: <span className="text-blue-400 font-bold">{skills.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;