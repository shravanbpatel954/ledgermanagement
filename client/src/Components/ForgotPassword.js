import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthPageShell from "./AuthPageShell";
import { AUTH } from "../utils/branding";

export default function ForgotPassword() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await axios.post(
        `${apiUrl}/api/auth/forgot-password`,
        {
          usernameOrEmail: usernameOrEmail.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      setSuccess(res.data.message || "Password reset link has been sent to your email.");

      setTimeout(() => {
        setUsernameOrEmail("");
      }, 3000);
    } catch (err) {
      console.error("Forgot password error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Please make sure the backend server is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Forgot Password"
      subtitle="Enter your username or email to receive a reset link"
      onSubmit={handleSubmit}
    >
      {error && <div className={AUTH.error}>{error}</div>}
      {success && <motion.div className={AUTH.success}>{success}</motion.div>}

      <div className="mb-4">
        <label className={AUTH.label}>Username or Email</label>
        <input
          type="text"
          name="usernameOrEmail"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
          placeholder="Enter your username or email"
          className={AUTH.input}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(245, 158, 11, 0.35)" }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className={`${AUTH.button} mb-4`}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </motion.button>

      <div className="text-sm text-center text-slate-400">
        <Link to="/login" className={AUTH.link}>
          ← Back to Login
        </Link>
      </div>
    </AuthPageShell>
  );
}
