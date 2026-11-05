import React, { useState, useEffect } from "react";

const Tracker = () => {
  const aiData = JSON.parse(localStorage.getItem("aiRoadmap"));
  const skillsFromAI = aiData?.skills || [];

  const [completedSkills, setCompletedSkills] = useState(() => {
    const saved = localStorage.getItem("completedSkills");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("completedSkills", JSON.stringify(completedSkills));
  }, [completedSkills]);

  const toggleSkill = (index) => {
    setCompletedSkills((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completedCount = Object.values(completedSkills).filter(Boolean).length;
  const progress = skillsFromAI.length
    ? Math.round((completedCount / skillsFromAI.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Skill Tracker</h1>

      {/* Progress */}
      <div className="bg-gray-800 p-6 rounded-2xl mb-8">
        <div className="flex justify-between mb-2">
          <span>Skill Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Skill Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {skillsFromAI.map((skill, index) => {
          const isCompleted = completedSkills[index];

          return (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-xl shadow-lg flex justify-between items-center"
            >
              <span>{skill.name}</span>

              <button
                onClick={() => toggleSkill(index)}
                className={`px-4 py-2 rounded-lg ${
                  isCompleted
                    ? "bg-green-600"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600"
                }`}
              >
                {isCompleted ? "Completed" : "Mark Complete"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tracker;
