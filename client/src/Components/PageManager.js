import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Dashboard from "../pages/Dashboard";
import AuditLog from "../pages/AuditLog";
import LedgerMaster from "../pages/LedgerMaster";
import IssueLedger from "../pages/IssueLedger";
import ReturnLedger from "../pages/ReturnLedger";
import DepartmentMaster from "../pages/DepartmentMaster";
import UserManagement from "../pages/UserManagement";

export default function PageManager() {
  const [page, setPage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
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
        <main className="flex-1 overflow-y-auto transition-all duration-300 p-6 bg-slate-50">
          {page === "Dashboard" && <Dashboard onNavigate={setPage} />}
          {page === "LedgerMaster" && <LedgerMaster />}
          {page === "IssueLedger" && <IssueLedger />}
          {page === "ReturnLedger" && <ReturnLedger />}
          {page === "DepartmentMaster" && <DepartmentMaster />}
          {page === "UserManagement" && <UserManagement />}
          {page === "Audit Log" && <AuditLog />}
        </main>
      </div>
    </div>
  );
}

