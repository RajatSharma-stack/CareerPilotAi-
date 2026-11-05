import { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    progress: 0,
  });

  useEffect(() => {
    const loadData = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("aiRoadmap"));

        if (!stored || !stored.roadmap) {
          setStats({ total: 0, completed: 0, progress: 0 });
          return;
        }

        const roadmapArray = stored.roadmap;

        const total = roadmapArray.length;

        const completed = roadmapArray.filter(
          (m) => m.completed === true,
        ).length;

        const progress =
          total === 0 ? 0 : Math.round((completed / total) * 100);

        setStats({
          total,
          completed,
          progress,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
        setStats({ total: 0, completed: 0, progress: 0 });
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Career Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-gray-400">Total Months</h2>
          <p className="text-3xl font-bold text-purple-400">{stats.total}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-gray-400">Completed Months</h2>
          <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-gray-400">Overall Progress</h2>
          <p className="text-3xl font-bold text-pink-400">{stats.progress}%</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="mb-4">Roadmap Progress</h2>
        <div className="w-full bg-gray-700 h-4 rounded-full">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${stats.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
