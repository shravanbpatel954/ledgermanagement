import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ItemLedger() {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState(null);

  // Check if an item was selected from Stock Ledger
  useEffect(() => {
    const storedItemId = sessionStorage.getItem('selectedItemId');
    if (storedItemId) {
      setSelectedItemId(storedItemId);
      // Clear the stored item ID after using it
      sessionStorage.removeItem('selectedItemId');
    }
  }, []);

  // Fetch items for dropdown
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const response = await api.get('/api/items');
        const itemsData = response.data || [];
        const sortedItems = itemsData.sort((a, b) => {
          const nameA = a.item_name || a.itemName || '';
          const nameB = b.item_name || b.itemName || '';
          return nameA.localeCompare(nameB);
        });
        setItems(sortedItems);
      } catch (err) {
        console.error("Error fetching items:", err);
        
        if (err.response?.status === 401) {
          alert("Authentication required. Please login again.");
          window.location.href = '/login';
        } else if (err.response?.status === 403) {
          alert("You don't have permission to access this data.");
        } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          alert("Cannot connect to backend server. Make sure it's running on port 5000.");
        } else {
          const errorMsg = err.response?.data?.message || "Failed to load items.";
          setError(errorMsg);
        }
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, []);

  // Fetch item ledger when item is selected
  useEffect(() => {
    if (!selectedItemId) {
      setLedgerData(null);
      return;
    }

    const fetchItemLedger = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/reports/item-ledger/${selectedItemId}`);
        setLedgerData(response.data);
      } catch (err) {
        console.error("Error fetching item ledger:", err);
        
        if (err.response?.status === 401) {
          alert("Authentication required. Please login again.");
          window.location.href = '/login';
        } else if (err.response?.status === 403) {
          alert("You don't have permission to access this data.");
        } else if (err.response?.status === 404) {
          setError("Item not found.");
          setLedgerData(null);
        } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          alert("Cannot connect to backend server. Make sure it's running on port 5000.");
        } else {
          const errorMsg = err.response?.data?.message || "Failed to load item ledger.";
          setError(errorMsg);
          setLedgerData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItemLedger();
  }, [selectedItemId]);

  // Sort ledger data by date (latest first)
  const sortedLedger = ledgerData?.ledger ? [...ledgerData.ledger].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA; // Latest first
  }) : [];

  // Export to CSV
  const exportToCSV = () => {
    if (!sortedLedger || sortedLedger.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Date", "Type", "Details", "Quantity", "Issued By"];
    const rows = sortedLedger.map(entry => [
      entry.date ? new Date(entry.date).toLocaleDateString() : '-',
      entry.type || '-',
      entry.details || '-',
      entry.quantity || '-',
      entry.issuedBy || entry.receivedBy || '-'
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `item_ledger_${ledgerData?.item_details?.item_name || 'export'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!sortedLedger || sortedLedger.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text("Item Ledger Report", 14, 15);
    
    // Item Details
    doc.setFontSize(12);
    doc.text(`Item: ${ledgerData?.item_details?.item_name || '-'}`, 14, 25);
    doc.text(`Size: ${ledgerData?.item_details?.size || '-'}`, 14, 30);
    doc.text(`Color: ${ledgerData?.item_details?.color || '-'}`, 14, 35);

    // Table data
    const tableData = sortedLedger.map(entry => [
      entry.date ? new Date(entry.date).toLocaleDateString() : '-',
      entry.type || '-',
      entry.details || '-',
      entry.quantity || '-',
      entry.issuedBy || entry.receivedBy || '-'
    ]);

    doc.autoTable({
      startY: 40,
      head: [["Date", "Type", "Details", "Quantity", "Issued By"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [249, 250, 251] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 60 },
        3: { cellWidth: 25 },
        4: { cellWidth: 40 }
      }
    });

    doc.save(`item_ledger_${ledgerData?.item_details?.item_name || 'export'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Item Ledger</h1>
        <p className="text-gray-600 mt-1">View transaction history for an item</p>
      </div>

      {/* Item Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Item *
        </label>
        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          disabled={loadingItems}
        >
          <option value="">-- Select an Item --</option>
          {items.map((item) => (
            <option key={item.item_id} value={item.item_id}>
              {item.item_name || item.itemName || `Item ${item.item_id}`}
              {item.size && ` (${item.size})`}
              {item.color && ` - ${item.color}`}
            </option>
          ))}
        </select>
        {loadingItems && (
          <p className="text-sm text-gray-500 mt-2">Loading items...</p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading item ledger...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Item Details and Ledger */}
      {!loading && ledgerData && (
        <>
          {/* Item Details Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Item Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Item Name</p>
                <p className="text-base font-medium text-gray-900">
                  {ledgerData.item_details?.item_name || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Size</p>
                <p className="text-base font-medium text-gray-900">
                  {ledgerData.item_details?.size || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="text-base font-medium text-gray-900">
                  {ledgerData.item_details?.color || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-800">Transaction Ledger</h2>
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium transition-colors"
                  disabled={!sortedLedger || sortedLedger.length === 0}
                >
                  Download CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium transition-colors"
                  disabled={!sortedLedger || sortedLedger.length === 0}
                >
                  Download PDF
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issued By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedLedger && sortedLedger.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No transactions found for this item.
                      </td>
                    </tr>
                  ) : (
                    sortedLedger?.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.date ? new Date(entry.date).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            entry.type === 'INCOMING'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.type || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {entry.details || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          <span className={
                            entry.quantity?.startsWith('+')
                              ? 'text-green-600'
                              : 'text-red-600'
                          }>
                            {entry.quantity || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.issuedBy || entry.receivedBy || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* No Item Selected State */}
      {!loading && !ledgerData && !selectedItemId && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">Please select an item to view its ledger.</p>
        </div>
      )}
    </div>
  );
}

