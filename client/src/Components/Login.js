import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AuthPageShell from "./AuthPageShell";
import { APP_NAME, AUTH } from "../utils/branding";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.username.trim()) {
      setError("Username is required");
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    const inactiveUsernames = (() => {
      try {
        const stored = localStorage.getItem("inactiveUsernames");
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();
    const usernameKey = formData.username.trim().toLowerCase();
    if (inactiveUsernames.includes(usernameKey)) {
      setError("Your account has been deactivated. Please contact an administrator.");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

      const res = await axios.post(
        `${apiUrl}/api/auth/login`,
        {
          username: formData.username.trim(),
          password: formData.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      const { token, user } = res.data;

      if (token) {
        Cookies.set("authToken", token, {
          expires: 15 / (24 * 60),
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        if (user) {
          sessionStorage.setItem("user", JSON.stringify(user));
          sessionStorage.setItem("role", user.role);
        }

        navigate("/dashboard");
      } else {
        setError("Login failed. No token received from server.");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to server. Please make sure the backend server is running on port 5000."
        );
      } else if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please try again.");
      } else if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;

        if (status === 500) {
          const errorMsg =
            errorData?.error ||
            errorData?.message ||
            errorData?.errorType ||
            "Unknown server error";
          setError(`Server error: ${errorMsg}. Check backend console for details.`);
        } else if (status === 401) {
          setError(errorData?.message || "Invalid username or password.");
        } else if (status === 400) {
          setError(errorData?.message || "Invalid request. Please check your input.");
        } else {
          setError(
            errorData?.message ||
              errorData?.error ||
              `Server error (${status}). Please try again.`
          );
        }
      } else if (err.request) {
        setError("No response from server. Please check if the backend server is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Ledger Management"
      subtitle={APP_NAME}
      onSubmit={handleSubmit}
    >
      {error && <motion.div className={AUTH.error}>{error}</motion.div>}

      <div className="mb-4">
        <label className={AUTH.label}>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Enter your username"
          className={AUTH.input}
        />
      </div>

      <motion.div className="mb-6">
        <label className={AUTH.label}>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
          className={AUTH.input}
        />
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(245, 158, 11, 0.35)" }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className={AUTH.button}
      >
        {loading ? "Signing in..." : "Login"}
      </motion.button>

      <div className="mt-4 text-sm text-center text-slate-400">
        <Link to="/forgot-password" className={`${AUTH.link} underline`}>
          Forgot password?
        </Link>
      </div>
    </AuthPageShell>
  );
}
