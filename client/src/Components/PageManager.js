import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Dashboard from "../pages/Dashboard";
import ItemMaster from "../pages/IItemMaster";
import VendorMaster from "../pages/VendorMaster";
import DepartmentMaster from "../pages/DepartmentMaster";
import UserManagement from "../pages/UserManagement";
import PurchaseEntry from "../pages/PurchaseEntry";
import ChallanEntry from "../pages/ChallanEntry";
import BillEntry from "../pages/BillEntry";
import IssueEntry from "../pages/IssueEntry";
import ItemLedger from "../pages/ItemLedger";
import StockLedger from "../pages/StockLedger";
import VendorLedger from "../pages/VendorLedger";
import BillLedger from "../pages/BillLedger";
import AuditLog from "../pages/AuditLog";
export default function PageManager() {
  const [page, setPage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        setPage={setPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto transition-all duration-300 p-6 bg-gray-50">
          {page === "Dashboard" && <Dashboard onNavigate={setPage} />}
          {page === "ItemMaster" && <ItemMaster />}
          {page === "VendorMaster" && <VendorMaster />}
          {page === "DepartmentMaster" && <DepartmentMaster />}
          {page === "UserManagement" && <UserManagement />}
          {page === "Purchase Entry" && <PurchaseEntry />}
          {page === "Challan Entry" && <ChallanEntry />}
          {page === "Bill Entry" && <BillEntry />}
          {page === "Issue Entry" && <IssueEntry />}
          {page === "Item Ledger" && <ItemLedger />}
          {page === "Stock Ledger" && <StockLedger setPage={setPage} />}
          {page === "Vendor Ledger" && <VendorLedger />}
          {page === "Bill Ledger" && <BillLedger />}
          {page === "Audit Log" && <AuditLog />}
        </main>
      </div>
    </div>
  );
}

