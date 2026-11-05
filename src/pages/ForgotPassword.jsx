import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault(); // Prevents page reload on form submit
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        email,
      });

      alert("OTP sent to your email");
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f111a]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1a1d27] rounded-xl shadow-lg border border-slate-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="mt-2 text-slate-400">
            Enter your email to receive an OTP
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSendOtp}>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#232736] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Send OTP
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-purple-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
