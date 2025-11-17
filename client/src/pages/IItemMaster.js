import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Plus, X } from "lucide-react";

export default function ItemMaster() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterColumn, setFilterColumn] = useState("All Columns");

  // Modal state for Add/Edit Item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    item_number: "",
    item_name: "",
    size: "",
    color: "",
  });

  // Fetch items from the backend
  const fetchItems = async () => {
    try {
      const res = await api.get('/api/items');
      setItems(res.data || []);
    } catch (err) {
      console.error("Error fetching items:", err.response || err.message);
      if (err.response?.status === 404 || err.code === 'ECONNREFUSED') {
        console.error("Backend server might not be running. Make sure it's started on port 5000.");
      }
      setItems([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // When modal opens, auto-set next item_number
  const openAddModal = () => {
    let nextNumber = 1;
    if (items.length > 0) {
      // Get highest item_number
      const maxItemNumber = Math.max(...items.map((i) => parseInt(i.item_number || 0)));
      nextNumber = maxItemNumber + 1;
    }
    setNewItem({
      item_number: nextNumber.toString(),
      item_name: "",
      size: "",
      color: "",
    });
    setIsModalOpen(true);
  };

  // Handle adding a new item
  const handleAddItem = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newItem.item_name.trim()) return alert("Item name is required.");
    if (!/^[a-zA-Z0-9\s]+$/.test(newItem.item_name))
      return alert("Item name can only contain letters, numbers, and spaces.");
    if (newItem.size && !/^[a-zA-Z0-9\s]+$/.test(newItem.size))
      return alert("Size can only contain letters or numbers.");
    if (newItem.color && !/^[a-zA-Z\s]+$/.test(newItem.color))
      return alert("Color should contain only letters.");

    try {
      // Prepare data - remove item_number since it's auto-increment
      const itemToSave = {
        item_name: newItem.item_name.trim(),
        size: newItem.size?.trim() || null,
        color: newItem.color?.trim() || null,
      };

      // Create new item
      const res = await api.post('/api/items', itemToSave);
      console.log('Response:', res.data);
      alert("Item added successfully!");
      
      // Refresh the list to get the latest data
      await fetchItems();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      
      let errorMsg = "Failed to add item.";
      
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
        errorMsg = err.message || "Failed to add item.";
        console.error("Request setup error:", err.message);
      }
      
      alert(errorMsg);
    }
  };

  const resetForm = () => {
    setNewItem({ item_number: "", item_name: "", size: "", color: "" });
  };

  // Filter items based on search and selected column
  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase();
    if (filterColumn === "All Columns") {
      return Object.values(item).some((val) => val?.toString().toLowerCase().includes(searchText));
    }
    return item[filterColumn]?.toString().toLowerCase().includes(searchText);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Item Master</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Items List</h2>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search items..."
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
            <option value="item_number">Item Number</option>
            <option value="item_name">Item Name</option>
            <option value="size">Size</option>
            <option value="color">Color</option>
          </select>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Item Number</th>
                <th className="p-3 border-b">Item Name</th>
                <th className="p-3 border-b">Size</th>
                <th className="p-3 border-b">Color</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="p-3 border-b">{item.item_number}</td>
                  <td className="p-3 border-b">{item.item_name}</td>
                  <td className="p-3 border-b">{item.size}</td>
                  <td className="p-3 border-b">{item.color}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="text-center text-gray-500 py-6">No items found.</div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
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
              Add New Item
            </h2>

            <form onSubmit={handleAddItem} className="space-y-4">
              {/* Item Number (Auto-generated) */}
              <div>
                <label className="block text-gray-700 mb-1">Item Number </label>
                <input
                  type="number"
                  value={newItem.item_number}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItem.item_name}
                  onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-gray-700 mb-1">Size</label>
                <input
                  type="text"
                  value={newItem.size}
                  onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-gray-700 mb-1">Color</label>
                <input
                  type="text"
                  value={newItem.color}
                  onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
