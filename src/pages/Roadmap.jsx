import { useEffect, useState } from "react";

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState([]);
  const [progress, setProgress] = useState(0);

  // 🔥 NEW STATES
  const [resources, setResources] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loadingResources, setLoadingResources] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("aiRoadmap");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    const roadmapArray = parsed.roadmap || [];

    const updated = roadmapArray.map((month) => ({
      ...month,
      completed: month.completed || false,
    }));

    setRoadmap(updated);
    calculateProgress(updated);
  }, []);

  const calculateProgress = (data) => {
    if (!data.length) {
      setProgress(0);
      return;
    }

    const completedCount = data.filter((month) => month.completed).length;
    const percent = Math.round((completedCount / data.length) * 100);
    setProgress(percent);
  };

  const toggleComplete = (index) => {
    const updatedRoadmap = [...roadmap];
    updatedRoadmap[index].completed = !updatedRoadmap[index].completed;

    setRoadmap(updatedRoadmap);

    const stored = JSON.parse(localStorage.getItem("aiRoadmap"));

    localStorage.setItem(
      "aiRoadmap",
      JSON.stringify({
        ...stored,
        roadmap: updatedRoadmap,
      }),
    );

    calculateProgress(updatedRoadmap);
  };

  // 🔥 AI RESOURCE FETCH FUNCTION
  const fetchResources = async (skill) => {
    try {
      setSelectedSkill(skill);
      setLoadingResources(true);
      setResources(null);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/resources/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skill }),
      });

      const data = await res.json();
      setResources(data);
    } catch (error) {
      console.error("Resource fetch error:", error);
    } finally {
      setLoadingResources(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Your AI Generated Roadmap</h1>

      {/* Progress Bar */}
      <div className="bg-gray-800 p-4 rounded-xl mb-8">
        <p className="mb-2">Roadmap Progress: {progress}%</p>
        <div className="w-full bg-gray-700 h-3 rounded-full">
          <div
            className="bg-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Months */}
      <div className="grid md:grid-cols-2 gap-6">
        {roadmap.map((month, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-lg text-purple-400 font-semibold mb-1">
              {month.month}
            </h2>

            <h3 className="text-xl font-bold mb-2">{month.title}</h3>

            <p className="mb-3">
              Status:{" "}
              <span
                className={month.completed ? "text-green-400" : "text-red-400"}
              >
                {month.completed ? "Completed" : "Incomplete"}
              </span>
            </p>

            {/* 🔥 Skills (Clickable) */}
            <h4 className="font-semibold">Skills:</h4>
            <ul className="list-disc pl-6 mb-4">
              {month.skills?.map((skill, i) => (
                <li
                  key={i}
                  onClick={() => fetchResources(skill)}
                  className="cursor-pointer text-blue-400 hover:underline"
                >
                  {skill}
                </li>
              ))}
            </ul>

            {month.projects && (
              <>
                <h4 className="font-semibold">Projects:</h4>
                <ul className="list-disc pl-6 mb-4">
                  {month.projects.map((project, i) => (
                    <li key={i}>{project}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => toggleComplete(index)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                {month.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>

              {month.completed && (
                <button
                  onClick={() => (window.location.href = "/quiz")}
                  className="bg-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-500 transition"
                >
                  Take Quiz
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 AI Resource Display */}
      {loadingResources && (
        <div className="mt-8 text-purple-400">Generating AI Resources...</div>
      )}

      {resources && (
        <div className="mt-10 bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">
            Study Resources for {selectedSkill}
          </h2>

          {/* English */}
          <h3 className="text-xl text-purple-400 mb-2">English Resources</h3>
          {resources.english?.youtube?.map((item, i) => (
            <div key={i}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {item.title}
              </a>
            </div>
          ))}

          {/* Hindi */}
          <h3 className="text-xl text-purple-400 mt-6 mb-2">Hindi Resources</h3>
          {resources.hindi?.youtube?.map((item, i) => (
            <div key={i}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {item.title}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roadmap;
