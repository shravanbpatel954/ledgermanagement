import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import {
  todayLocalDateInputValue,
  clampDateInputToMin,
} from "../utils/dateInputHelpers";
import { CheckCircle2, Clock, Plus, X } from "lucide-react";

export default function BillEntry() {
  const [vendors, setVendors] = useState([]);
  const [challans, setChallans] = useState([]);
  const [bills, setBills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approvingBillId, setApprovingBillId] = useState(null);
  const [selectedChallans, setSelectedChallans] = useState([]);
  const [billItems, setBillItems] = useState([]);

  const [billStatusFilter, setBillStatusFilter] = useState("all");
  const [bill, setBill] = useState({
    bill_no: "",
    vendor_id: "",
    bill_for: "challan",
    bill_date: "",
  });

  const userRole = (
    sessionStorage.getItem("role") ||
    JSON.parse(sessionStorage.getItem("user") || "{}")?.role ||
    "Staff"
  ).toLowerCase();

  const fetchBills = async () => {
    const res = await api.get('/api/bills');
    setBills(res.data || []);
  };

  // Fetch Vendors, Challans, and Bills
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorsRes, challansRes, billsRes] = await Promise.all([
          api.get('/api/vendors'),
          api.get('/api/challans/unlinked'),
          api.get('/api/bills'),
        ]);
        const sortedVendors = (vendorsRes.data || []).sort((a, b) => {
          const nameA = a.vendor_name || a.vendorName || '';
          const nameB = b.vendor_name || b.vendorName || '';
          return nameA.localeCompare(nameB);
        });
        setVendors(sortedVendors);
        setChallans(challansRes.data || []);
        setBills(billsRes.data || []);
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
        setVendors([]);
        setChallans([]);
        setBills([]);
      }
    };
    fetchData();
  }, []);

  // When challans are selected, fetch items summary
  const handleChallansChange = async (challanIds) => {
    setSelectedChallans(challanIds);
    
    if (challanIds.length === 0) {
      setBillItems([]);
      return;
    }

    try {
      const idsString = challanIds.join(',');
      const res = await api.get(`/api/challans/items-summary/query?challan_ids=${idsString}`);
      const itemsSummary = res.data || [];
      
      // Initialize bill items with quantities from challans
      setBillItems(itemsSummary.map(item => ({
        item_id: item.item_id,
        item_name: item.item_name,
        size: item.size,
        color: item.color,
        quantity: item.total_quantity,
        rate: "",
      })));
    } catch (err) {
      console.error("Error fetching challan items:", err);
      alert("Failed to load items from selected challans.");
    }
  };

  // Calculate next bill number (previous + 1)
  const getNextBillNo = () => {
    if (bills.length === 0) {
      return "1";
    }
    
    const numbers = bills
      .map(b => {
        const match = b.bill_no?.match(/(\d+)$/);
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
    const nextBillNo = getNextBillNo();
    setBill({
      bill_no: nextBillNo,
      vendor_id: "",
      bill_for: "challan",
      bill_date: todayLocalDateInputValue(),
    });
    setSelectedChallans([]);
    setBillItems([]);
    setIsModalOpen(true);
  };

  // Handle rate change
  const handleRateChange = (index, rate) => {
    const updated = [...billItems];
    updated[index].rate = rate;
    setBillItems(updated);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return billItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return sum + (qty * rate);
    }, 0);
  };

  // Submit Bill
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bill.bill_no || !bill.vendor_id || !bill.bill_for || !bill.bill_date) {
      return alert("Please fill all required fields.");
    }
    const today = todayLocalDateInputValue();
    if (bill.bill_date < today) {
      return alert("Bill date cannot be in the past.");
    }
    if (selectedChallans.length === 0) {
      return alert("Please select at least one challan.");
    }
    if (billItems.length === 0 || billItems.some(i => !i.rate || parseFloat(i.rate) <= 0)) {
      return alert("Please enter valid rates for all items.");
    }

    const payload = {
      ...bill,
      challan_ids: selectedChallans.map(id => parseInt(id)),
      items: billItems.map(item => ({
        item_id: item.item_id,
        quantity: item.quantity,
        rate: parseFloat(item.rate),
      })),
    };

    try {
      setLoading(true);
      await api.post('/api/bills', payload);
      alert("Bill created successfully!");
      setIsModalOpen(false);
      
      // Refresh bills list
      await fetchBills();
      
      // Reset form
      setBill({
        bill_no: "",
        vendor_id: "",
        bill_for: "challan",
        bill_date: todayLocalDateInputValue(),
      });
      setSelectedChallans([]);
      setBillItems([]);
    } catch (err) {
      console.error("Error creating bill:", err);
      const errorMsg = err.response?.data?.message || "Failed to create Bill.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBill = async (billId) => {
    if (!billId) return;

    if (!window.confirm("Approve this bill? This action cannot be undone.")) {
      return;
    }

    try {
      setApprovingBillId(billId);
      await api.put(`/api/bills/${billId}/complete`);
      await fetchBills();
      alert("Bill approved.");
    } catch (err) {
      console.error("Error approving bill:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update bill.";
      alert(message);
    } finally {
      setApprovingBillId(null);
    }
  };

  const filteredBills = bills.filter((billRecord) => {
    if (billStatusFilter === "all") return true;
    const normalizedStatus = (billRecord.status || "").toLowerCase();
    if (billStatusFilter === "approved") {
      return normalizedStatus === "completed" || normalizedStatus === "approved";
    }
    if (billStatusFilter === "pending") {
      return normalizedStatus !== "completed" && normalizedStatus !== "approved";
    }
    return true;
  });


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bill Entry</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="h-5 w-5" />
          Create Bill
        </button>
      </div>

      {/* Bills List */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Bills</h2>
            <p className="text-sm text-gray-500">
              Track bills created against challans and manage approvals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={billStatusFilter}
              onChange={(e) => setBillStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="all">All Bills</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                {userRole === "admin" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={userRole === "admin" ? 7 : 6} className="px-6 py-4 text-center text-gray-500">
                    {billStatusFilter === "all"
                      ? "No bills found. Create a new one to get started."
                      : `No ${billStatusFilter} bills found.`}
                  </td>
                </tr>
              ) : (
                filteredBills.map((b) => (
                  <tr key={b.bill_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.bill_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {b.Vendor?.vendor_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(b.bill_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{parseFloat(b.bill_amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const isApproved = b.status === "Completed" || b.status === "Approved";
                        const pillLabel = isApproved ? "Approved" : "Pending";
                        return (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          isApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {isApproved ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                        {pillLabel}
                      </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {b.User?.full_name || "-"}
                    </td>
                    {userRole === "admin" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleApproveBill(b.bill_id)}
                          disabled={
                            b.status === "Completed" ||
                            b.status === "Approved" ||
                            approvingBillId === b.bill_id
                          }
                          className={`px-3 py-1 rounded-lg border text-sm font-medium transition ${
                            b.status === "Completed" || b.status === "Approved"
                              ? "border-gray-300 text-gray-400 cursor-not-allowed"
                              : "border-green-600 text-green-700 hover:bg-green-50"
                          }`}
                        >
                          {approvingBillId === b.bill_id
                            ? "Updating..."
                            : b.status === "Completed" || b.status === "Approved"
                            ? "Approved"
                            : "Approve Bill"}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">New Bill</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bill No. *</label>
                  <input
                    type="text"
                    value={bill.bill_no}
                    onChange={(e) => setBill({ ...bill, bill_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter bill number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
                  <select
                    value={bill.vendor_id}
                    onChange={(e) => {
                      setBill({ ...bill, vendor_id: e.target.value });
                      setSelectedChallans([]);
                      setBillItems([]);
                    }}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bill Date *</label>
                  <input
                    type="date"
                    value={bill.bill_date}
                    min={todayLocalDateInputValue()}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        bill_date: clampDateInputToMin(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Select Challans */}
              {bill.vendor_id && bill.bill_for === "challan" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Challans *</label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {challans.map(ch => (
                      <label key={ch.challan_id} className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={selectedChallans.includes(ch.challan_id)}

                          onChange={(e) => {
                            if (e.target.checked) {
                              handleChallansChange([...selectedChallans, ch.challan_id]);
                            } else {
                              const newIds = selectedChallans.filter(id => id !== ch.challan_id);
                              handleChallansChange(newIds);
                            }
                          }}
                          
                          className="rounded"
                        />
                        <span className="text-sm">
                          {ch.challan_no} - {new Date(ch.delivery_date).toLocaleDateString()}
                        </span>
                      </label>
                    ))}
                    {challans.length === 0 && (
                      <p className="text-sm text-gray-500">No challans available</p>
                    )}
                  </div>
                </div>
              )}

              {bill.vendor_id && bill.bill_for !== "challan" && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                  Challan-based item linking is disabled for the selected bill type. Ensure the bill details are documented manually after saving.
                </div>
              )}

              {/* Bill Items */}
              {billItems.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Items & Rates *</h3>
                  <div className="space-y-2">
                    {billItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded">
                        <div className="col-span-5 text-sm">
                          {item.item_name} {item.size && `(${item.size})`} {item.color && `- ${item.color}`}
                        </div>
                        <div className="col-span-2 text-sm text-gray-600">Qty: {item.quantity}</div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            placeholder="Rate"
                            value={item.rate}
                            onChange={(e) => handleRateChange(index, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            step="0.01"
                            min="0.01"
                          />
                        </div>
                        <div className="col-span-2 text-sm font-semibold">
                          ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Total Amount:</span>
                      <span className="text-xl font-bold text-blue-600">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

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
                  disabled={loading || billItems.length === 0}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Create Bill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

