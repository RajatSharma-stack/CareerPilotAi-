import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password,
        },
      );

      if (response.data) {
        // 1. Store the "login" state immediately
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));

        // 2. Direct first-time users to onboarding
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-indigo-600 opacity-20 rounded-full blur-3xl top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 rounded-full blur-3xl bottom-[-100px] right-[-100px]"></div>

      <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl shadow-2xl w-[400px]">
        <h1 className="text-3xl font-bold text-center mb-2">Join Us 🚀</h1>
        <p className="text-gray-400 text-center mb-8">
          Create your account to start your AI Career Journey
        </p>

        {/* Name */}
        <div className="mb-5">
          <label className="text-sm text-gray-400">Full Name</label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl mt-2 px-3">
            <User size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent w-full p-3 outline-none text-white"
            />
          </div>
        </div>

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
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          {loading ? "Creating account..." : "Sign Up 🚀"}
        </button>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
