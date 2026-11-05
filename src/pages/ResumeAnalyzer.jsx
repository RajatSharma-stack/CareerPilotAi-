import { useState } from "react";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume file");
      return;
    }

    // 1️⃣ Try to get goal from localStorage
    let goal = localStorage.getItem("careerGoal");

    // 2️⃣ If not found, take from roadmap data
    if (!goal) {
      const roadmap = JSON.parse(localStorage.getItem("aiRoadmap"));
      goal = roadmap?.career || roadmap?.goal || roadmap?.title || null;
    }

    // 3️⃣ Still not found → user never generated roadmap
    if (!goal) {
      alert("Please generate roadmap first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("goal", goal);

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("http://localhost:5000/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Resume Result:", data);

      if (!response.ok) {
        alert(data.message || "Analysis failed");
        return;
      }

      setResult(data);
      localStorage.setItem("resumeAnalysis", JSON.stringify(data));
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">AI Resume Analyzer </h1>

      {/* Upload Card */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-6">
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Score */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Resume Score</h2>
            <p className="text-4xl font-bold text-purple-400">
              {result.score ?? 0}/100
            </p>
          </div>

          {/* Strengths */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Strengths</h2>
            {result.strengths?.length ? (
              <div className="flex flex-wrap gap-3">
                {result.strengths.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-green-700/20 text-green-300 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No strengths detected</p>
            )}
          </div>

          {/* Missing Skills */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Missing Skills</h2>
            {result.missingSkills?.length ? (
              <div className="flex flex-wrap gap-3">
                {result.missingSkills.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-red-800/20 text-red-300 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No missing skills 🎉</p>
            )}
          </div>

          {/* Suggestions */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Suggestions</h2>
            {result.suggestions?.length ? (
              <div className="space-y-3">
                {result.suggestions.map((item, index) => {
                  const isProject = /project(s)?/i.test(item);
                  return (
                    <div
                      key={index}
                      className="p-3 rounded-md bg-slate-900/30 flex items-start gap-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm">{item}</p>
                        {isProject && (
                          <p className="text-xs text-yellow-300 mt-1">
                            Project suggestion — try building this as a small
                            portfolio project.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400">No suggestions available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
