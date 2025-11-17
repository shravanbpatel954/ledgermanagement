import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Plus, X } from "lucide-react";

export default function PurchaseEntry() {
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [purchase, setPurchase] = useState({
    purchase_no: "",
    vendor_id: "",
    order_date: "",
    remarks: "",
  });

  const [poItems, setPoItems] = useState([{ item_id: "", quantity_ordered: "" }]);

  // Fetch Vendors, Items, and Purchase Orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsRes, itemsRes, poRes] = await Promise.all([
          api.get('/api/vendors'),
          api.get('/api/items'),
          api.get('/api/purchase-orders'),
        ]);
        
        // Handle vendors - check both vendor_name and vendorName
        const vendorsData = vendorsRes.data || [];
        const sortedVendors = vendorsData.sort((a, b) => {
          const nameA = a.vendor_name || a.vendorName || '';
          const nameB = b.vendor_name || b.vendorName || '';
          return nameA.localeCompare(nameB);
        });
        setVendors(sortedVendors);
        
        // Handle items
        const itemsData = itemsRes.data || [];
        const sortedItems = itemsData.sort((a, b) => {
          const nameA = a.item_name || a.itemName || '';
          const nameB = b.item_name || b.itemName || '';
          return nameA.localeCompare(nameB);
        });
        setItems(sortedItems);
        
        // Sort purchase orders by order_date descending (newest first)
        const sortedPOs = (poRes.data || []).sort((a, b) => 
          new Date(b.order_date) - new Date(a.order_date)
        );
        setPurchaseOrders(sortedPOs);
      } catch (err) {
        console.error("Error fetching data:", err);
        console.error("Error details:", err.response?.data);
        console.error("Error status:", err.response?.status);
        
        if (err.response?.status === 401) {
          alert("Authentication required. Please login again.");
          // Optionally redirect to login
          window.location.href = '/login';
        } else if (err.response?.status === 403) {
          alert("You don't have permission to access this data.");
        } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          alert("Cannot connect to backend server. Make sure it's running on port 5000.");
        } else {
          const errorMsg = err.response?.data?.message || "Failed to load data. Please check if backend is running and try again.";
          alert(errorMsg);
        }
      }
    };
    fetchData();
  }, []);

  // Calculate next purchase number (previous + 1)
  const getNextPurchaseNo = () => {
    if (purchaseOrders.length === 0) {
      return "1";
    }
    
    // Extract numbers from purchase_no fields
    const numbers = purchaseOrders
      .map(po => {
        const match = po.purchase_no.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => !isNaN(num) && num > 0);
    
    if (numbers.length === 0) {
      return "1";
    }
    
    const maxNumber = Math.max(...numbers);
    return (maxNumber + 1).toString();
  };

  // Modal Open -> Set default purchase number (previous + 1)
  const openAddModal = () => {
    const nextPurchaseNo = getNextPurchaseNo();
    setPurchase({ purchase_no: nextPurchaseNo, vendor_id: "", order_date: "", remarks: "" });
    setPoItems([{ item_id: "", quantity_ordered: "" }]);
    setIsModalOpen(true);
  };

  // Add/Remove item rows
  const addItemRow = () => setPoItems([...poItems, { item_id: "", quantity_ordered: "" }]);
  const removeItemRow = (index) => setPoItems(poItems.filter((_, i) => i !== index));
  const handleItemChange = (index, field, value) => {
    const updated = [...poItems];
    updated[index][field] = value;
    setPoItems(updated);
  };

  // Submit Purchase Order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purchase.purchase_no || !purchase.vendor_id || !purchase.order_date) {
      return alert("Please fill required fields.");
    }
    if (poItems.length === 0 || poItems.some(i => !i.item_id || !i.quantity_ordered)) {
      return alert("Please add at least one valid item with quantity.");
    }

    const payload = {
      ...purchase,
      items: poItems.map(i => ({
        item_id: parseInt(i.item_id),
        quantity_ordered: parseInt(i.quantity_ordered),
      })),
    };

    try {
      setLoading(true);
      await api.post('/api/purchase-orders', payload);
      alert("Purchase Order created successfully!");
      setIsModalOpen(false);
      // Refresh purchase orders list
      const res = await api.get('/api/purchase-orders');
      const sortedPOs = (res.data || []).sort((a, b) => 
        new Date(b.order_date) - new Date(a.order_date)
      );
      setPurchaseOrders(sortedPOs);
      // Reset form
      setPurchase({ purchase_no: "", vendor_id: "", order_date: "", remarks: "" });
      setPoItems([{ item_id: "", quantity_ordered: "" }]);
    } catch (err) {
      console.error("Error creating purchase order:", err);
      const errorMsg = err.response?.data?.message || "Failed to create Purchase Order.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchase Entry</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="h-5 w-5" />
          Create Purchase Order
        </button>
      </div>

      {/* Purchase Orders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No purchase orders found. Create a new one to get started.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((po) => (
                  <tr key={po.po_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{po.purchase_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {po.Vendor?.vendor_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(po.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        po.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {po.User?.full_name || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">New Purchase Order</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Header Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase No. *</label>
                  <input
                    type="text"
                    value={purchase.purchase_no}
                    onChange={(e) => setPurchase({ ...purchase, purchase_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter purchase number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
                  <select
                    value={purchase.vendor_id}
                    onChange={(e) => setPurchase({ ...purchase, vendor_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    required
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map(v => (
                      <option key={v.vendor_id} value={v.vendor_id}>
                        {v.vendor_name || v.vendorName || `Vendor ${v.vendor_id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Date *</label>
                  <input
                    type="date"
                    value={purchase.order_date}
                    onChange={(e) => setPurchase({ ...purchase, order_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    value={purchase.remarks}
                    onChange={(e) => setPurchase({ ...purchase, remarks: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
              </div>

              {/* Item List */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Items *</h3>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Plus className="h-4 w-4" /> Add Item
                  </button>
                </div>

                {poItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 items-end">
                    <select
                      value={item.item_id}
                      onChange={(e) => handleItemChange(index, "item_id", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                      required
                    >
                      <option value="">Select Item</option>
                      {items.map(i => (
                        <option key={i.item_id} value={i.item_id}>
                          {i.item_name || i.itemName || `Item ${i.item_id}`} 
                          {i.size && ` (${i.size})`} 
                          {i.color && ` - ${i.color}`}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity_ordered}
                      onChange={(e) => handleItemChange(index, "quantity_ordered", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="1"
                    />

                    {poItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Create Purchase Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
