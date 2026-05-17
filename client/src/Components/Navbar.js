import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/axiosConfig";
import { APP_SHORT, SHELL } from "../utils/branding";

export default function Navbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Get user info from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userRole = sessionStorage.getItem('role') || 'Staff';
  const userName = userInfo.full_name || userInfo.username || 'User';
  const [userEmail, setUserEmail] = useState(
    userInfo.email ||
      userInfo.Email ||
      userInfo.email_id ||
      userInfo.emailAddress ||
      ""
  );

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!userInfo?.user_id || userEmail || userRole !== "Admin") {
        return;
      }

      try {
        const response = await api.get("/api/auth/users");
        const users = Array.isArray(response.data) ? response.data : [];
        const currentUser = users.find(
          (user) =>
            user.user_id === userInfo.user_id ||
            user.username === userInfo.username
        );

        if (currentUser?.email) {
          const updatedUser = { ...userInfo, email: currentUser.email };
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
          setUserEmail(currentUser.email);
        }
      } catch (error) {
        console.warn("Unable to fetch user email:", error?.response?.status || error.message);
      }
    };

    fetchUserEmail();
  }, [userInfo, userEmail, userRole]);

  // Handle secure logout - clears all session data
  const handleLogout = () => {
    // Remove token from cookie
    Cookies.remove('authToken', { path: '/' });
    
    // Clear all sessionStorage
    sessionStorage.clear();
    
    // Clear any other potential storage
    localStorage.removeItem('authToken');
    
    // Redirect to login
    navigate('/login', { replace: true });
    
    // Force page reload to ensure all state is cleared
    window.location.href = '/login';
  };

  return (
    <nav className={`${SHELL.navbar} flex-shrink-0`}>
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className={SHELL.navbarTitle}>{APP_SHORT}</h1>
          <span className={SHELL.navbarAccent}>Exam Ledger Management</span>
        </div>

        {/* User Profile Section */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </div>
            <ChevronDownIcon
              className={`h-4 w-4 text-gray-600 transform transition ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">{userName}</p>
                {userEmail ? (
                  <p className="text-xs text-gray-500 mt-1">{userEmail}</p>
                ) : null}
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    userRole === "Admin"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-indigo-100 text-indigo-900"
                  }`}
                >
                  {userRole}
                </span>
              </div>
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
}

