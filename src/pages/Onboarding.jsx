import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  const [careerData, setCareerData] = useState({
    goal: "",
    level: "Beginner",
    duration: "6 Months",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCareerData({
      ...careerData,
      [e.target.name]: e.target.value,
    });
  };

  const generateAIRoadmap = async () => {
    try {
      console.log("Calling backend...");
      setLoading(true);

      const response = await fetch("/api/ai/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(careerData),
      });

      console.log("Response object:", response);

      if (!response.ok) {
        throw new Error("Server responded but failed");
      }

      const data = await response.json();
      console.log("Data from backend:", data);

      localStorage.setItem("aiRoadmap", JSON.stringify(data));
      localStorage.setItem("careerGoal", careerData.goal); // ⭐ SAVE CAREER GOAL

      navigate("/roadmap");
    } catch (error) {
      console.error("AI Error:", error);
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Generate AI Career Roadmap
        </h2>

        {/* Career Goal Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            What is your career goal?
          </label>
          <input
            type="text"
            name="goal"
            placeholder="e.g., Full Stack Developer"
            value={careerData.goal}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Experience Level Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Current Experience Level
          </label>
          <select
            name="level"
            value={careerData.level}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Duration Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Roadmap Duration
          </label>
          <select
            name="duration"
            value={careerData.duration}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
          >
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="12 Months">12 Months</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={generateAIRoadmap}
          disabled={loading || !careerData.goal.trim()}
          className={`w-full p-3 rounded-xl font-semibold transition-all ${
            loading || !careerData.goal.trim()
              ? "bg-gray-600 cursor-not-allowed opacity-70"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
          }`}
        >
          {loading ? "Generating..." : "Generate AI Roadmap"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
