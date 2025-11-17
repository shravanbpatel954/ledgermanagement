import { useState } from "react";
import {
  Squares2X2Icon,
  CubeIcon,
  ClipboardDocumentIcon,
  ChartBarIcon,
  ChevronDownIcon,
  Bars3Icon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ setPage, collapsed, setCollapsed }) => {
  const [openEntry, setOpenEntry] = useState(false);
  const [openReports, setOpenReports] = useState(false);
  const [openMasters, setOpenMasters] = useState(false);

  const userRole = sessionStorage.getItem("role") || "Staff";
  const isAdmin = userRole === "Admin";

  return (
    <div
      className={`bg-[#062b52] text-white ${
        collapsed ? "w-20" : "w-64"
      } h-screen p-4 flex flex-col transition-all duration-300 flex-shrink-0 overflow-y-auto`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold leading-none">Inventory</h1>
            <p className="text-[10px] text-gray-300">Paper Sales</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
      <ul className="space-y-3 text-sm">
        {/* Dashboard */}
        <li
          className="flex items-center gap-2 hover:bg-blue-900 p-2 rounded cursor-pointer transition"
          onClick={() => setPage("Dashboard")}
        >
          <Squares2X2Icon className="h-5 w-5" />
          {!collapsed && <span>Dashboard</span>}
        </li>
        {/* Masters Dropdown (Admin Only) */}
        {isAdmin && (
          <li>
            <button
              onClick={() => !collapsed && setOpenMasters(!openMasters)} // ✅ prevent open in collapsed
              className="flex items-center gap-2 hover:bg-blue-900 p-2 rounded cursor-pointer w-full transition"
            >
              <CubeIcon className="h-5 w-5" />
              {!collapsed && <span>Masters</span>}
              {!collapsed && (
                <ChevronDownIcon
                  className={`h-4 w-4 transform transition ${
                    openMasters ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Masters dropdown menu */}
            {!collapsed && openMasters && (
              <ul className="ml-6 mt-1 space-y-1 text-sm">
                {[
                  { label: "Item Master", key: "ItemMaster" },
                  { label: "Vendor Master", key: "VendorMaster" },
                  { label: "Department Master", key: "DepartmentMaster" },
                  { label: "User Management", key: "UserManagement" },
                ].map((item) => (
                  <li
                    key={item.key}
                    onClick={() => setPage(item.key)}
                    className="cursor-pointer hover:bg-blue-700 p-2 rounded transition"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}

        {/* Audit Log - Admin Only */}
        {isAdmin && (
          <li
            className="flex items-center gap-2 hover:bg-blue-900 p-2 rounded cursor-pointer transition"
            onClick={() => setPage("Audit Log")}
          >
            <DocumentTextIcon className="h-5 w-5" />
            {!collapsed && <span>Audit Log</span>}
          </li>
        )}

        {/* Entry */}
        {!collapsed && (
          <p className="text-gray-400 text-xs mt-3 uppercase">Entry</p>
        )}
        <li>
          <button
            onClick={() => !collapsed && setOpenEntry(!openEntry)}
            className="flex w-full items-center justify-between hover:bg-blue-900 p-2 rounded transition"
          >
            <span className="flex items-center gap-2">
              <ClipboardDocumentIcon className="h-5 w-5" />
              {!collapsed && <span>Entry</span>}
            </span>
            {!collapsed && (
              <ChevronDownIcon
                className={`h-4 w-4 transform transition ${
                  openEntry ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
          {!collapsed && openEntry && (
            <ul className="ml-6 mt-1 space-y-1 text-sm">
              {[
                "Purchase Entry",
                "Challan Entry",
                "Bill Entry",
                "Issue Entry",
              ].map((item) => (
                <li
                  key={item}
                  onClick={() => setPage(item)}
                  className="cursor-pointer hover:bg-blue-700 p-2 rounded transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Reports - Accessible to all users */}
        <>
          {!collapsed && (
            <p className="text-gray-400 text-xs mt-3 uppercase">Reports</p>
          )}
          <li>
            <button
              onClick={() => !collapsed && setOpenReports(!openReports)}
              className="flex w-full items-center justify-between hover:bg-blue-900 p-2 rounded transition"
            >
              <span className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5" />
                {!collapsed && <span>Reports</span>}
              </span>
              {!collapsed && (
                <ChevronDownIcon
                  className={`h-4 w-4 transform transition ${
                    openReports ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
            {!collapsed && openReports && (
              <ul className="ml-6 mt-1 space-y-1 text-sm">
                {[
                  "Item Ledger",
                  "Stock Ledger",
                  "Vendor Ledger",
                  "Bill Ledger",
                ].map((item) => (
                  <li
                    key={item}
                    onClick={() => setPage(item)}
                    className="cursor-pointer hover:bg-blue-700 p-2 rounded transition"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </>
      </ul>
    </div>
  );
};

export default Sidebar;
