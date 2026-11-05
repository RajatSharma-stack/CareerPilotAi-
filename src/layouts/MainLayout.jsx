import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 p-6 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}
      >
        <div className="flex justify-between items-center md:hidden mb-6">
          <h2 className="text-xl font-bold">CareerPilot AI</h2>
          <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
        </div>

        <h2 className="text-xl font-bold mb-10 hidden md:block">
          CareerPilot AI
        </h2>

        <ul className="space-y-6 text-gray-300">
          <li
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 hover:text-indigo-400 cursor-pointer"
          >
            <LayoutDashboard size={20} /> Dashboard
          </li>

          <li
            onClick={() => navigate("/roadmap")}
            className="flex items-center gap-3 hover:text-indigo-400 cursor-pointer"
          >
            <Map size={20} /> My Roadmap
          </li>

          <li
            onClick={() => navigate("/tracker")}
            className="flex items-center gap-3 hover:text-indigo-400 cursor-pointer"
          >
            <BarChart3 size={20} /> Skill Tracker
          </li>

          <li
            onClick={() => navigate("/resume")}
            className="flex items-center gap-3 hover:text-indigo-400 cursor-pointer"
          >
            <FileText size={20} /> Resume Analyzer
          </li>

          <li className="flex items-center gap-3 hover:text-indigo-400 cursor-pointer">
            <Settings size={20} /> Settings
          </li>

          <li
            onClick={() => {
              // Clear auth and onboarding state on logout so next login shows onboarding
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("aiRoadmap");
              localStorage.removeItem("careerGoal");
              navigate("/");
            }}
            className="flex items-center gap-3 text-red-400 cursor-pointer"
          >
            <LogOut size={20} /> Logout
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 w-full">
        <div className="flex justify-between items-center mb-8">
          <Menu
            className="md:hidden cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
          <h1 className="text-2xl font-bold">Career Dashboard</h1>
          <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
        </div>

        {/* Nested Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
