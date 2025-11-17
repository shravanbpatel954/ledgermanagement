import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

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

    // Frontend validation
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
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Backend expects: { username, password } and returns { token, user }
      const res = await axios.post(
        `${apiUrl}/api/auth/login`,
        {
          username: formData.username.trim(),
          password: formData.password,
        },
        { 
          withCredentials: true, // allows server to set secure cookies
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Backend returns: { message, token, user: { user_id, username, full_name, role } }
      const { token, user } = res.data;

      if (token) {
        // ✅ Store JWT token in HTTP cookie (secure, httpOnly-like behavior)
        // Set cookie with 15 minutes expiration (matching backend token expiry)
        Cookies.set('authToken', token, {
          expires: 15 / (24 * 60), // 15 minutes in days
          secure: process.env.NODE_ENV === 'production', // HTTPS only in production
          sameSite: 'strict', // CSRF protection
        });

        // Store user info in sessionStorage for quick access
        if (user) {
          sessionStorage.setItem("user", JSON.stringify(user));
          sessionStorage.setItem("role", user.role);
        }

        // ✅ Redirect to main dashboard after login
        navigate("/dashboard");
      } else {
        setError("Login failed. No token received from server.");
      }

    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Handle different error types
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setError("Cannot connect to server. Please make sure the backend server is running on port 5000.");
      } else if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const errorData = err.response.data;
        
        if (status === 500) {
          // Show the actual error message from backend
          const errorMsg = errorData?.error || errorData?.message || errorData?.errorType || "Unknown server error";
          setError(`Server error: ${errorMsg}. Check backend console for details.`);
        } else if (status === 401) {
          setError(errorData?.message || "Invalid username or password.");
        } else if (status === 400) {
          setError(errorData?.message || "Invalid request. Please check your input.");
        } else {
          setError(errorData?.message || errorData?.error || `Server error (${status}). Please try again.`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("No response from server. Please check if the backend server is running.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
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
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400 tracking-wide">
          Exam Dept Inventory System
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-300 px-3 py-2 mb-4 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00e0ff" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Login"}
        </motion.button>

        <div className="mt-4 text-sm text-center text-gray-300">
          <Link to="/forgot-password" className="hover:text-cyan-400 underline">
            Forgot password?
          </Link>
        </div>


      </motion.form>
    </div>
  );
}

