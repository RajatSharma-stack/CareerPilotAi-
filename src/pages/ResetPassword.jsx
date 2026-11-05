import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const location = useLocation();
  const navigate = useNavigate(); // Added navigate to go to login after success
  const email = location.state?.email || "";

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Email missing. Go back and try again.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
        password,
      });

      alert("Password updated successfully!");
      navigate("/"); // Send them back to login page
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Invalid OTP or Error updating password",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f111a]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1a1d27] rounded-xl shadow-lg border border-slate-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Enter OTP</h2>
          <p className="mt-2 text-slate-400">
            Check your email for the 6-digit code
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 bg-[#232736] border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              OTP Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 bg-[#232736] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#232736] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
