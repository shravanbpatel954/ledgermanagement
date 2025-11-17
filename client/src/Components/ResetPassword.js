import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!tokenParam || !emailParam) {
      setError("Invalid reset link. Please request a new password reset.");
    } else {
      setToken(tokenParam);
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token || !email) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const res = await axios.post(
        `${apiUrl}/api/auth/reset-password`,
        {
          token,
          email,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      setSuccess(res.data.message || "Password reset successful!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("Reset password error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError("Cannot connect to server. Please make sure the backend server is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 w-[90%] max-w-md text-white"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-cyan-400 tracking-wide">
          Reset Password
        </h2>
        <p className="text-sm text-gray-300 text-center mb-6">
          Enter your new password
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-300 px-3 py-2 mb-4 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-400 text-green-300 px-3 py-2 mb-4 rounded-md text-sm text-center">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            placeholder="Enter new password (min 6 characters)"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm new password"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00e0ff" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading || !token || !email}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </motion.button>

        <div className="text-sm text-center text-gray-300">
          <Link to="/login" className="hover:text-cyan-400">
            ← Back to Login
          </Link>
        </div>
      </motion.form>
    </div>
  );
}

