import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as XLSX from "xlsx";

export default function BillLedger() {
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const filteredBillsByStatus = billData.filter((bill) => {
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

  // Apply start/end date filter
  const filteredBills = filteredBillsByStatus.filter((bill) => {
    if (!bill.bill_date) return !startDate && !endDate;
    const billTime = new Date(bill.bill_date).getTime();
    if (startDate && billTime < new Date(startDate).getTime()) return false;
    if (endDate && billTime > new Date(endDate).getTime()) return false;
    return true;
  });

  // Sort bills by date (latest first)
  const sortedBills = [...filteredBills].sort((a, b) => {
    const dateA = a.bill_date ? new Date(a.bill_date).getTime() : 0;
    const dateB = b.bill_date ? new Date(b.bill_date).getTime() : 0;
    return dateB - dateA; // Latest first
  });

  // Export to Excel
  const exportToExcel = () => {
    if (!sortedBills || sortedBills.length === 0) {
      alert("No data to export");
      return;
    }

    const worksheetData = sortedBills.map((bill) => ({
      "Bill No.": bill.bill_no || "-",
      Vendor: bill.Vendor?.vendor_name || "-",
      "Bill Date": bill.bill_date
        ? new Date(bill.bill_date).toLocaleDateString()
        : "-",
      Amount: parseFloat(bill.bill_amount || 0).toFixed(2),
      Status:
        (bill.status || "Pending").toLowerCase() === "completed"
          ? "Approved"
          : bill.status || "Pending",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bill Ledger");

    const workbookBlob = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([workbookBlob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `bill_ledger_${new Date().toISOString().split("T")[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF using pdf-lib
  const exportToPDF = async () => {
    if (!sortedBills || sortedBills.length === 0) {
      alert("No data to export");
      return;
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 40;
    const lineHeight = 14;

    const drawTextLine = (text, x, yPos, size = 12) => {
      page.drawText(text, { x, y: yPos, size, font });
    };

    // Title
    drawTextLine("Bill Summary Report", 40, y, 16);
    y -= lineHeight * 2;

    // Table header
    drawTextLine("Bill No.", 40, y);
    drawTextLine("Vendor", 120, y);
    drawTextLine("Bill Date", 260, y);
    drawTextLine("Amount", 360, y);
    drawTextLine("Status", 440, y);
    y -= lineHeight;

    // Rows
    sortedBills.forEach((bill) => {
      if (y < 40) {
        const newPage = pdfDoc.addPage();
        y = newPage.getSize().height - 40;
      }

      const dateText = bill.bill_date
        ? new Date(bill.bill_date).toLocaleDateString()
        : "-";
      drawTextLine(bill.bill_no || "-", 40, y);
      drawTextLine(bill.Vendor?.vendor_name || "-", 120, y);
      drawTextLine(dateText, 260, y);
      drawTextLine(
        `Rs ${parseFloat(bill.bill_amount || 0).toFixed(2)}`,
        360,
        y
      );
      drawTextLine(
        (bill.status || "Pending").toLowerCase() === "completed"
          ? "Approved"
          : bill.status || "Pending",
        440,
        y
      );
      y -= lineHeight;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `bill_ledger_${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                  />
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
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium transition-colors"
                disabled={!sortedBills || sortedBills.length === 0}
              >
                Download Excel
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

