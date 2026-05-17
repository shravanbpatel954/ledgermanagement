import React, { useEffect, useState, useCallback } from "react";
import api from "../utils/axiosConfig";
import { Plus, X, Edit, Trash2, Upload, Search } from "lucide-react";
import * as XLSX from "xlsx";
import { APP_TAGLINE, SHELL } from "../utils/branding";

const HALF_OPTIONS = ["First Half", "Second Half"];

export default function LedgerMaster() {
  const [ledgers, setLedgers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterDept, setFilterDept] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterHalf, setFilterHalf] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRack, setFilterRack] = useState("");
  const [searchQ, setSearchQ] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    accession_no: "",
    dept_id: "",
    academic_year: "",
    half: "First Half",
    title: "",
    rack_code: "",
    remarks: "",
  });

  const fetchMeta = async () => {
    try {
      const [metaRes, deptRes] = await Promise.all([
        api.get("/api/ledgers/meta"),
        api.get("/api/departments"),
      ]);
      setYears(metaRes.data?.academic_years || []);
      setDepartments(deptRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLedgers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDept) params.dept_id = filterDept;
      if (filterYear) params.academic_year = filterYear;
      if (filterHalf) params.half = filterHalf;
      if (filterStatus) params.status = filterStatus;
      if (filterRack.trim()) params.rack_code = filterRack.trim();
      if (searchQ.trim()) params.q = searchQ.trim();

      const res = await api.get("/api/ledgers", { params });
      setLedgers(res.data || []);
    } catch (err) {
      console.error(err);
      setLedgers([]);
    } finally {
      setLoading(false);
    }
  }, [filterDept, filterYear, filterHalf, filterStatus, filterRack, searchQ]);

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    fetchLedgers();
  }, [fetchLedgers]);

  const openAdd = () => {
    setEditingId(null);
    const y = new Date().getFullYear();
    setForm({
      accession_no: "",
      dept_id: filterDept || "",
      academic_year: filterYear || String(y),
      half: filterHalf || "First Half",
      title: "",
      rack_code: "",
      remarks: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (row) => {
    if (row.status === "Issued") {
      return alert(
        "This ledger is issued. Return it before editing master details."
      );
    }
    setEditingId(row.ledger_id);
    setForm({
      accession_no: row.accession_no,
      dept_id: String(row.dept_id),
      academic_year: row.academic_year,
      half: row.half,
      title: row.title || "",
      rack_code: row.rack_code || "",
      remarks: row.remarks || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.accession_no.trim()) return alert("Accession number is required.");
    if (!form.dept_id) return alert("Department is required.");
    if (!form.academic_year.trim()) return alert("Academic year is required.");

    const payload = {
      accession_no: form.accession_no.trim(),
      dept_id: parseInt(form.dept_id, 10),
      academic_year: form.academic_year.trim(),
      half: form.half,
      title: form.title.trim() || null,
      rack_code: form.rack_code.trim() || null,
      remarks: form.remarks.trim() || null,
    };

    try {
      if (editingId) {
        await api.put(`/api/ledgers/${editingId}`, payload);
        alert("Ledger updated.");
      } else {
        await api.post("/api/ledgers", payload);
        alert("Ledger added.");
      }
      setIsModalOpen(false);
      fetchMeta();
      fetchLedgers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save ledger.");
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete ledger ${row.accession_no}?`)) return;
    try {
      await api.delete(`/api/ledgers/${row.ledger_id}`);
      alert("Deleted.");
      fetchLedgers();
      fetchMeta();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete.");
    }
  };

  const handleExcelImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const rows = raw.map((r) => {
          const keys = Object.keys(r).reduce((acc, k) => {
            acc[k.toLowerCase().replace(/\s+/g, "_")] = r[k];
            return acc;
          }, {});
          return {
            department_name:
              keys.department ||
              keys.dept ||
              keys.department_name ||
              keys.dept_name ||
              "",
            dept_id: keys.dept_id || keys.department_id || "",
            academic_year:
              keys.academic_year || keys.year || keys.session || "",
            half: keys.half || keys.term || "",
            accession_no:
              keys.accession_no ||
              keys.accession ||
              keys.ledger_no ||
              keys.id ||
              "",
            rack_code: keys.rack_code || keys.rack || keys.location || "",
            title: keys.title || keys.description || "",
            remarks: keys.remarks || keys.note || "",
          };
        });

        const res = await api.post("/api/ledgers/bulk-import", { rows });
        alert(res.data?.message || "Import finished.");
        if (res.data?.errors?.length) {
          console.table(res.data.errors);
        }
        fetchMeta();
        fetchLedgers();
      } catch (err) {
        alert(err.response?.data?.message || "Import failed.");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const locationLabel = (row) => {
    if (row.status === "Issued") {
      return (
        <span className="text-amber-700 font-medium">
          Issued → {row.issued_to_name}
          {row.issued_to_contact ? ` (${row.issued_to_contact})` : ""}
        </span>
      );
    }
    return (
      <span className="text-green-700 font-medium">
        Rack: {row.rack_code || "— (set rack)"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className={SHELL.accentBorder}>
          <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">{APP_TAGLINE}</p>
          <h1 className={SHELL.pageTitle}>Ledger Master</h1>
          <p className={SHELL.pageSubtitle + " mt-1"}>
            Result ledgers — department, year, half, rack or issued to.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer text-sm font-medium">
            <Upload size={18} /> Import Excel
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleExcelImport}
            />
          </label>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Plus size={18} /> Add Ledger
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Department</label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d.dept_id} value={d.dept_id}>
                  {d.dept_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Academic year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Half</label>
            <select
              value={filterHalf}
              onChange={(e) => setFilterHalf(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Both halves</option>
              {HALF_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="In Rack">In Rack</option>
              <option value="Issued">Issued</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Rack code</label>
            <input
              type="text"
              value={filterRack}
              onChange={(e) => setFilterRack(e.target.value)}
              placeholder="e.g. A-12"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Accession, title…"
                className="w-full border rounded-lg pl-8 pr-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Excel columns: Department, Academic Year, Half (First/Second), Accession No, Rack Code, Title, Remarks
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading ledgers…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Accession</th>
                  <th className="px-4 py-3">Ledger Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Half</th>
                  <th className="px-4 py-3">Current location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ledgers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No ledgers match your filters. Add one or import from Excel.
                    </td>
                  </tr>
                ) : (
                  ledgers.map((row) => (
                    <tr key={row.ledger_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-medium">{row.accession_no}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{row.title || "—"}</td>
                      <td className="px-4 py-3">{row.department_name || row.dept_id}</td>
                      <td className="px-4 py-3">{row.academic_year}</td>
                      <td className="px-4 py-3">{row.half}</td>
                      <td className="px-4 py-3">{locationLabel(row)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            row.status === "In Rack"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Ledger" : "Add Ledger"}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Accession No *</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={form.accession_no}
                  onChange={(e) => setForm({ ...form, accession_no: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Department *</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={form.dept_id}
                  onChange={(e) => setForm({ ...form, dept_id: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  {departments.map((d) => (
                    <option key={d.dept_id} value={d.dept_id}>
                      {d.dept_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Academic year *</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    placeholder="e.g. 2024-25"
                    value={form.academic_year}
                    onChange={(e) =>
                      setForm({ ...form, academic_year: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Half *</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    value={form.half}
                    onChange={(e) => setForm({ ...form, half: e.target.value })}
                  >
                    {HALF_OPTIONS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Rack code (when in store)</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="e.g. R-A-12"
                  value={form.rack_code}
                  onChange={(e) => setForm({ ...form, rack_code: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title / description</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
