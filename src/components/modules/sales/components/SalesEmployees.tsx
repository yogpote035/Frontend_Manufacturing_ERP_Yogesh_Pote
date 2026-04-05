import React, { useState, useMemo, useEffect } from "react";
import type { ChangeEvent } from "react";
import {
  UserPlus,
  Search,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileEdit,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// 1. Import Redux Hooks and Thunk
import { getEmployees, clearSalesErrors } from "../ModuleStateFiles/EmployeeSlice"; // Adjust path
import { useAppDispatch, useAppSelector } from "../../../common/ReduxMainHooks";
import type { RootState } from "../../../../ApplicationState/Store";

// --- Interfaces ---
interface Employee {
  user_id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  is_active: 0 | 1;
  created_at: string;
}

const SalesEmployees: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { employees, loading, error } = useAppSelector((state: RootState) => state.SalesEmployee);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Active" | "All">("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(getEmployees());
    return () => {
      dispatch(clearSalesErrors());
    };
  }, [dispatch]);

  // 4. Filtering Logic (now uses 'employees' from Redux)
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];

    return (employees as Employee[]).filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "All" || emp.is_active === 1;
      return matchesSearch && matchesTab;
    });
  }, [employees, searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      // Add your delete thunk dispatch here later
      console.log("Delete employee:", id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Sales Employees</h1>
          <p className="text-sm text-gray-400 font-normal">Manage your sales force and track performance accounts.</p>
        </div>

        <button
          onClick={() => navigate("/sales/employees/add-employee")}
          className="flex items-center gap-2 bg-[#005d52] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-teal-900/20 hover:bg-[#005d52]/95 transition-all active:scale-95">
          <UserPlus size={18} strokeWidth={3} />
          Add Sales Employee
        </button>
      </div>

      {/* Tabs & Search Row */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-gray-100 w-fit shadow-sm">
          <button
            onClick={() => { setActiveTab("Active"); setCurrentPage(1); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "Active" ? "bg-[#d1e9e7] text-[#005d52] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            Active
          </button>
          <button
            onClick={() => { setActiveTab("All"); setCurrentPage(1); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "All" ? "bg-[#d1e9e7] text-[#005d52] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            All Employees
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm outline-none shadow-sm focus:ring-2 focus:ring-[#005d52]/10 transition-all font-normal"
            />
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Table Container */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-visible relative">

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-[#005d52]" size={40} />
              <p className="text-sm font-bold text-[#005d52] uppercase tracking-widest">Loading Employees...</p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-5 text-[13px] font-bold text-gray-800 uppercase tracking-widest border-b border-r border-gray-100 text-center">Employee Name</th>
                <th className="px-6 py-5 text-[13px] font-bold text-gray-800 uppercase tracking-widest border-b border-r border-gray-100">Designation</th>
                <th className="px-6 py-5 text-[13px] font-bold text-gray-800 uppercase tracking-widest border-b border-r border-gray-100">Contact Info</th>
                <th className="px-6 py-5 text-[13px] font-bold text-gray-800 uppercase tracking-widest border-b border-r border-gray-100 text-center">Status</th>
                <th className="px-6 py-5 text-[13px] font-bold text-gray-800 uppercase tracking-widest border-b border-r border-gray-100">Joined Date</th>
                <th className="px-6 py-5 text-[13px] font-bold text-gray-800 uppercase tracking-widest border-b border-gray-100 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedData.map((emp) => (
                <tr key={emp.user_id} className="hover:bg-[#f4f7f6]/50 transition-colors group">
                  <td className="px-3 py-5 border-r border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-[#d1e9e7] flex items-center justify-center text-[#005d52] font-bold text-[13px] border-2 border-white">
                        {emp.name ? emp.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-800">{emp.name}</p>
                        <p className="text-[13px] font-bold text-[#005d52] uppercase tracking-tighter">{emp.user_id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 border-r border-gray-50">
                    <span className="text-[13px] text-gray-800 font-normal">{emp.designation}</span>
                  </td>

                  <td className="px-6 py-5 border-r border-gray-50 font-normal">
                    <div className="space-y-1 text-gray-800">
                      <div className="flex items-center gap-2 text-[13px]">
                        <Mail size={12} className="opacity-70" /> {emp.email}
                      </div>
                      <div className="flex items-center gap-2 text-[13px]">
                        <Phone size={12} className="opacity-70" /> {emp.phone}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5 border-r border-gray-50 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-bold uppercase tracking-tight ${emp.is_active === 1 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-400 border border-gray-200'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${emp.is_active === 1 ? 'bg-green-600' : 'bg-gray-400'}`} />
                      {emp.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-5 border-r border-gray-50">
                    <span className="text-[13px] text-gray-800 font-normal">{emp?.created_at && new Date(emp?.created_at).toLocaleDateString("en-GB").replace(/\//g, "-") || "N/A"}</span>
                  </td>

                  <td className="px-6 py-8 flex items-center justify-between text-center relative overflow-visible">
                    <button
                      onClick={() => navigate(`/sales/employees/view-employee/${emp.user_id}`)}
                      className="p-1.5 hover:bg-teal-50 text-gray-800 hover:text-[#005d52] rounded-md transition-all">
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => navigate(`/sales/employees/edit-employee/${emp.user_id}`)}
                      className="p-1.5 hover:bg-teal-50 text-gray-800 hover:text-blue-600 rounded-md transition-all">
                      <FileEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.user_id)}
                      className="p-1.5 hover:bg-teal-50 text-gray-800 hover:text-red-500 rounded-md transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {!loading && filteredEmployees.length === 0 && (
            <div className="px-8 py-24 text-center">
              <Search size={40} className="mx-auto text-gray-100 mb-2" />
              <p className="text-sm text-gray-400 font-normal italic">No employees found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-800">{paginatedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</span> of <span className="text-gray-800">{filteredEmployees.length}</span> Employees
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-2 text-gray-400 hover:text-[#005d52] disabled:opacity-20 transition-all"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${currentPage === i + 1 ? "bg-[#005d52] text-white shadow-lg shadow-teal-900/20" : "text-gray-400 hover:bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-2 text-gray-400 hover:text-[#005d52] disabled:opacity-20 transition-all"
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesEmployees;