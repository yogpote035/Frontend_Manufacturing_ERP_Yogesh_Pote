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
    FileEdit,
    X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Types ---
type Priority = "Hot" | "Warm" | "Cold" | "All";
type Status = "New Lead" | "Contacted" | "Converted" | "Quotation" | "Won" | "Lost" | "All";
type Source = "Dealer" | "Website" | "Referral" | "Trade Show" | "Cold Call" | "All";
type TimeTab = "Weekly" | "Monthly" | "Quarterly" | "Yearly" | "All Time";

type Lead = {
    id: string;
    company: string;
    contact: string;
    number: string;
    email: string;
    gst: string;
    state: string;
    product: string;
    variant: string;
    quantity: number;
    unit: string;
    estValue: string;
    source: Exclude<Source, "All">;
    status: Exclude<Status, "All">;
    priority: Exclude<Priority, "All">;
    assignedTo: string;
    followUp: string;
    createdAt: string; // Added for date filtering (ISO Format: YYYY-MM-DD)
};

// --- Mock Data with varied dates for filtering ---
const INITIAL_LEADS: Lead[] = [
    { 
        id: "L001", company: "Rajesh Electronics", contact: "Rakesh Patil", number: "9869226825", 
        email: "rajeshelectronics@gmail.com", gst: "NPSS91543234342", state: "Maharashtra", 
        product: "Refrigerator", variant: "4-door 500L", quantity: 10, unit: "Units", 
        estValue: "₹ 18.5L", source: "Dealer", status: "New Lead", priority: "Hot", 
        assignedTo: "Rahul Patil", followUp: "21-03-2026", createdAt: "2026-03-18" 
    },
    { 
        id: "L002", company: "Modern Appliances", contact: "Rohit Sharma", number: "9822334455", 
        email: "modern@appl.com", gst: "GSTIN2233445566", state: "Delhi", 
        product: "AC", variant: "1.5 Ton Split", quantity: 5, unit: "Units", 
        estValue: "₹ 2.5L", source: "Website", status: "Quotation", priority: "Warm", 
        assignedTo: "Sneha P.", followUp: "22-03-2026", createdAt: "2026-03-10" 
    },
    { 
        id: "L003", company: "Kitchen Hub", contact: "Anjali M.", number: "9123456789", 
        email: "hub@kitchen.com", gst: "GSTIN998877", state: "Karnataka", 
        product: "Microwave", variant: "Solo 20L", quantity: 20, unit: "Units", 
        estValue: "₹ 1.2L", source: "Referral", status: "Won", priority: "Cold", 
        assignedTo: "Rahul Patil", followUp: "15-02-2026", createdAt: "2026-02-15" 
    },
    { 
        id: "L004", company: "Elite Tech Solutions", contact: "Vikram Singh", number: "9811223344", 
        email: "v.singh@elitetech.in", gst: "27AAACE1234F1Z5", state: "Gujarat", 
        product: "Washing Machine", variant: "Front Load 8kg", quantity: 15, unit: "Units", 
        estValue: "₹ 6.75L", source: "Trade Show", status: "Contacted", priority: "Hot", 
        assignedTo: "Amit S.", followUp: "25-03-2026", createdAt: "2026-03-19" // Weekly
    },
    { 
        id: "L005", company: "Global Traders", contact: "Suresh Raina", number: "9766554433", 
        email: "suresh@global.com", gst: "07AABC9988H1Z2", state: "Uttar Pradesh", 
        product: "Air Purifier", variant: "HEPA Pro Max", quantity: 50, unit: "Units", 
        estValue: "₹ 12.0L", source: "Cold Call", status: "New Lead", priority: "Cold", 
        assignedTo: "Sneha P.", followUp: "10-04-2026", createdAt: "2026-03-05" // Monthly
    },
    { 
        id: "L006", company: "Oceanic Resorts", contact: "Priya Nair", number: "9000112233", 
        email: "procurement@oceanic.com", gst: "33BBDDC4433P1Z9", state: "Tamil Nadu", 
        product: "Deep Freezer", variant: "Double Door 400L", quantity: 8, unit: "Units", 
        estValue: "₹ 4.2L", source: "Website", status: "Quotation", priority: "Warm", 
        assignedTo: "Rahul Patil", followUp: "28-03-2026", createdAt: "2026-02-20" // Quarterly
    },
    { 
        id: "L007", company: "Sunshine Schools", contact: "Meera Das", number: "8877665544", 
        email: "admin@sunshine.edu", gst: "19CCCDD5566Q1Z0", state: "West Bengal", 
        product: "Water Cooler", variant: "Stainless Steel 60L", quantity: 12, unit: "Units", 
        estValue: "₹ 3.1L", source: "Referral", status: "Converted", priority: "Hot", 
        assignedTo: "Amit S.", followUp: "30-03-2026", createdAt: "2026-01-15" // Quarterly
    },
    { 
        id: "L008", company: "Apex Hospitals", contact: "Dr. K. Verma", number: "7766554433", 
        email: "verma@apexhospital.org", gst: "09EEFFG1122R1Z4", state: "Haryana", 
        product: "Air Conditioner", variant: "2.0 Ton Cassette", quantity: 4, unit: "Units", 
        estValue: "₹ 5.8L", source: "Dealer", status: "Won", priority: "Hot", 
        assignedTo: "Sneha P.", followUp: "20-03-2026", createdAt: "2026-03-17" // Weekly
    },
    { 
        id: "L009", company: "Blue Diamond Hotels", contact: "Sandeep Gupta", number: "9988443322", 
        email: "sandeep@bluediamond.com", gst: "24GGHHI3344S1Z1", state: "Rajasthan", 
        product: "Dishwasher", variant: "Commercial 12-place", quantity: 6, unit: "Units", 
        estValue: "₹ 9.4L", source: "Trade Show", status: "Lost", priority: "Warm", 
        assignedTo: "Rahul Patil", followUp: "05-03-2026", createdAt: "2026-01-05" // Quarterly
    },
    { 
        id: "L010", company: "Smart Offices", contact: "Kiran Shah", number: "9112233445", 
        email: "kiran@smartoffice.com", gst: "27IIJJK5566T1Z8", state: "Maharashtra", 
        product: "Smart TV", variant: "65-inch 4K OLED", quantity: 25, unit: "Units", 
        estValue: "₹ 32.5L", source: "Website", status: "New Lead", priority: "Hot", 
        assignedTo: "Amit S.", followUp: "02-04-2026", createdAt: "2026-03-14" // Weekly/Monthly
    },
    { 
        id: "L011", company: "Tech Park Canteen", contact: "Arjun Rao", number: "8008007001", 
        email: "arjun@techpark.in", gst: "36KKLLM7788U1Z3", state: "Telangana", 
        product: "Induction Cooktop", variant: "High Power 3000W", quantity: 30, unit: "Units", 
        estValue: "₹ 1.8L", source: "Cold Call", status: "Contacted", priority: "Cold", 
        assignedTo: "Sneha P.", followUp: "26-03-2026", createdAt: "2025-12-15" // Yearly
    }
];

const LeadList: React.FC = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<TimeTab>("Weekly");
    
    // Filter States
    const [priorityFilter, setPriorityFilter] = useState<Priority>("All");
    const [statusFilter, setStatusFilter] = useState<Status>("All");
    const [sourceFilter, setSourceFilter] = useState<Source>("All");
    
    // UI Open/Close States
    const [isPriorityOpen, setIsPriorityOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isSourceOpen, setIsSourceOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // --- Date Filtering Helper ---
    // Note: We use March 20, 2026 as a reference "today" to match your UI context
    const isDateInRange = (dateStr: string, range: TimeTab) => {
        const date = new Date(dateStr);
        const now = new Date("2026-03-20"); // Using your mock year/month as 'today'
        
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

    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            const matchesSearch = Object.values(lead).some((val) =>
                String(val).toLowerCase().includes(searchQuery.toLowerCase())
            );
            const matchesPriority = priorityFilter === "All" || lead.priority === priorityFilter;
            const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
            const matchesSource = sourceFilter === "All" || lead.source === sourceFilter;
            const matchesTime = isDateInRange(lead.createdAt, activeTab);

            return matchesSearch && matchesPriority && matchesStatus && matchesSource && matchesTime;
        });
    }, [leads, searchQuery, priorityFilter, statusFilter, sourceFilter, activeTab]);

    // Derived values for labels
    const priorityLabel = priorityFilter === "All" ? "Priorities" : priorityFilter;
    const statusLabel = statusFilter === "All" ? "Filter" : statusFilter;
    const sourceLabel = sourceFilter === "All" ? "Select source" : sourceFilter;

    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedLeads.length) setSelectedIds([]);
        else setSelectedIds(paginatedLeads.map(l => l.id));
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = () => {
        if (window.confirm(`Delete ${selectedIds.length} leads?`)) {
            setLeads(prev => prev.filter(l => !selectedIds.includes(l.id)));
            setSelectedIds([]);
            setCurrentPage(1);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
            <div className="max-w-400 mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
                        <p className="text-sm text-gray-400 mt-1">Full customer pipeline overview</p>
                    </div>
                    <button
                        onClick={() => navigate("/sales/new-lead")}
                        className="flex items-center gap-2 bg-[#005d52] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-teal-900/20"
                    >
                        <Plus size={18} strokeWidth={3} /> New Lead
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
                                    activeTab === tab ? "bg-[#d1e9e7] text-[#005d52] shadow-sm" : "text-gray-400 hover:text-gray-600"
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
                                placeholder="Search leads..."
                                value={searchQuery}
                                onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                                className="w-full pl-11 pr-4 py-2.5 bg-[#f4f7f6] border-none rounded-full focus:ring-2 focus:ring-[#005d52]/20 text-sm outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-center">
                            
                            {/* Source Filter */}
                            <div className="relative">
                                <button 
                                    onClick={() => {setIsSourceOpen(!isSourceOpen); setIsPriorityOpen(false); setIsStatusOpen(false)}}
                                    className={`flex items-center gap-3 px-6 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
                                        sourceFilter !== "All" 
                                        ? "bg-[#d1e9e7] border-[#005d52] text-[#005d52]" 
                                        : "bg-white border-gray-200 text-gray-700"
                                    }`}
                                >
                                    {sourceLabel} 
                                    <ChevronDown className={`transition-transform duration-300 ${isSourceOpen ? 'rotate-180' : ''}`} size={16}/>
                                </button>
                                {isSourceOpen && (
                                    <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                        {(["All", "Dealer", "Website", "Referral", "Trade Show", "Cold Call"] as Source[]).map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => {setSourceFilter(s); setIsSourceOpen(false); setCurrentPage(1)}}
                                                className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition-colors ${sourceFilter === s ? "text-[#005d52] font-bold" : "text-gray-600"}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Priorities Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => {setIsPriorityOpen(!isPriorityOpen); setIsStatusOpen(false); setIsSourceOpen(false)}}
                                    className={`flex items-center gap-3 px-6 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
                                        priorityFilter !== "All" 
                                        ? "bg-[#d1e9e7] border-[#005d52] text-[#005d52]" 
                                        : "bg-white border-gray-200 text-gray-700"
                                    }`}
                                >
                                    {priorityLabel} 
                                    <ChevronDown className={`transition-transform duration-300 ${isPriorityOpen ? 'rotate-180' : ''}`} size={16}/>
                                </button>
                                {isPriorityOpen && (
                                    <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                        {(["All", "Hot", "Warm", "Cold"] as Priority[]).map(p => (
                                            <button 
                                                key={p} 
                                                onClick={() => {setPriorityFilter(p); setIsPriorityOpen(false); setCurrentPage(1)}}
                                                className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition-colors ${priorityFilter === p ? "text-[#005d52] font-bold" : "text-gray-600"}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <button 
                                    onClick={() => {setIsStatusOpen(!isStatusOpen); setIsPriorityOpen(false); setIsSourceOpen(false)}}
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
                                        {(["All", "New Lead", "Contacted", "Converted", "Quotation", "Won", "Lost"] as Status[]).map(s => (
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
                            {(priorityFilter !== "All" || statusFilter !== "All" || sourceFilter !== "All" || activeTab !== "All Time") && (
                                <button 
                                    onClick={() => {setPriorityFilter("All"); setStatusFilter("All"); setSourceFilter("All"); setActiveTab("All Time"); setCurrentPage(1)}}
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
                        <table className="w-full text-left border-collapse min-w-500">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <th className="p-5 w-12 sticky left-0 bg-gray-50/50 z-10"><input type="checkbox" className="accent-[#005d52]" checked={selectedIds.length === paginatedLeads.length && paginatedLeads.length > 0} onChange={toggleSelectAll} /></th>
                                    {[
                                        "Lead ID", "Date Created", "Company name", "Contact person", "Number", "Email ID", "GST", "State", 
                                        "Product", "Variant", "Qty", "Unit", "Est. value", "Source", 
                                        "Status", "Priority", "Assigned", "Follow up", "Actions"
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
                                {paginatedLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="p-5 sticky left-0 bg-white z-10"><input type="checkbox" className="accent-[#005d52]" checked={selectedIds.includes(lead.id)} onChange={() => toggleSelectOne(lead.id)} /></td>
                                        <td className="p-5 text-sm font-bold text-[#005d52]">{lead.id}</td>
                                        <td className="p-5 text-sm text-gray-400 italic">{lead.createdAt}</td>
                                        <td className="p-5 text-sm font-medium text-gray-700">{lead.company}</td>
                                        <td className="p-5 text-sm text-gray-500">{lead.contact}</td>
                                        <td className="p-5 text-sm text-gray-500">{lead.number}</td>
                                        <td className="p-5 text-sm text-gray-500 underline decoration-gray-200">{lead.email}</td>
                                        <td className="p-5 text-sm text-gray-400">{lead.gst}</td>
                                        <td className="p-5 text-sm text-gray-500">{lead.state}</td>
                                        <td className="p-5 text-sm text-gray-500 font-semibold">{lead.product}</td>
                                        <td className="p-5 text-sm text-gray-400">{lead.variant}</td>
                                        <td className="p-5 text-sm text-gray-800 font-bold">{lead.quantity}</td>
                                        <td className="p-5 text-sm text-gray-400">{lead.unit}</td>
                                        <td className="p-5 text-sm text-gray-800 font-extrabold">{lead.estValue}</td>
                                        <td className="p-5 text-sm text-gray-500">{lead.source}</td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 rounded-lg border border-gray-300 text-[10px] font-bold text-gray-600 whitespace-nowrap">
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-gray-700 font-medium">{lead.priority}</td>
                                        <td className="p-5 text-sm text-gray-500">{lead.assignedTo}</td>
                                        <td className="p-5 text-sm text-gray-400">{lead.followUp}</td>
                                        <td className="p-5">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"><Eye size={16}/></button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 transition-colors"><FileEdit size={16}/></button>
                                                <button className="p-1.5 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-500 transition-colors" onClick={() => {setLeads(prev => prev.filter(l => l.id !== lead.id))}}><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedLeads.length === 0 && (
                                    <tr>
                                        <td colSpan={19} className="p-20 text-center text-gray-400 italic">No leads match your criteria for the selected period.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 bg-gray-50/20 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing <span className="text-gray-800">{paginatedLeads.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> out of <span className="text-gray-800">{filteredLeads.length}</span> Leads
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

export default LeadList;