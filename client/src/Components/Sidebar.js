import { useState } from "react";
import { APP_TAGLINE, SHELL } from "../utils/branding";
import {
  Squares2X2Icon,
  CubeIcon,
  BookOpenIcon,
  ArrowsRightLeftIcon,
  ChevronDownIcon,
  Bars3Icon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ setPage, collapsed, setCollapsed }) => {
  const [openMasters, setOpenMasters] = useState(false);

  const userRole = sessionStorage.getItem("role") || "Staff";
  const isAdmin = userRole === "Admin";

  return (
    <div
      className={`${SHELL.sidebar} ${
        collapsed ? "w-20" : "w-64"
      } h-screen p-4 flex flex-col transition-all duration-300 flex-shrink-0 overflow-y-auto border-r border-slate-800`}
    >
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold leading-none text-amber-400">Ledger Management</h1>
            <p className="text-[10px] text-slate-400 mt-0.5">{APP_TAGLINE}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-300 hover:text-white"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      <ul className="space-y-2 text-sm">
        <li
          className={`flex items-center gap-2 ${SHELL.sidebarHover} p-2 rounded cursor-pointer`}
          onClick={() => setPage("Dashboard")}
        >
          <Squares2X2Icon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </li>

        <li
          className="flex items-center gap-2 hover:bg-indigo-900/80 p-2 rounded cursor-pointer"
          onClick={() => setPage("LedgerMaster")}
        >
          <BookOpenIcon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Ledger Master</span>}
        </li>

        <li
          className="flex items-center gap-2 hover:bg-indigo-900/80 p-2 rounded cursor-pointer"
          onClick={() => setPage("IssueLedger")}
        >
          <ArrowsRightLeftIcon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Issue Ledger</span>}
        </li>

        <li
          className="flex items-center gap-2 hover:bg-indigo-900/80 p-2 rounded cursor-pointer"
          onClick={() => setPage("ReturnLedger")}
        >
          <ArrowsRightLeftIcon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Return Ledger</span>}
        </li>

        {isAdmin && (
          <li>
            <button
              type="button"
              onClick={() => !collapsed && setOpenMasters(!openMasters)}
              className="flex items-center gap-2 hover:bg-indigo-900/80 p-2 rounded w-full"
            >
              <CubeIcon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="flex-1 text-left">Masters</span>}
              {!collapsed && (
                <ChevronDownIcon
                  className={`h-4 w-4 ${openMasters ? "rotate-180" : ""}`}
                />
              )}
            </button>
            {!collapsed && openMasters && (
              <ul className="ml-6 mt-1 space-y-1">
                {[
                  { label: "Department Master", key: "DepartmentMaster" },
                  { label: "User Management", key: "UserManagement" },
                ].map((item) => (
                  <li
                    key={item.key}
                    onClick={() => setPage(item.key)}
                    className="cursor-pointer hover:bg-indigo-800/60 p-2 rounded"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}

        {isAdmin && (
          <li
            className="flex items-center gap-2 hover:bg-indigo-900/80 p-2 rounded cursor-pointer"
            onClick={() => setPage("Audit Log")}
          >
            <DocumentTextIcon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Audit Log</span>}
          </li>
        )}

      </ul>
    </div>
  );
};

export default Sidebar;
