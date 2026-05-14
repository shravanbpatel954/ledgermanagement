import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Plus, X, Edit, Trash2 } from "lucide-react";

export default function DepartmentMaster() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [newDept, setNewDept] = useState({ dept_id: "", dept_name: "" });

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/api/departments");
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setEditingDeptId(null);
    const nextId =
      departments.length > 0
        ? Math.max(...departments.map((d) => parseInt(d.dept_id || 0, 10))) + 1
        : 1;
    setNewDept({ dept_id: nextId, dept_name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDeptId(dept.dept_id);
    setNewDept({
      dept_id: String(dept.dept_id),
      dept_name: dept.dept_name || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();

    if (!newDept.dept_name || !newDept.dept_name.trim()) {
      return alert("Department name is required.");
    }

    const payload = { dept_name: newDept.dept_name.trim() };

    try {
      if (editingDeptId) {
        await api.put(`/api/departments/${editingDeptId}`, payload);
        alert("Department updated successfully!");
      } else {
        await api.post("/api/departments", payload);
        alert("Department added successfully!");
      }

      await fetchDepartments();
      setEditingDeptId(null);
      setIsModalOpen(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save department.";
      alert(errorMsg);
    }
  };

  const handleDeleteDepartment = async (dept) => {
    if (
      !window.confirm(
        `Delete department "${dept.dept_name}"? This cannot be undone if allowed.`
      )
    ) {
      return;
    }
    try {
      await api.delete(`/api/departments/${dept.dept_id}`);
      alert("Department deleted successfully!");
      await fetchDepartments();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to delete department.";
      alert(errorMsg);
    }
  };

  const filtered = departments.filter((d) =>
    Object.values(d).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Department Master</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <div className="bg-white shadow rounded-xl p-6">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border-b">Dept ID</th>
              <th className="p-3 border-b">Dept Name</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.dept_id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{d.dept_id}</td>
                <td className="p-3 border-b">{d.dept_name}</td>
                <td className="p-3 border-b">
                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => openEditModal(d)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDepartment(d)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-4">No departments found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingDeptId ? "Edit Department" : "Add New Department"}
            </h2>

            <form onSubmit={handleSaveDepartment} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Department ID</label>
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
                  onChange={(e) =>
                    setNewDept({ ...newDept, dept_name: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  {editingDeptId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
