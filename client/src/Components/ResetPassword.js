import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import AuthPageShell from "./AuthPageShell";
import { AUTH } from "../utils/branding";

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
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await axios.post(
        `${apiUrl}/api/auth/reset-password`,
        {
          token,
          email,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      setSuccess(res.data.message || "Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
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
      title="Reset Password"
      subtitle="Choose a new password for your ledger account"
      onSubmit={handleSubmit}
    >
      {error && <motion.div className={AUTH.error}>{error}</motion.div>}
      {success && <div className={AUTH.success}>{success}</div>}

      <div className="mb-4">
        <label className={AUTH.label}>New Password</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          placeholder="Enter new password (min 6 characters)"
          className={AUTH.input}
        />
      </div>

      <div className="mb-6">
        <label className={AUTH.label}>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirm new password"
          className={AUTH.input}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(245, 158, 11, 0.35)" }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || !token || !email}
        className={`${AUTH.button} mb-4`}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </motion.button>

      <div className="text-sm text-center text-slate-400">
        <Link to="/login" className={AUTH.link}>
          ← Back to Login
        </Link>
      </div>
    </AuthPageShell>
  );
}
