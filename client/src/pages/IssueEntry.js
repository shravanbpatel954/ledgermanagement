import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Plus, X } from "lucide-react";

export default function IssueEntry() {
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stockIssues, setStockIssues] = useState([]);
  const [issueSearch, setIssueSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [issue, setIssue] = useState({
    item_id: "",
    quantity_issued: "",
    dept_id: "",
    purpose: "",
    issue_date: "",
  });

  // Fetch Items, Departments, and Stock Issues
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, deptsRes, issuesRes] = await Promise.all([
          api.get('/api/items'),
          api.get('/api/departments'),
          api.get('/api/stock-issues'),
        ]);
        const sortedItems = (itemsRes.data || []).sort((a, b) => {
          const nameA = a.item_name || a.itemName || '';
          const nameB = b.item_name || b.itemName || '';
          return nameA.localeCompare(nameB);
        });
        setItems(sortedItems);
        const sortedDepts = (deptsRes.data || []).sort((a, b) => {
          const nameA = a.dept_name || a.deptName || '';
          const nameB = b.dept_name || b.deptName || '';
          return nameA.localeCompare(nameB);
        });
        setDepartments(sortedDepts);
        setStockIssues(issuesRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        console.error("Error details:", err.response?.data);
        console.error("Error status:", err.response?.status);
        console.error("Error message:", err.message);
        
        if (err.response?.status === 401) {
          alert("Authentication required. Please login again.");
          window.location.href = '/login';
        } else if (err.response?.status === 403) {
          alert("You don't have permission to access this data.");
        } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          alert("Cannot connect to backend server. Make sure it's running on port 5000.");
        } else {
          const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to load data. Please check if backend is running and try again.";
          alert(`Error: ${errorMsg}`);
        }
        // Set empty arrays to prevent further errors
        setItems([]);
        setDepartments([]);
        setStockIssues([]);
      }
    };
    fetchData();
  }, []);

  // Open modal
  const openAddModal = () => {
    setIssue({
      item_id: "",
      quantity_issued: "",
      dept_id: "",
      purpose: "",
      issue_date: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  // Get available stock for selected item
  const getAvailableStock = () => {
    const selectedItem = items.find(i => i.item_id === parseInt(issue.item_id));
    return selectedItem ? selectedItem.current_stock : 0;
  };

  // Submit Stock Issue
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.item_id || !issue.quantity_issued || !issue.dept_id || !issue.purpose || !issue.issue_date) {
      return alert("Please fill all required fields.");
    }

    const qty = parseInt(issue.quantity_issued);
    if (qty <= 0) {
      return alert("Quantity must be greater than 0.");
    }

    const availableStock = getAvailableStock();
    if (qty > availableStock) {
      return alert(`Not enough stock. Only ${availableStock} available.`);
    }

    const payload = {
      ...issue,
      item_id: parseInt(issue.item_id),
      quantity_issued: qty,
      dept_id: parseInt(issue.dept_id),
    };

    try {
      setLoading(true);
      await api.post('/api/stock-issues', payload);
      alert("Stock issued successfully!");
      setIsModalOpen(false);
      
      // Refresh data
      const [itemsRes, issuesRes] = await Promise.all([
        api.get('/api/items'),
        api.get('/api/stock-issues'),
      ]);
      setItems(itemsRes.data || []);
      setStockIssues(issuesRes.data || []);
      
      // Reset form
      setIssue({
        item_id: "",
        quantity_issued: "",
        dept_id: "",
        purpose: "",
        issue_date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error("Error creating stock issue:", err);
      const errorMsg = err.response?.data?.message || "Failed to issue stock.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = stockIssues.filter((issueRecord) => {
    const matchesDepartment =
      departmentFilter === "all" ||
      issueRecord.dept_id === parseInt(departmentFilter);
    if (!matchesDepartment) {
      return false;
    }

    if (!issueSearch.trim()) {
      return true;
    }

    const needle = issueSearch.toLowerCase();
    const haystacks = [
      issueRecord.Item?.item_name,
      issueRecord.Item?.size,
      issueRecord.Item?.color,
      issueRecord.Department?.dept_name,
      issueRecord.purpose,
      issueRecord.User?.full_name,
    ];

    return haystacks.some((value) =>
      value?.toString().toLowerCase().includes(needle)
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Issue Entry</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="h-5 w-5" />
          Issue Stock
        </button>
      </div>

      {/* Stock Issues List */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Recent Issues</h2>
            <p className="text-sm text-gray-500">
              Review stock dispatch history by item, department, or purpose.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              value={issueSearch}
              onChange={(e) => setIssueSearch(e.target.value)}
              placeholder="Search item, department, purpose..."
              className="w-full sm:w-60 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name || dept.deptName || `Department ${dept.dept_id}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issued By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {issueSearch || departmentFilter !== "all"
                      ? "No matching stock issues."
                      : "No stock issues found. Create a new one to get started."}
                  </td>
                </tr>
              ) : (
                filteredIssues.map((si) => (
                  <tr key={si.issue_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {si.Item?.item_name || '-'} 
                      {si.Item?.size && ` (${si.Item.size})`}
                      {si.Item?.color && ` - ${si.Item.color}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{si.quantity_issued}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {si.Department?.dept_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 break-words max-w-xs">
                      {si.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(si.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {si.User?.full_name || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Issue Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Issue Stock</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item *</label>
                <select
                  value={issue.item_id}
                  onChange={(e) => setIssue({ ...issue, item_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                  required
                >
                    <option value="">Select Item</option>
                    {items.map(item => (
                      <option key={item.item_id} value={item.item_id}>
                        {item.item_name || item.itemName || `Item ${item.item_id}`} 
                        {item.size && ` (${item.size})`} 
                        {item.color && ` - ${item.color}`}
                        {` - Stock: ${item.current_stock || 0}`}
                      </option>
                    ))}
                </select>
                {issue.item_id && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available Stock: <strong>{getAvailableStock()}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  value={issue.quantity_issued}
                  onChange={(e) => setIssue({ ...issue, quantity_issued: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                  max={getAvailableStock()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  value={issue.dept_id}
                  onChange={(e) => setIssue({ ...issue, dept_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                  required
                >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.dept_id} value={dept.dept_id}>
                        {dept.dept_name || dept.deptName || `Department ${dept.dept_id}`}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issued to*</label>
                <input
                  type="text"
                  value={issue.purpose}
                  onChange={(e) => setIssue({ ...issue, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={20}
                  required
                  placeholder="Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                <input
                  type="date"
                  value={issue.issue_date}
                  onChange={(e) => setIssue({ ...issue, issue_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !issue.item_id}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Issue Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

