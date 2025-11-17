import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Plus, X } from "lucide-react";

export default function ChallanEntry() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [challans, setChallans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [poItems, setPoItems] = useState([]);
  const [itemSearches, setItemSearches] = useState({});

  const [challan, setChallan] = useState({
    challan_no: "",
    po_id: "",
    delivery_date: "",
  });

  const [challanItems, setChallanItems] = useState([{ item_id: "", quantity_received: "" }]);

  // Fetch Purchase Orders, Items, and Challans
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poRes, itemsRes, challansRes] = await Promise.all([
          api.get('/api/purchase-orders'),
          api.get('/api/items'),
          api.get('/api/challans'),
        ]);
        setPurchaseOrders(poRes.data || []);
        const sortedItems = (itemsRes.data || []).sort((a, b) => {
          const nameA = a.item_name || a.itemName || '';
          const nameB = b.item_name || b.itemName || '';
          return nameA.localeCompare(nameB);
        });
        setItems(sortedItems);
        setChallans(challansRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        console.error("Error details:", err.response?.data);
        console.error("Error status:", err.response?.status);
        console.error("Error message:", err.message);
        
        if (err.response?.status === 401) {
          alert("Authentication required. Please login again.");
          window.location.href = '/login';
        } else if (err.response?.status === 403) {
          alert("You don't have permission to access this data.");
        } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          alert("Cannot connect to backend server. Make sure it's running on port 5000.");
        } else {
          const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to load data. Please check if backend is running and try again.";
          alert(`Error: ${errorMsg}`);
        }
        // Set empty arrays to prevent further errors
        setPurchaseOrders([]);
        setItems([]);
        setChallans([]);
      }
    };
    fetchData();
  }, []);

  // When PO is selected, fetch its items
  const handlePOChange = async (poId) => {
    setChallan({ ...challan, po_id: poId });
    if (!poId) {
      setSelectedPO(null);
      setPoItems([]);
      setChallanItems([{ item_id: "", quantity_received: "" }]);
      return;
    }

    try {
      const res = await api.get(`/api/purchase-orders/${poId}`);
      const po = res.data;
      setSelectedPO(po);
      
      // Get items from PO with remaining quantities
      const itemsWithRemaining = po.PurchaseOrderItems?.map(poItem => ({
        item_id: poItem.item_id,
        item_name: poItem.Item?.item_name || '',
        quantity_ordered: poItem.quantity_ordered,
        quantity_received: poItem.quantity_received,
        remaining: poItem.quantity_ordered - poItem.quantity_received,
      })).filter(item => item.remaining > 0) || [];

      setPoItems(itemsWithRemaining);
      
      // Pre-populate challan items with remaining quantities
      if (itemsWithRemaining.length > 0) {
        setChallanItems(itemsWithRemaining.map(item => ({
          item_id: item.item_id.toString(),
          quantity_received: "",
        })));
      }
    } catch (err) {
      console.error("Error fetching PO details:", err);
      alert("Failed to load purchase order details.");
    }
  };

  // Calculate next challan number (previous + 1)
  const getNextChallanNo = () => {
    if (challans.length === 0) {
      return "1";
    }
    
    const numbers = challans
      .map(ch => {
        const match = ch.challan_no?.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => !isNaN(num) && num > 0);
    
    if (numbers.length === 0) {
      return "1";
    }
    
    const maxNumber = Math.max(...numbers);
    return (maxNumber + 1).toString();
  };

  // Open modal
  const openAddModal = () => {
    const nextChallanNo = getNextChallanNo();
    setChallan({ challan_no: nextChallanNo, po_id: "", delivery_date: "" });
    setSelectedPO(null);
    setPoItems([]);
    setChallanItems([{ item_id: "", quantity_received: "" }]);
    setIsModalOpen(true);
  };

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const updated = [...challanItems];
    updated[index][field] = value;
    setChallanItems(updated);
  };

  // Add/Remove item rows
  const addItemRow = () => {
    if (poItems.length > 0) {
      setChallanItems([...challanItems, { item_id: "", quantity_received: "" }]);
    }
  };

  const removeItemRow = (index) => {
    if (challanItems.length > 1) {
      setChallanItems(challanItems.filter((_, i) => i !== index));
    }
  };

  // Get remaining quantity for an item
  const getRemainingQty = (itemId) => {
    const poItem = poItems.find(item => item.item_id === parseInt(itemId));
    return poItem ? poItem.remaining : 0;
  };

  // Submit Challan
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!challan.challan_no || !challan.po_id || !challan.delivery_date) {
      return alert("Please fill all required fields.");
    }
    if (challanItems.length === 0 || challanItems.some(i => !i.item_id || !i.quantity_received)) {
      return alert("Please add at least one valid item with quantity received.");
    }

    // Validate quantities don't exceed remaining
    for (const item of challanItems) {
      const remaining = getRemainingQty(item.item_id);
      if (parseInt(item.quantity_received) > remaining) {
        return alert(`Quantity received for item cannot exceed remaining quantity (${remaining}).`);
      }
      if (parseInt(item.quantity_received) <= 0) {
        return alert("Quantity received must be greater than 0.");
      }
    }

    const payload = {
      ...challan,
      items: challanItems.map(i => ({
        item_id: parseInt(i.item_id),
        quantity_received: parseInt(i.quantity_received),
      })),
    };

    try {
      setLoading(true);
      await api.post('/api/challans', payload);
      alert("Challan created successfully!");
      setIsModalOpen(false);
      
      // Refresh data
      const [poRes, challansRes] = await Promise.all([
        api.get('/api/purchase-orders'),
        api.get('/api/challans'),
      ]);
      setPurchaseOrders(poRes.data || []);
      setChallans(challansRes.data || []);
      
      // Reset form
      setChallan({ challan_no: "", po_id: "", delivery_date: "" });
      setSelectedPO(null);
      setPoItems([]);
      setChallanItems([{ item_id: "", quantity_received: "" }]);
    } catch (err) {
      console.error("Error creating challan:", err);
      const errorMsg = err.response?.data?.message || "Failed to create Challan.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Challan Entry</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="h-5 w-5" />
          Create Challan
        </button>
      </div>

      {/* Challans List */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Challan No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {challans.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No challans found. Create a new one to get started.
                  </td>
                </tr>
              ) : (
                challans.map((ch) => (
                  <tr key={ch.challan_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ch.challan_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ch.PurchaseOrder?.purchase_no || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ch.delivery_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ch.User?.full_name || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Challan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">New Challan</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Challan No. *</label>
                  <input
                    type="text"
                    value={challan.challan_no}
                    onChange={(e) => setChallan({ ...challan, challan_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter challan number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Order *</label>
                  <select
                    value={challan.po_id}
                    onChange={(e) => handlePOChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    required
                  >
                    <option value="">Select PO</option>
                    {purchaseOrders
                      .filter(po => po.status === 'Pending Delivery')
                      .map(po => (
                        <option key={po.po_id} value={po.po_id}>
                          {po.purchase_no} - {po.Vendor?.vendor_name || po.Vendor?.vendorName || ''}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date *</label>
                  <input
                    type="date"
                    value={challan.delivery_date}
                    onChange={(e) => setChallan({ ...challan, delivery_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* PO Items Info */}
              {selectedPO && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>PO:</strong> {selectedPO.purchase_no} | 
                    <strong> Vendor:</strong> {selectedPO.Vendor?.vendor_name || '-'}
                  </p>
                </div>
              )}

              {/* Items List */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Items Received *</h3>
                  {poItems.length > 0 && (
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Plus className="h-4 w-4" /> Add Item
                    </button>
                  )}
                </div>

                {challanItems.map((item, index) => {
                  const remaining = getRemainingQty(item.item_id);
                  const filteredItems = poItems.filter(poItem => {
                    const itemDetail = items.find(i => i.item_id === poItem.item_id);
                    const searchTerm = (itemSearches[index] || "").toLowerCase();
                    const itemName = (itemDetail?.item_name || itemDetail?.itemName || "").toLowerCase();
                    return itemName.includes(searchTerm);
                  });
                  return (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3 items-end">
                      <div className="space-y-2">
                       
                        <select
                          value={item.item_id}
                          onChange={(e) => {
                            handleItemChange(index, "item_id", e.target.value);
                            setItemSearches({ ...itemSearches, [index]: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          required
                        >
                          <option value="">Select Item</option>
                          {filteredItems.map((poItem) => {
                            const itemDetail = items.find(i => i.item_id === poItem.item_id);
                            return (
                              <option key={poItem.item_id} value={poItem.item_id}>
                                {itemDetail?.item_name || itemDetail?.itemName || `Item ${poItem.item_id}`}
                                {itemDetail?.size && ` (${itemDetail.size})`}
                                {itemDetail?.color && ` - ${itemDetail.color}`}
                                {` (Remaining: ${poItem.remaining})`}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <input
                        type="number"
                        placeholder="Qty Received"
                        value={item.quantity_received}
                        onChange={(e) => handleItemChange(index, "quantity_received", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="1"
                        max={remaining}
                      />

                      {remaining > 0 && (
                        <span className="text-xs text-gray-500">Max: {remaining}</span>
                      )}

                      {challanItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

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
                  disabled={loading || !selectedPO}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Create Challan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

