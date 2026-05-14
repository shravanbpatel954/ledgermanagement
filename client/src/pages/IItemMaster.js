import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Plus, X, Edit, Trash2 } from "lucide-react";

export default function ItemMaster() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterColumn, setFilterColumn] = useState("All Columns");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItem, setNewItem] = useState({
    item_number: "",
    item_name: "",
    size: "",
    color: "",
  });

  const fetchItems = async () => {
    try {
      const res = await api.get("/api/items");
      setItems(res.data || []);
    } catch (err) {
      console.error("Error fetching items:", err.response || err.message);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItemId(null);
    let nextNumber = 1;
    if (items.length > 0) {
      const maxItemNumber = Math.max(
        ...items.map((i) => parseInt(i.item_number || i.item_id || 0, 10))
      );
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

  const openEditModal = (item) => {
    setEditingItemId(item.item_id);
    setNewItem({
      item_number: String(item.item_number || item.item_id),
      item_name: item.item_name || "",
      size: item.size || "",
      color: item.color || "",
    });
    setIsModalOpen(true);
  };

  const duplicateNameLocally = (name, excludeId) => {
    const n = name.trim().toLowerCase();
    if (!n) return false;
    return items.some((it) => {
      if (excludeId != null && String(it.item_id) === String(excludeId)) return false;
      return (it.item_name || "").trim().toLowerCase() === n;
    });
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();

    if (!newItem.item_name.trim()) return alert("Item name is required.");
    if (!/^[a-zA-Z0-9\s]+$/.test(newItem.item_name))
      return alert("Item name can only contain letters, numbers, and spaces.");
    if (newItem.size && !/^[a-zA-Z0-9\s]+$/.test(newItem.size))
      return alert("Size can only contain letters or numbers.");
    if (newItem.color && !/^[a-zA-Z\s]+$/.test(newItem.color))
      return alert("Color should contain only letters.");

    if (duplicateNameLocally(newItem.item_name, editingItemId)) {
      return alert(
        "Duplicate item name is not allowed. An item with this name already exists."
      );
    }

    const itemToSave = {
      item_name: newItem.item_name.trim(),
      size: newItem.size?.trim() || null,
      color: newItem.color?.trim() || null,
    };

    try {
      if (editingItemId) {
        await api.put(`/api/items/${editingItemId}`, itemToSave);
        alert("Item updated successfully!");
      } else {
        await api.post("/api/items", itemToSave);
        alert("Item added successfully!");
      }

      await fetchItems();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to save item.";
      alert(errorMsg);
    }
  };

  const handleDeleteItem = async (item) => {
    if (
      !window.confirm(
        `Delete item "${item.item_name}"? This cannot be undone if allowed.`
      )
    ) {
      return;
    }
    try {
      await api.delete(`/api/items/${item.item_id}`);
      alert("Item deleted successfully!");
      await fetchItems();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to delete item.";
      alert(errorMsg);
    }
  };

  const resetForm = () => {
    setNewItem({ item_number: "", item_name: "", size: "", color: "" });
    setEditingItemId(null);
  };

  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase();
    if (filterColumn === "All Columns") {
      return Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchText)
      );
    }
    return item[filterColumn]?.toString().toLowerCase().includes(searchText);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Item Master</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Items List</h2>

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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Item Number</th>
                <th className="p-3 border-b">Item Name</th>
                <th className="p-3 border-b">Size</th>
                <th className="p-3 border-b">Color</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.item_id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-3 border-b">{item.item_number}</td>
                  <td className="p-3 border-b">{item.item_name}</td>
                  <td className="p-3 border-b">{item.size || "—"}</td>
                  <td className="p-3 border-b">{item.color || "—"}</td>
                  <td className="p-3 border-b">
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item)}
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
          {filteredItems.length === 0 && (
            <div className="text-center text-gray-500 py-6">No items found.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingItemId ? "Edit Item" : "Add New Item"}
            </h2>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Item Number</label>
                <input
                  type="number"
                  value={newItem.item_number}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItem.item_name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, item_name: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Item names must be unique (case-insensitive).
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Size</label>
                <input
                  type="text"
                  value={newItem.size}
                  onChange={(e) =>
                    setNewItem({ ...newItem, size: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Color</label>
                <input
                  type="text"
                  value={newItem.color}
                  onChange={(e) =>
                    setNewItem({ ...newItem, color: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {editingItemId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
