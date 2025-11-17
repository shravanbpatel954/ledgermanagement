import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { PDFDocument, StandardFonts } from "pdf-lib";
import * as XLSX from "xlsx";

export default function VendorLedger() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [ledgerData, setLedgerData] = useState(null);
  const [billStatusFilter, setBillStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendors for dropdown
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoadingVendors(true);
        const response = await api.get('/api/vendors');
        const vendorsData = response.data || [];
        const sortedVendors = vendorsData.sort((a, b) => {
          const nameA = a.vendor_name || a.vendorName || '';
          const nameB = b.vendor_name || b.vendorName || '';
          return nameA.localeCompare(nameB);
        });
        setVendors(sortedVendors);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        
        if (err.response?.status === 401) {
          alert("Authentication required. Please login again.");
          window.location.href = '/login';
        } else if (err.response?.status === 403) {
          alert("You don't have permission to access this data.");
        } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          alert("Cannot connect to backend server. Make sure it's running on port 5000.");
        } else {
          const errorMsg = err.response?.data?.message || "Failed to load vendors.";
          setError(errorMsg);
        }
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchVendors();
  }, []);

  // Fetch vendor ledger when vendor is selected
  useEffect(() => {
    if (!selectedVendorId) {
      setLedgerData(null);
      return;
    }

    const fetchVendorLedger = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/reports/vendor-ledger/${selectedVendorId}`);
        setLedgerData(response.data);
      } catch (err) {
        console.error("Error fetching vendor ledger:", err);
        
        if (err.response?.status === 401) {
          alert("Authentication required. Please login again.");
          window.location.href = '/login';
        } else if (err.response?.status === 403) {
          alert("You don't have permission to access this data.");
        } else if (err.response?.status === 404) {
          setError("Vendor not found.");
          setLedgerData(null);
        } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          alert("Cannot connect to backend server. Make sure it's running on port 5000.");
        } else {
          const errorMsg = err.response?.data?.message || "Failed to load vendor ledger.";
          setError(errorMsg);
          setLedgerData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVendorLedger();
  }, [selectedVendorId]);

  const filteredBillsByStatus = (ledgerData?.bills || []).filter((bill) => {
    if (billStatusFilter === "all") return true;
    const normalizedStatus = (bill.status || "").toLowerCase();
    if (billStatusFilter === "approved") {
      return normalizedStatus === "completed" || normalizedStatus === "approved";
    }
    if (billStatusFilter === "pending") {
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendor Ledger");

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
    link.download = `vendor_ledger_${ledgerData?.vendor_details?.vendor_name || "export"}_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`;
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
    drawTextLine("Vendor Ledger Report", 40, y, 16);
    y -= lineHeight * 2;

    // Vendor Details
    drawTextLine(
      `Vendor: ${ledgerData?.vendor_details?.vendor_name || "-"}`,
      40,
      y
    );
    y -= lineHeight;
    drawTextLine(
      `Contact: ${ledgerData?.vendor_details?.contact_person || "-"}`,
      40,
      y
    );
    y -= lineHeight;
    drawTextLine(
      `Phone: ${ledgerData?.vendor_details?.phone || "-"}`,
      40,
      y
    );
    y -= lineHeight * 2;

    // Summary
    drawTextLine(
      `Total Billed: Rs ${parseFloat(
        ledgerData?.summary?.totalBilled || 0
      ).toFixed(2)}`,
      40,
      y
    );
    y -= lineHeight;
    drawTextLine(
      `Total Paid: Rs ${parseFloat(
        ledgerData?.summary?.totalPaid || 0
      ).toFixed(2)}`,
      40,
      y
    );
    y -= lineHeight;
    drawTextLine(
      `Outstanding: Rs ${parseFloat(
        ledgerData?.summary?.outstandingBalance || 0
      ).toFixed(2)}`,
      40,
      y
    );
    y -= lineHeight * 2;

    // Table header
    drawTextLine("Bill No.", 40, y);
    drawTextLine("Bill Date", 140, y);
    drawTextLine("Amount", 240, y);
    drawTextLine("Status", 340, y);
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
      drawTextLine(dateText, 140, y);
      drawTextLine(
        `Rs ${parseFloat(bill.bill_amount || 0).toFixed(2)}`,
        240,
        y
      );
      drawTextLine(
        (bill.status || "Pending").toLowerCase() === "completed"
          ? "Approved"
          : bill.status || "Pending",
        340,
        y
      );
      y -= lineHeight;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `vendor_ledger_${ledgerData?.vendor_details?.vendor_name || "export"}_${new Date()
      .toISOString()
      .split("T")[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendor Ledger</h1>
        <p className="text-gray-600 mt-1">View bill history and summary for a vendor</p>
      </div>

      {/* Vendor Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Vendor *
        </label>
        <select
          value={selectedVendorId}
          onChange={(e) => setSelectedVendorId(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          disabled={loadingVendors}
        >
          <option value="">-- Select a Vendor --</option>
          {vendors.map((vendor) => (
            <option key={vendor.vendor_id} value={vendor.vendor_id}>
              {vendor.vendor_name || vendor.vendorName || `Vendor ${vendor.vendor_id}`}
            </option>
          ))}
        </select>
        {loadingVendors && (
          <p className="text-sm text-gray-500 mt-2">Loading vendors...</p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading vendor ledger...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Vendor Details, Summary, and Bills */}
      {!loading && ledgerData && (
        <>
          {/* Vendor Details Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Vendor Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Vendor Name</p>
                <p className="text-base font-medium text-gray-900">
                  {ledgerData.vendor_details?.vendor_name || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Person</p>
                <p className="text-base font-medium text-gray-900">
                  {ledgerData.vendor_details?.contact_person || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-base font-medium text-gray-900">
                  {ledgerData.vendor_details?.phone || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Billed</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{parseFloat(ledgerData.summary?.totalBilled || 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{parseFloat(ledgerData.summary?.totalPaid || 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{parseFloat(ledgerData.summary?.outstandingBalance || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Bills Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col gap-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Bills</h2>
                  <p className="text-sm text-gray-500">
                    Filter bills by status to review pending or approved records.
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
                    value={billStatusFilter}
                    onChange={(e) => setBillStatusFilter(e.target.value)}
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
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        {billStatusFilter === "all"
                          ? "No bills found for this vendor."
                          : `No ${billStatusFilter} bills for this vendor.`}
                      </td>
                    </tr>
                  ) : (
                    sortedBills.map((bill) => (
                      <tr key={bill.bill_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bill.bill_no || '-'}
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
        </>
      )}

      {/* No Vendor Selected State */}
      {!loading && !ledgerData && !selectedVendorId && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">Please select a vendor to view its ledger.</p>
        </div>
      )}
    </div>
  );
}

