import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      // Store token & user
      localStorage.setItem("token", response.data.token);
      // prefer server user object but fall back to response.data
      const userObj = response.data.user || response.data;
      localStorage.setItem("user", JSON.stringify(userObj));

      // Debug: log server response to help diagnose onboarding detection
      console.log("Login response:", response.data);

      // Determine if onboarding is needed. Prefer server-provided fields
      const serverGoal = userObj?.careerGoal || userObj?.goal;
      const serverRoadmap = userObj?.aiRoadmap || userObj?.roadmap;

      // Sync localStorage with server values to avoid stale client data
      if (serverRoadmap) {
        localStorage.setItem("aiRoadmap", JSON.stringify(serverRoadmap));
      } else {
        // remove any leftover roadmap from previous users
        localStorage.removeItem("aiRoadmap");
      }

      if (serverGoal) {
        localStorage.setItem("careerGoal", serverGoal);
      } else {
        localStorage.removeItem("careerGoal");
      }

      // Now read from synchronized storage (or server-provided data)
      const aiRoadmapRaw = serverRoadmap
        ? JSON.stringify(serverRoadmap)
        : localStorage.getItem("aiRoadmap");
      const careerGoal = serverGoal || localStorage.getItem("careerGoal");

      let hasRoadmap = false;
      if (aiRoadmapRaw) {
        try {
          const parsed =
            typeof aiRoadmapRaw === "string"
              ? JSON.parse(aiRoadmapRaw)
              : aiRoadmapRaw;
          const roadmapArray = parsed?.roadmap || parsed?.steps || [];
          hasRoadmap = Array.isArray(roadmapArray) && roadmapArray.length > 0;
        } catch (e) {
          hasRoadmap = false;
        }
      }

      const hasGoal =
        !!careerGoal && careerGoal.trim && careerGoal.trim() !== "";

      if (!hasRoadmap || !hasGoal) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-indigo-600 opacity-20 rounded-full blur-3xl top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 rounded-full blur-3xl bottom-[-100px] right-[-100px]"></div>

      <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl shadow-2xl w-[400px]">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back </h1>
        <p className="text-gray-400 text-center mb-8">
          Login to continue your AI Career Journey
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="text-sm text-gray-400">Email</label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl mt-2 px-3">
            <Mail size={18} className="text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full p-3 outline-none text-white"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-400">Password</label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl mt-2 px-3">
            <Lock size={18} className="text-gray-400" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full p-3 outline-none text-white"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          {loading ? "Logging in..." : "Login "}
        </button>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
