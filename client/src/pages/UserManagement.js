import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/axiosConfig";
import { Plus, X, Search, UserCheck, UserX } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterColumn, setFilterColumn] = useState("All Columns");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    role: "Staff",
  });
  const [inactiveUsers, setInactiveUsers] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const stored = localStorage.getItem("inactiveUsernames");
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Failed to parse inactive users from storage:", error);
      return [];
    }
  });

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/auth/users');
      const fetchedUsers = res.data || [];
      setUsers(fetchedUsers);

      setInactiveUsers((prev) => {
        const allowed = new Set(
          fetchedUsers.map((user) => (user.username || "").toLowerCase())
        );
        return prev.filter((name) => allowed.has(name));
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      console.error("Error details:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      if (err.response?.status === 401) {
        alert("Authentication required. Please login again.");
        window.location.href = '/login';
      } else if (err.response?.status === 403) {
        alert("You don't have permission to view users. Admin access required.");
      } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        alert("Cannot connect to backend server. Make sure it's running on port 5000.");
      } else {
        const errorMsg = err.response?.data?.message || "Failed to load users.";
        alert(errorMsg);
      }
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem("inactiveUsernames", JSON.stringify(inactiveUsers));
  }, [inactiveUsers]);

  // Filter users and compute status
  const filteredUsers = useMemo(() => {
    const searchLower = search.toLowerCase();

    return users
      .filter((user) => {
        if (!searchLower) return true;
        if (filterColumn === "All Columns") {
          return (
            user.username?.toLowerCase().includes(searchLower) ||
            user.full_name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.role?.toLowerCase().includes(searchLower)
          );
        }
        if (filterColumn === "Username") {
          return user.username?.toLowerCase().includes(searchLower);
        }
        if (filterColumn === "Full Name") {
          return user.full_name?.toLowerCase().includes(searchLower);
        }
        if (filterColumn === "Email") {
          return user.email?.toLowerCase().includes(searchLower);
        }
        if (filterColumn === "Role") {
          return user.role?.toLowerCase().includes(searchLower);
        }
        return true;
      })
      .map((user) => {
        const usernameKey = (user.username || "").toLowerCase();
        const backendFlag = user.is_active ?? user.isActive ?? user.active;
        const backendActive =
          backendFlag === undefined
            ? true
            : typeof backendFlag === "boolean"
            ? backendFlag
            : backendFlag === 1 || backendFlag === "1";

        const isActive =
          backendActive && !inactiveUsers.includes(usernameKey);

        return {
          ...user,
          __isActive: isActive,
        };
      });
  }, [users, search, filterColumn, inactiveUsers]);

  // Open modal for adding new user
  const openAddModal = () => {
    setNewUser({
      username: "",
      password: "",
      full_name: "",
      email: "",
      role: "Staff",
    });
    setIsModalOpen(true);
  };

  // Handle form submission (Create)
  const handleAddUser = async (e) => {
    e.preventDefault();

    // Validation
    if (!newUser.username.trim()) {
      return alert("Username is required.");
    }
    if (!newUser.full_name.trim()) {
      return alert("Full name is required.");
    }
    if (!newUser.role) {
      return alert("Role is required.");
    }
    if (!newUser.password || newUser.password.length < 6) {
      return alert("Password must be at least 6 characters long.");
    }
    if (newUser.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      return alert("Please enter a valid email address.");
    }

    try {
      const payload = {
        username: newUser.username.trim(),
        password: newUser.password,
        full_name: newUser.full_name.trim(),
        role: newUser.role,
        email: newUser.email.trim() || null,
      };

      const res = await api.post("/api/auth/register", payload);
      
      console.log("Register response:", res.data);
      
      // User created successfully - refresh the list and reset form
      alert("User created successfully!");
      const createdUsername = newUser.username.trim().toLowerCase();
      setIsModalOpen(false);
      setNewUser({
        username: "",
        password: "",
        full_name: "",
        email: "",
        role: "Staff",
      });

      setInactiveUsers((prev) =>
        prev.filter((name) => name !== createdUsername)
      );
      
      // Refresh users list from backend (similar to ItemMaster)
      await fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      console.error("Error response:", err.response);
      console.error("Error details:", err.response?.data);
      
      let errorMsg = "Failed to save user.";
      
      if (err.response) {
        // Server responded with error
        errorMsg = err.response.data?.message || err.response.data?.error || `Server error: ${err.response.status}`;
        console.error("Server error:", err.response.status, err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        errorMsg = "Cannot connect to backend server. Make sure it's running on port 5000.";
        console.error("No response received:", err.request);
      } else {
        // Error in request setup
        errorMsg = err.message || "Failed to save user.";
        console.error("Request setup error:", err.message);
      }
      
      alert(errorMsg);
    }
  };

  const handleToggleStatus = (user, nextStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to ${nextStatus ? "activate" : "deactivate"} "${user.username}"?`
      )
    ) {
      return;
    }

    const usernameKey = (user.username || "").toLowerCase();

    setInactiveUsers((prev) => {
      if (nextStatus) {
        return prev.filter((name) => name !== usernameKey);
      }
      if (prev.includes(usernameKey)) {
        return prev;
      }
      return [...prev, usernameKey];
    });

    alert(`User ${nextStatus ? "activated" : "deactivated"} successfully.`);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="h-5 w-5" />
          Add New User
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All Columns</option>
          <option>Username</option>
          <option>Full Name</option>
          <option>Email</option>
          <option>Role</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {users.length === 0
                      ? "No users found. Create a new user to get started."
                      : "No users match your search criteria."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isActive = user.__isActive ?? true;
                  return (
                    <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleToggleStatus(user, true)}
                          className={`flex items-center gap-1 text-green-600 hover:text-green-800 ${
                            isActive ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          title="Activate user"
                          disabled={isActive}
                        >
                          <UserCheck className="h-4 w-4" />
                          <span className="text-xs font-medium">Activate</span>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user, false)}
                          className={`flex items-center gap-1 text-red-600 hover:text-red-800 ${
                            !isActive ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          title="Deactivate user"
                          disabled={!isActive}
                        >
                          <UserX className="h-4 w-4" />
                          <span className="text-xs font-medium">Deactivate</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New User</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password (min 6 chars)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.full_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, full_name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email (optional)"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Please enter a valid email address (format: user@example.com)"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

