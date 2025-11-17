import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!usernameOrEmail.trim()) {
      setError("Username or email is required");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const res = await axios.post(
        `${apiUrl}/api/auth/forgot-password`,
        {
          usernameOrEmail: usernameOrEmail.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      setSuccess(res.data.message || "Password reset link has been sent to your email.");
      
      // Clear form after 3 seconds
      setTimeout(() => {
        setUsernameOrEmail("");
      }, 3000);

    } catch (err) {
      console.error("Forgot password error:", err);
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
          Forgot Password
        </h2>
        <p className="text-sm text-gray-300 text-center mb-6">
          Enter your username or email to receive a password reset link
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
          <label className="block mb-1 text-sm font-medium">Username or Email</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            placeholder="Enter your username or email"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00e0ff" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? "Sending..." : "Send Reset Link"}
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

