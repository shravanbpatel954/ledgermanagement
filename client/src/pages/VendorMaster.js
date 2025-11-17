import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Edit, Trash2, Plus, X } from "lucide-react";

export default function VendorMaster() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [filterColumn, setFilterColumn] = useState("All Columns");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState(null);
  const [newVendor, setNewVendor] = useState({
    vendor_id: "",
    vendor_name: "",
    address: "",
    phone_number: "",
    email: "",
    contact_person: "",
    gst_number: "",
  });

  // Fetch all vendors from backend
  const fetchVendors = async () => {
    try {
      const res = await api.get('/api/vendors');
      setVendors(res.data || []);
    } catch (err) {
      console.error("Error fetching vendors:", err.response || err.message);
      if (err.response?.status === 404 || err.code === 'ECONNREFUSED') {
        console.error("Backend server might not be running. Make sure it's started on port 5000.");
      }
      setVendors([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Auto-set vendor_id when opening modal
  const openAddModal = () => {
    setEditingVendorId(null);
    let nextId = 1;
    if (vendors.length > 0) {
      const maxId = Math.max(...vendors.map((v) => parseInt(v.vendor_id || 0)));
      nextId = maxId + 1;
    }

    setNewVendor({
      vendor_id: nextId.toString(),
      vendor_name: "",
      address: "",
      phone_number: "",
      email: "",
      contact_person: "",
      gst_number: "",
    });

    setIsModalOpen(true);
  };

  // Handle form submission
  const handleAddVendor = async (e) => {
    e.preventDefault();

    // Validation - match backend requirements
    if (!newVendor.vendor_name.trim()) {
      return alert("Vendor name is required.");
    }
    
    // GST number is required by backend
    if (!newVendor.gst_number || !newVendor.gst_number.trim()) {
      return alert("GST Number is required.");
    }
    if (!/^[A-Z0-9]{15}$/i.test(newVendor.gst_number.trim())) {
      return alert("GST Number should be exactly 15 alphanumeric characters.");
    }

    // Optional field validations (only if provided)
    if (newVendor.phone_number && newVendor.phone_number.trim() && !newVendor.phone_number.match(/^[0-9]{10}$/)) {
      return alert("Phone number must be a 10-digit number.");
    }
    if (newVendor.email && newVendor.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newVendor.email.trim())) {
      return alert("Invalid email address.");
    }

    try {
      // Prepare data to match backend expectations
      // Backend accepts: vendor_name, gst_number (or gst_no), phone_number (or phone), email, address, contact_person
      const vendorToSave = {
        vendor_name: newVendor.vendor_name.trim(),
        gst_number: newVendor.gst_number.trim(), // Required by backend
        address: newVendor.address?.trim() || null,
        phone_number: newVendor.phone_number?.trim() || null,
        email: newVendor.email?.trim() || null,
        contact_person: newVendor.contact_person?.trim() || null,
      };

      if (editingVendorId) {
        // Update existing vendor
        await api.put(`/api/vendors/${editingVendorId}`, vendorToSave);
        alert("Vendor updated successfully!");
      } else {
        // Create new vendor
        const res = await api.post('/api/vendors', vendorToSave);
        console.log('Response:', res.data);
        alert("Vendor added successfully!");
      }
      
      // Refresh the list to get the latest data
      await fetchVendors();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      
      let errorMsg = "Failed to add vendor.";
      
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
        errorMsg = err.message || "Failed to add vendor.";
        console.error("Request setup error:", err.message);
      }
      
      alert(errorMsg);
    }
  };

  const resetForm = () => {
    setNewVendor({
      vendor_id: "",
      vendor_name: "",
      address: "",
      phone_number: "",
      email: "",
      contact_person: "",
      gst_number: "",
    });
    setEditingVendorId(null);
  };

  // Handle editing a vendor
  const handleEditVendor = (vendor) => {
    setEditingVendorId(vendor.vendor_id);
    setNewVendor({
      vendor_id: vendor.vendor_id.toString(),
      vendor_name: vendor.vendor_name,
      address: vendor.address || "",
      phone_number: vendor.phone_number || vendor.phone || "",
      email: vendor.email || "",
      contact_person: vendor.contact_person || "",
      gst_number: vendor.gst_number || vendor.gst_no || "",
    });
    setIsModalOpen(true);
  };

  // Handle deleting a vendor
  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) {
      return;
    }

    try {
      await api.delete(`/api/vendors/${vendorId}`);
      alert("Vendor deleted successfully!");
      await fetchVendors(); // Refresh the list
    } catch (err) {
      console.error("Error deleting vendor:", err);
      const errorMsg = err.response?.data?.message || "Failed to delete vendor.";
      alert(errorMsg);
    }
  };

  // Filtering logic
  const filteredVendors = vendors.filter((vendor) => {
    const searchText = search.toLowerCase();
    if (filterColumn === "All Columns") {
      return Object.values(vendor)
        .join(" ")
        .toLowerCase()
        .includes(searchText);
    } else {
      return vendor[filterColumn]
        ?.toString()
        .toLowerCase()
        .includes(searchText);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Vendor Master</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <Plus size={18} /> Add Vendor
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Vendors List</h2>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterColumn}
            onChange={(e) => setFilterColumn(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Columns</option>
            <option value="vendor_id">Vendor ID</option>
            <option value="vendor_name">Vendor Name</option>
            <option value="address">Address</option>
            <option value="phone_number">Phone Number</option>
            <option value="email">Email</option>
            <option value="contact_person">Contact Person</option>
            <option value="gst_number">GST Number</option>
          </select>
        </div>

        {/* Table of Vendors */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Vendor ID</th>
                <th className="p-3 border-b">Vendor Name</th>
                <th className="p-3 border-b">Address</th>
                <th className="p-3 border-b">Phone Number</th>
                <th className="p-3 border-b">Contact Person</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">GST Number</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-3 border-b">{vendor.vendor_id}</td>
                  <td className="p-3 border-b">{vendor.vendor_name}</td>
                  <td className="p-3 border-b">{vendor.address}</td>
                  <td className="p-3 border-b">{vendor.phone_number}</td>
                  <td className="p-3 border-b">{vendor.contact_person}</td>
                  <td className="p-3 border-b">{vendor.email}</td>
                  <td className="p-3 border-b">{vendor.gst_number}</td>
                  <td className="p-3 border-b text-center flex justify-center gap-3">
                    <button 
                      onClick={() => handleEditVendor(vendor)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteVendor(vendor.vendor_id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVendors.length === 0 && (
            <div className="text-center text-gray-500 py-6">No vendors found.</div>
          )}
        </div>
      </div>

      {/* Add Vendor Modal */}
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
              {editingVendorId ? "Edit Vendor" : "Add New Vendor"}
            </h2>

            <form onSubmit={handleAddVendor} className="space-y-4">
              {/* Vendor ID (auto-generated) */}
              <div>
                <label className="block text-gray-700 mb-1">Vendor ID </label>
                <input
                  type="number"
                  value={newVendor.vendor_id}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Vendor Name */}
              <div>
                <label className="block text-gray-700 mb-1">Vendor Name</label>
                <input
                  type="text"
                  value={newVendor.vendor_name}
                  onChange={(e) => setNewVendor({ ...newVendor, vendor_name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newVendor.phone_number}
                  onChange={(e) => setNewVendor({ ...newVendor, phone_number: e.target.value })}
                  maxLength="10"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={newVendor.contact_person}
                  onChange={(e) => setNewVendor({ ...newVendor, contact_person: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* GST Number - Required by backend */}
              <div>
                <label className="block text-gray-700 mb-1">GST Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newVendor.gst_number}
                  onChange={(e) => setNewVendor({ ...newVendor, gst_number: e.target.value.toUpperCase() })}
                  maxLength="15"
                  required
                  placeholder="15 alphanumeric characters"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Required: Exactly 15 alphanumeric characters</p>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
