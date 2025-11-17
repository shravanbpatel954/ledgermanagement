import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function BillLedger() {
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchBillSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/reports/bill-summary');
        setBillData(response.data || []);
      } catch (err) {
        console.error("Error fetching bill summary:", err);
        
        if (err.response?.status === 401) {
          alert("Authentication required. Please login again.");
          window.location.href = '/login';
        } else if (err.response?.status === 403) {
          alert("You don't have permission to access this data.");
        } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          alert("Cannot connect to backend server. Make sure it's running on port 5000.");
        } else {
          const errorMsg = err.response?.data?.message || "Failed to load bill summary.";
          setError(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBillSummary();
  }, []);

  const filteredBills = billData.filter((bill) => {
    if (statusFilter === "all") return true;
    const normalizedStatus = (bill.status || "").toLowerCase();
    if (statusFilter === "approved") {
      return normalizedStatus === "completed" || normalizedStatus === "approved";
    }
    if (statusFilter === "pending") {
      return normalizedStatus !== "completed" && normalizedStatus !== "approved";
    }
    return true;
  });

  // Sort bills by date (latest first)
  const sortedBills = [...filteredBills].sort((a, b) => {
    const dateA = a.bill_date ? new Date(a.bill_date).getTime() : 0;
    const dateB = b.bill_date ? new Date(b.bill_date).getTime() : 0;
    return dateB - dateA; // Latest first
  });

  // Export to CSV
  const exportToCSV = () => {
    if (!sortedBills || sortedBills.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Bill No.", "Vendor", "Bill Date", "Amount", "Status"];
    const rows = sortedBills.map(bill => [
      bill.bill_no || '-',
      bill.Vendor?.vendor_name || '-',
      bill.bill_date ? new Date(bill.bill_date).toLocaleDateString() : '-',
      parseFloat(bill.bill_amount || 0).toFixed(2),
      (bill.status || "Pending").toLowerCase() === "completed" ? "Approved" : (bill.status || "Pending")
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bill_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!sortedBills || sortedBills.length === 0) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text("Bill Summary Report", 14, 15);

    // Table data
    const tableData = sortedBills.map(bill => [
      bill.bill_no || '-',
      bill.Vendor?.vendor_name || '-',
      bill.bill_date ? new Date(bill.bill_date).toLocaleDateString() : '-',
      `₹${parseFloat(bill.bill_amount || 0).toFixed(2)}`,
      (bill.status || "Pending").toLowerCase() === "completed" ? "Approved" : (bill.status || "Pending")
    ]);

    doc.autoTable({
      startY: 25,
      head: [["Bill No.", "Vendor", "Bill Date", "Amount", "Status"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [249, 250, 251] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 50 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 }
      }
    });

    doc.save(`bill_ledger_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bill Summary</h1>
        <p className="text-gray-600 mt-1">Summary of all bills</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading bill summary...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Bill Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-col gap-3 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Bills</h2>
                <p className="text-sm text-gray-500">
                  Filter by pending or approved bills to review totals.
                </p>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer w-full md:w-auto"
              >
                <option value="all">All Bills</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium transition-colors"
                disabled={!sortedBills || sortedBills.length === 0}
              >
                Download CSV
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium transition-colors"
                disabled={!sortedBills || sortedBills.length === 0}
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
                    Bill No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedBills.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      {statusFilter === "all"
                        ? "No bills found."
                        : `No ${statusFilter} bills found.`}
                    </td>
                  </tr>
                ) : (
                  sortedBills.map((bill) => (
                    <tr key={bill.bill_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bill.bill_no || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.Vendor?.vendor_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.bill_date ? new Date(bill.bill_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{parseFloat(bill.bill_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            (bill.status || "").toLowerCase() === "completed" ||
                            (bill.status || "").toLowerCase() === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {(bill.status || "Pending").toLowerCase() === "completed"
                            ? "Approved"
                            : bill.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

