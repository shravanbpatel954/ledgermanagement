import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import {
  BookOpenIcon,
  ArrowsRightLeftIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { APP_TAGLINE, SHELL } from "../utils/branding";

const quickLinks = [
  {
    title: "Ledger Master",
    description: "Add, search, import ledgers by dept, year & half.",
    target: "LedgerMaster",
    icon: BookOpenIcon,
  },
  {
    title: "Issue / Return",
    description: "Issue ledgers to staff or return to rack.",
    target: "LedgerIssueReturn",
    icon: ArrowsRightLeftIcon,
  },
  {
    title: "Department Master",
    description: "Maintain exam departments.",
    target: "DepartmentMaster",
    icon: UserGroupIcon,
  },
];

export default function Dashboard({ onNavigate = () => {} }) {
  const userName =
    JSON.parse(sessionStorage.getItem("user") || "{}")?.full_name ||
    sessionStorage.getItem("name") ||
    "there";
  const [counts, setCounts] = useState({ total: 0, inRack: 0, issued: 0 });

  useEffect(() => {
    api
      .get("/api/ledgers/meta")
      .then((res) => setCounts(res.data?.counts || { total: 0, inRack: 0, issued: 0 }))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-indigo-50 to-white rounded-xl shadow-sm border border-indigo-100 p-6 border-l-4 border-l-amber-500">
        <p className="text-sm text-indigo-700 font-medium">{APP_TAGLINE}</p>
        <h1 className={`${SHELL.pageTitle} mt-1`}>
          Hello, {userName}
        </h1>
        <p className={SHELL.pageSubtitle + " max-w-2xl mt-2"}>
          Track result ledgers (first & second half) by department and year.
          See instantly whether a ledger is on a rack or issued.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-indigo-100 p-5 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Total ledgers</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{counts.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-5">
          <p className="text-xs text-green-700 uppercase flex items-center gap-1">
            <ArchiveBoxIcon className="h-4 w-4" /> In rack
          </p>
          <p className="text-3xl font-bold text-green-800 mt-1">{counts.inRack}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
          <p className="text-xs text-amber-700 uppercase">Issued</p>
          <p className="text-3xl font-bold text-amber-800 mt-1">{counts.issued}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <button
              key={link.target}
              type="button"
              onClick={() => onNavigate(link.target)}
              className="group bg-white border border-indigo-100 rounded-2xl shadow-sm p-5 text-left hover:shadow-md hover:border-amber-300 transition"
            >
              <link.icon className="w-8 h-8 text-indigo-600 group-hover:text-amber-600 mb-3 transition-colors" />
              <h3 className="font-semibold text-gray-900">{link.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{link.description}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
