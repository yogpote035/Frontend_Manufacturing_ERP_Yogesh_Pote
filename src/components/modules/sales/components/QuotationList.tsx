import React, { useState, useMemo } from "react";
import {
    Plus,
    ChevronDown,
    Search,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronsUpDown,
    Calendar,
    Eye,
    X,
    Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Types ---
type Status = "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired" | "All";
type TimeTab = "Weekly" | "Monthly" | "Quarterly" | "Yearly" | "All Time";

type Quotation = {
    id: string;
    company: string;
    date: string;
    validUntil: string;
    amount: string;
    status: Exclude<Status, "All">;
    createdBy: string;
};

// --- Mock Data ---
const INITIAL_QUOTATIONS: Quotation[] = [
    { id: "QT-001", company: "Rajesh Electronics", date: "2026-03-25", validUntil: "2026-04-25", amount: "₹ 25.5L", status: "Sent", createdBy: "Rahul Patil" },
    { id: "QT-002", company: "Modern Appliances", date: "2026-03-10", validUntil: "2026-04-10", amount: "₹ 5.5L", status: "Draft", createdBy: "Sneha P." },
    { id: "QT-003", company: "Kitchen Hub", date: "2026-02-15", validUntil: "2026-03-15", amount: "₹ 11.2L", status: "Accepted", createdBy: "Rahul Patil" },
    { id: "QT-004", company: "Elite Tech Solutions", date: "2026-03-19", validUntil: "2026-04-19", amount: "₹ 18.75L", status: "Draft", createdBy: "Amit S." },
    { id: "QT-005", company: "Global Traders", date: "2026-01-05", validUntil: "2026-02-05", amount: "₹ 42.0L", status: "Expired", createdBy: "Sneha P." },
    { id: "QT-006", company: "Oceanic Resorts", date: "2026-03-20", validUntil: "2026-04-20", amount: "₹ 14.2L", status: "Sent", createdBy: "Rahul Patil" },
    { id: "QT-007", company: "Sunshine Schools", date: "2026-01-15", validUntil: "2026-02-15", amount: "₹ 8.1L", status: "Accepted", createdBy: "Amit S." },
    { id: "QT-008", company: "Apex Hospitals", date: "2026-03-27", validUntil: "2026-04-27", amount: "₹ 35.8L", status: "Rejected", createdBy: "Sneha P." },
];

const QuotationList: React.FC = () => {
    const navigate = useNavigate();
    const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<TimeTab>("Weekly");
    
    // Filter States
    const [statusFilter, setStatusFilter] = useState<Status>("All");
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // --- Date Filtering Helper ---
    const isDateInRange = (dateStr: string, range: TimeTab) => {
        const date = new Date(dateStr);
        const now = new Date("2026-03-20"); 
        
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        switch (range) {
            case "Weekly":
                return diffInDays <= 7 && diffInDays >= 0;
            case "Monthly":
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            case "Quarterly":
                const currentQuarter = Math.floor(now.getMonth() / 3);
                const leadQuarter = Math.floor(date.getMonth() / 3);
                return currentQuarter === leadQuarter && date.getFullYear() === now.getFullYear();
            case "Yearly":
                return date.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    };

    const filteredQuotations = useMemo(() => {
        return quotations.filter((qt) => {
            const matchesSearch = Object.values(qt).some((val) =>
                String(val).toLowerCase().includes(searchQuery.toLowerCase())
            );
            const matchesStatus = statusFilter === "All" || qt.status === statusFilter;
            const matchesTime = isDateInRange(qt.date, activeTab);

            return matchesSearch && matchesStatus && matchesTime;
        });
    }, [quotations, searchQuery, statusFilter, activeTab]);

    const statusLabel = statusFilter === "All" ? "Filter by Status" : statusFilter;

    const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
    const paginatedQuotations = filteredQuotations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedQuotations.length) setSelectedIds([]);
        else setSelectedIds(paginatedQuotations.map(q => q.id));
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = () => {
        if (window.confirm(`Delete ${selectedIds.length} quotations?`)) {
            setQuotations(prev => prev.filter(q => !selectedIds.includes(q.id)));
            setSelectedIds([]);
            setCurrentPage(1);
        }
    };

    const getStatusColor = (st: string) => {
        switch(st) {
            case "Sent": return "bg-blue-50 text-blue-600 border-blue-200";
            case "Draft": return "bg-gray-50 text-gray-600 border-gray-200";
            case "Accepted": return "bg-green-50 text-green-600 border-green-200";
            case "Rejected": return "bg-red-50 text-red-600 border-red-200";
            case "Expired": return "bg-orange-50 text-orange-600 border-orange-200";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    }

    return (
        <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Quotations</h1>
                        <p className="text-sm text-gray-400 mt-1">Manage and track your sales quotes</p>
                    </div>
                    <button
                        onClick={() => navigate("/sales/quotation/new")}
                        className="flex items-center gap-2 bg-[#005d52] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-teal-900/20"
                    >
                        <Plus size={18} strokeWidth={3} /> New Quotation
                    </button>
                </div>

                {/* KPI/Time Tabs Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap gap-2 p-1.5 bg-white/60 rounded-2xl border border-white shadow-sm">
                        {(["Weekly", "Monthly", "Quarterly", "Yearly", "All Time"] as TimeTab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${
                                    activeTab === tab ? "bg-[#005d52] text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 bg-[#005d52] text-white px-4 py-2 rounded-full text-[11px] font-bold">
                        <Calendar size={13} /> {activeTab} View: Mar 2026
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Toolbar */}
                    <div className="p-6 flex flex-col xl:flex-row justify-between items-center gap-4 border-b border-gray-50">
                        <div className="relative w-full xl:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search quotations..."
                                value={searchQuery}
                                onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                                className="w-full pl-11 pr-4 py-2.5 bg-[#f4f7f6] border-none rounded-full focus:ring-2 focus:ring-[#005d52]/20 text-sm outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-center">
                            
                            {/* Status Filter */}
                            <div className="relative">
                                <button 
                                    onClick={() => {setIsStatusOpen(!isStatusOpen);}}
                                    className={`flex items-center gap-3 px-6 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
                                        statusFilter !== "All" 
                                        ? "bg-[#d1e9e7] border-[#005d52] text-[#005d52]" 
                                        : "bg-white border-gray-200 text-gray-700"
                                    }`}
                                >
                                    {statusLabel}
                                    <ChevronDown className={`transition-transform duration-300 ${isStatusOpen ? 'rotate-180' : ''}`} size={16}/>
                                </button>
                                {isStatusOpen && (
                                    <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                        {(["All", "Draft", "Sent", "Accepted", "Rejected", "Expired"] as Status[]).map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => {setStatusFilter(s); setIsStatusOpen(false); setCurrentPage(1)}}
                                                className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition-colors ${statusFilter === s ? "text-[#005d52] font-bold" : "text-gray-600"}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Clear All Filters */}
                            {(statusFilter !== "All" || activeTab !== "All Time") && (
                                <button 
                                    onClick={() => {setStatusFilter("All"); setActiveTab("All Time"); setCurrentPage(1)}}
                                    className="p-2.5 text-gray-400 hover:text-[#005d52] transition-colors"
                                    title="Clear Filters"
                                >
                                    <X size={20} />
                                </button>
                            )}

                            <button onClick={handleDelete} disabled={selectedIds.length === 0} className="p-2.5 bg-red-50 text-red-500 rounded-lg disabled:opacity-30 transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-200">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-800 uppercase tracking-widest">
                                    <th className="p-5 w-12 sticky left-0 bg-gray-50/50 z-10">
                                        <input type="checkbox" className="accent-[#005d52]" checked={selectedIds.length === paginatedQuotations.length && paginatedQuotations.length > 0} onChange={toggleSelectAll} />
                                    </th>
                                    {[
                                        "Quote ID", "Date Created", "Valid Until", "Company Name", 
                                        "Total Amount", "Status", "Created By", "Actions"
                                    ].map((col) => (
                                        <th key={col} className="p-5 border-l border-gray-100 whitespace-nowrap">
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-gray-800">
                                                {col} <ChevronsUpDown size={12} className="opacity-40" />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedQuotations.map((qt) => (
                                    <tr key={qt.id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="p-5 sticky left-0 bg-white z-10"><input type="checkbox" className="accent-[#005d52]" checked={selectedIds.includes(qt.id)} onChange={() => toggleSelectOne(qt.id)} /></td>
                                        <td className="p-5 text-sm font-bold text-[#005d52]">{qt.id}</td>
                                        <td className="p-5 text-sm text-gray-800">{qt.date}</td>
                                        <td className="p-5 text-sm text-gray-800">{qt.validUntil}</td>
                                        <td className="p-5 text-sm text-gray-800 font-medium">{qt.company}</td>
                                        <td className="p-5 text-sm text-gray-800 font-extrabold">{qt.amount}</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold whitespace-nowrap ${getStatusColor(qt.status)}`}>
                                                {qt.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-gray-700 whitespace-nowrap">{qt.createdBy}</td>
                                        <td className="p-5">
                                            <div className="flex gap-2">
                                                <button onClick={() => navigate(`/sales/quotation-view/${qt.id}`)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"><Eye size={18}/></button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"><Download size={16}/></button>
                                                <button className="p-1.5 hover:bg-red-50 rounded-md text-gray-600 hover:text-red-500 transition-colors" onClick={() => {setQuotations(prev => prev.filter(q => q.id !== qt.id))}}><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedQuotations.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="p-20 text-center text-gray-400 italic">No quotations match your criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 bg-gray-50/20 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing <span className="text-gray-800">{paginatedQuotations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredQuotations.length)}</span> out of <span className="text-gray-800">{filteredQuotations.length}</span> Quotations
                        </p>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev-1, 1))} disabled={currentPage === 1} className="text-xs font-bold text-gray-400 hover:text-[#005d52] disabled:opacity-20 flex items-center gap-1 uppercase"><ChevronLeft size={16}/> Prev</button>
                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === i+1 ? "bg-[#005d52] text-white shadow-md" : "text-gray-400 hover:bg-gray-100"}`}>{i+1}</button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev+1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="text-xs font-bold text-gray-400 hover:text-[#005d52] disabled:opacity-20 flex items-center gap-1 uppercase">Next <ChevronRight size={16}/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationList;
