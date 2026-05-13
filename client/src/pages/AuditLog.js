import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/axiosConfig";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/audit-logs");
        setLogs(response.data || []);
      } catch (err) {
        console.error("Error fetching audit logs:", err);
        if (err.response?.status === 403) {
          setError("You do not have permission to view audit logs.");
        } else if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else if (err.code === "ECONNREFUSED" || err.message?.includes("Network")) {
          setError("Backend server unreachable. Please verify it is running.");
        } else {
          setError(
            err.response?.data?.message ||
              err.response?.data?.error ||
              "Failed to load audit logs."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const needle = search.trim().toLowerCase();

    if (!needle) return logs;

    return logs.filter((log) => {
      const haystacks = [
        log.action_type,
        log.module,
        log.record_id?.toString(),
        log.details ? JSON.stringify(log.details) : "",
        log.User?.full_name,
        log.User?.username,
      ];

      return haystacks.some((value) =>
        value?.toString().toLowerCase().includes(needle)
      );
    });
  }, [logs, search]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Audit Trail</h1>
        <p className="text-gray-600 mt-1">
          Review important actions performed across the system.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow px-6 py-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user, module, action, details..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
          Loading audit logs...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Record ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      {!search.trim() && logs.length === 0
                        ? "No audit entries yet."
                        : "No audit entries match your filters."}
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.log_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.User?.full_name || log.User?.username || "System"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {log.action_type || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {log.module || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.record_id ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                        {log.details
                          ? typeof log.details === "string"
                            ? log.details
                            : JSON.stringify(log.details, null, 2)
                          : "-"}
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

