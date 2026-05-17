import React, { useEffect, useState, useCallback } from "react";
import api from "../utils/axiosConfig";
import { Search } from "lucide-react";
import { SHELL } from "../utils/branding";

const HALF_OPTIONS = ["First Half", "Second Half"];

export default function ReturnLedger() {
  const [ledgers, setLedgers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);
  const [filterDept, setFilterDept] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterHalf, setFilterHalf] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [selected, setSelected] = useState(null);

  const [returnForm, setReturnForm] = useState({ rack_code: "", notes: "" });
  const [quickAccession, setQuickAccession] = useState("");

  const fetchMeta = async () => {
    const [metaRes, deptRes] = await Promise.all([
      api.get("/api/ledgers/meta"),
      api.get("/api/departments"),
    ]);
    setYears(metaRes.data?.academic_years || []);
    setDepartments(deptRes.data || []);
  };

  const fetchLedgers = useCallback(async () => {
    try {
      const params = { status: "Issued" }; // Only fetch issued ledgers
      if (filterDept) params.dept_id = filterDept;
      if (filterYear) params.academic_year = filterYear;
      if (filterHalf) params.half = filterHalf;
      if (searchQ.trim()) params.q = searchQ.trim();
      const res = await api.get("/api/ledgers", { params });
      setLedgers(res.data || []);
    } catch {
      setLedgers([]);
    }
  }, [filterDept, filterYear, filterHalf, searchQ]);

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    fetchLedgers();
  }, [fetchLedgers]);

  const selectRow = (row) => {
    setSelected(row);
    setQuickAccession(row.accession_no);
    setReturnForm({ rack_code: row.rack_code || "", notes: "" });
  };

  const findByAccessionManual = async () => {
    const term = quickAccession.trim();
    if (!term) {
      alert("Enter the accession number.");
      return;
    }
    const lower = term.toLowerCase();
    const inList = ledgers.find((l) => l.accession_no.toLowerCase() === lower);
    if (inList) {
      selectRow(inList);
      return;
    }
    try {
      const res = await api.get("/api/ledgers", { params: { q: term, status: "Issued" } });
      const list = res.data || [];
      const exact = list.find((l) => l.accession_no.toLowerCase() === lower);
      if (exact) {
        selectRow(exact);
        return;
      }
      if (list.length === 1) {
        selectRow(list[0]);
        return;
      }
      alert("No issued ledger found with that accession number.");
    } catch {
      alert("Could not search. Check that the server is running.");
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await api.post(`/api/ledgers/${selected.ledger_id}/return`, returnForm);
      alert(`Returned to rack ${returnForm.rack_code}`);
      setSelected(null);
      setQuickAccession("");
      fetchLedgers();
    } catch (err) {
      alert(err.response?.data?.message || "Return failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className={`${SHELL.accentBorder} mb-4`}>
        <h1 className={SHELL.pageTitle}>Return Ledger</h1>
        <p className={`${SHELL.pageSubtitle} mt-1`}>
          Pick an issued ledger from the list or type its accession number, then enter which rack it is returned to.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow border border-indigo-100 p-4 mb-4 flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-gray-500 block mb-1">
            Find ledger by accession (manual)
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono"
            placeholder="Type accession number"
            value={quickAccession}
            onChange={(e) => setQuickAccession(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && findByAccessionManual()}
          />
        </div>
        <button
          type="button"
          onClick={findByAccessionManual}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Find & select
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d.dept_id} value={d.dept_id}>
                  {d.dept_name}
                </option>
              ))}
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              value={filterHalf}
              onChange={(e) => setFilterHalf(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Both halves</option>
              {HALF_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                className="w-full border rounded-lg pl-8 pr-2 py-2 text-sm"
                placeholder="Search accession…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Accession</th>
                  <th className="p-2 text-left">Ledger Name</th>
                  <th className="p-2 text-left">Dept / Year / Half</th>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ledgers.map((row) => (
                  <tr
                    key={row.ledger_id}
                    className={`hover:bg-blue-50 cursor-pointer ${
                      selected?.ledger_id === row.ledger_id ? "bg-blue-100" : ""
                    }`}
                    onClick={() => selectRow(row)}
                  >
                    <td className="p-2 font-mono">{row.accession_no}</td>
                    <td className="p-2 font-medium text-gray-900">{row.title || "—"}</td>
                    <td className="p-2">
                      {row.department_name} · {row.academic_year} · {row.half}
                    </td>
                    <td className="p-2">
                      <span className="text-amber-700">Issued: {row.issued_to_name}</span>
                    </td>
                    <td className="p-2 text-blue-600 text-xs">Select</td>
                  </tr>
                ))}
                {ledgers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No issued ledgers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          {!selected ? (
            <p className="text-gray-500 text-sm">
              Select an issued ledger from the list, or type the accession number above and click Find & select.
            </p>
          ) : (
            <>
              <h2 className="font-semibold text-lg mb-1">
                {selected.accession_no} {selected.title && <span className="font-normal text-gray-500">- {selected.title}</span>}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {selected.department_name} · {selected.academic_year} · {selected.half}
              </p>
              <p
                className="text-sm font-medium mb-4 px-2 py-1 rounded bg-amber-50 text-amber-800"
              >
                Status: Issued to {selected.issued_to_name}
              </p>

              <form onSubmit={handleReturn} className="space-y-3 border-t pt-4">
                <h3 className="font-medium text-green-800">Return to rack</h3>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Rack code *"
                  value={returnForm.rack_code}
                  onChange={(e) =>
                    setReturnForm({ ...returnForm, rack_code: e.target.value })
                  }
                  required
                />
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Notes"
                  rows={2}
                  value={returnForm.notes}
                  onChange={(e) =>
                    setReturnForm({ ...returnForm, notes: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
                >
                  Confirm return
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
