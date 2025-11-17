import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Plus, X } from "lucide-react";

export default function DepartmentMaster() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ dept_id: "", dept_name: "" });

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get('/api/departments');
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
      if (err.response?.status === 404 || err.code === 'ECONNREFUSED') {
        console.error("Backend server might not be running. Make sure it's started on port 5000.");
      }
      setDepartments([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Open modal and auto-generate next dept_id
  const openModal = () => {
    const nextId =
      departments.length > 0
        ? Math.max(...departments.map((d) => parseInt(d.dept_id || 0))) + 1
        : 1;
    setNewDept({ dept_id: nextId, dept_name: "" });
    setIsModalOpen(true);
  };

  // Add department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    
    // Validation - match backend requirements
    if (!newDept.dept_name || !newDept.dept_name.trim()) {
      return alert("Department name is required.");
    }

    try {
      // Prepare data - remove dept_id since it's auto-increment
      // Backend expects: { dept_name } (dept_id is auto-generated)
      const departmentToSave = {
        dept_name: newDept.dept_name.trim(),
      };

      // Create new department
      const res = await api.post('/api/departments', departmentToSave);
      console.log('Response:', res.data);
      alert("Department added successfully!");
      
      // Refresh the list to get the latest data
      await fetchDepartments();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      
      let errorMsg = "Failed to add department.";
      
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
        errorMsg = err.message || "Failed to add department.";
        console.error("Request setup error:", err.message);
      }
      
      alert(errorMsg);
    }
  };

  // Filter departments by search
  const filtered = departments.filter((d) =>
    Object.values(d).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Department Master</h1>
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border-b">Dept ID</th>
              <th className="p-3 border-b">Dept Name</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-3 border-b">{d.dept_id}</td>
                <td className="p-3 border-b">{d.dept_name}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-4">No departments found.</div>
        )}
      </div>

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Department
            </h2>

            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Department ID </label>
                <input
                  type="number"
                  value={newDept.dept_id}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={newDept.dept_name}
                  onChange={(e) => setNewDept({ ...newDept, dept_name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
              >
                Save Department
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
