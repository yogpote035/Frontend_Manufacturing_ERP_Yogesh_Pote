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
type Priority = "High" | "Medium" | "Low" | "All";
type Stage = "Discovery" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost" | "All";
type Source = "Dealer" | "Website" | "Referral" | "Trade Show" | "Cold Call" | "All";
type TimeTab = "Weekly" | "Monthly" | "Quarterly" | "Yearly" | "All Time";

type Opportunity = {
    id: string;
    company: string;
    contact: string;
    number: string;
    email: string;
    expectedValue: string;
    source: Exclude<Source, "All">;
    stage: Exclude<Stage, "All">;
    priority: Exclude<Priority, "All">;
    assignedTo: string;
    expectedCloseDate: string; // ISO Format: YYYY-MM-DD
    createdAt: string; 
};

// --- Mock Data ---
const INITIAL_OPPORTUNITIES: Opportunity[] = [
    { 
        id: "OP001", company: "Rajesh Electronics", contact: "Rakesh Patil", number: "9869226825", 
        email: "rajeshelectronics@gmail.com", expectedValue: "₹ 25.5L", source: "Dealer", 
        stage: "Proposal", priority: "High", assignedTo: "Rahul Patil", 
        expectedCloseDate: "2026-03-31", createdAt: "2026-03-18" 
    },
    { 
        id: "OP002", company: "Modern Appliances", contact: "Rohit Sharma", number: "9822334455", 
        email: "modern@appl.com", expectedValue: "₹ 5.5L", source: "Website", 
        stage: "Negotiation", priority: "Medium", assignedTo: "Sneha P.", 
        expectedCloseDate: "2026-04-15", createdAt: "2026-03-10" 
    },
    { 
        id: "OP003", company: "Kitchen Hub", contact: "Anjali M.", number: "9123456789", 
        email: "hub@kitchen.com", expectedValue: "₹ 11.2L", source: "Referral", 
        stage: "Discovery", priority: "Low", assignedTo: "Rahul Patil", 
        expectedCloseDate: "2026-05-10", createdAt: "2026-02-15" 
    },
    { 
        id: "OP004", company: "Elite Tech Solutions", contact: "Vikram Singh", number: "9811223344", 
        email: "v.singh@elitetech.in", expectedValue: "₹ 18.75L", source: "Trade Show", 
        stage: "Closed Won", priority: "High", assignedTo: "Amit S.", 
        expectedCloseDate: "2026-03-25", createdAt: "2026-03-19"
    },
    { 
        id: "OP005", company: "Global Traders", contact: "Suresh Raina", number: "9766554433", 
        email: "suresh@global.com", expectedValue: "₹ 42.0L", source: "Cold Call", 
        stage: "Proposal", priority: "Medium", assignedTo: "Sneha P.", 
        expectedCloseDate: "2026-05-20", createdAt: "2026-03-05" 
    },
    { 
        id: "OP006", company: "Oceanic Resorts", contact: "Priya Nair", number: "9000112233", 
        email: "procurement@oceanic.com", expectedValue: "₹ 14.2L", source: "Website", 
        stage: "Discovery", priority: "High", assignedTo: "Rahul Patil", 
        expectedCloseDate: "2026-04-05", createdAt: "2026-02-20" 
    },
    { 
        id: "OP007", company: "Sunshine Schools", contact: "Meera Das", number: "8877665544", 
        email: "admin@sunshine.edu", expectedValue: "₹ 8.1L", source: "Referral", 
        stage: "Closed Won", priority: "High", assignedTo: "Amit S.", 
        expectedCloseDate: "2026-02-28", createdAt: "2026-01-15" 
    },
    { 
        id: "OP008", company: "Apex Hospitals", contact: "Dr. K. Verma", number: "7766554433", 
        email: "verma@apexhospital.org", expectedValue: "₹ 35.8L", source: "Dealer", 
        stage: "Negotiation", priority: "High", assignedTo: "Sneha P.", 
        expectedCloseDate: "2026-04-10", createdAt: "2026-03-17" 
    },
    { 
        id: "OP009", company: "Blue Diamond Hotels", contact: "Sandeep Gupta", number: "9988443322", 
        email: "sandeep@bluediamond.com", expectedValue: "₹ 49.4L", source: "Trade Show", 
        stage: "Closed Lost", priority: "Medium", assignedTo: "Rahul Patil", 
        expectedCloseDate: "2026-03-10", createdAt: "2026-01-05" 
    },
    { 
        id: "OP010", company: "Smart Offices", contact: "Kiran Shah", number: "9112233445", 
        email: "kiran@smartoffice.com", expectedValue: "₹ 52.5L", source: "Website", 
        stage: "Proposal", priority: "High", assignedTo: "Amit S.", 
        expectedCloseDate: "2026-05-01", createdAt: "2026-03-14" 
    },
    { 
        id: "OP011", company: "Tech Park Canteen", contact: "Arjun Rao", number: "8008007001", 
        email: "arjun@techpark.in", expectedValue: "₹ 4.8L", source: "Cold Call", 
        stage: "Discovery", priority: "Low", assignedTo: "Sneha P.", 
        expectedCloseDate: "2026-06-15", createdAt: "2025-12-15" 
    }
];

const OpportunityList: React.FC = () => {
    const navigate = useNavigate();
    const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<TimeTab>("Weekly");
    
    // Filter States
    const [priorityFilter, setPriorityFilter] = useState<Priority>("All");
    const [stageFilter, setStageFilter] = useState<Stage>("All");
    const [sourceFilter, setSourceFilter] = useState<Source>("All");
    
    // UI Open/Close States
    const [isPriorityOpen, setIsPriorityOpen] = useState(false);
    const [isStageOpen, setIsStageOpen] = useState(false);
    const [isSourceOpen, setIsSourceOpen] = useState(false);

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

    const filteredOpportunities = useMemo(() => {
        return opportunities.filter((opp) => {
            const matchesSearch = Object.values(opp).some((val) =>
                String(val).toLowerCase().includes(searchQuery.toLowerCase())
            );
            const matchesPriority = priorityFilter === "All" || opp.priority === priorityFilter;
            const matchesStage = stageFilter === "All" || opp.stage === stageFilter;
            const matchesSource = sourceFilter === "All" || opp.source === sourceFilter;
            const matchesTime = isDateInRange(opp.createdAt, activeTab);

            return matchesSearch && matchesPriority && matchesStage && matchesSource && matchesTime;
        });
    }, [opportunities, searchQuery, priorityFilter, stageFilter, sourceFilter, activeTab]);

    const priorityLabel = priorityFilter === "All" ? "Priorities" : priorityFilter;
    const stageLabel = stageFilter === "All" ? "Filter by Stage" : stageFilter;
    const sourceLabel = sourceFilter === "All" ? "Select source" : sourceFilter;

    const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
    const paginatedOpportunities = filteredOpportunities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedOpportunities.length) setSelectedIds([]);
        else setSelectedIds(paginatedOpportunities.map(o => o.id));
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = () => {
        if (window.confirm(`Delete ${selectedIds.length} opportunities?`)) {
            setOpportunities(prev => prev.filter(o => !selectedIds.includes(o.id)));
            setSelectedIds([]);
            setCurrentPage(1);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Opportunities</h1>
                        <p className="text-sm text-gray-400 mt-1">Track and manage prospective deals</p>
                    </div>
                    <button
                        onClick={() => navigate("/sales/opportunities")}
                        className="flex items-center gap-2 bg-[#005d52] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-teal-900/20"
                    >
                        <Plus size={18} strokeWidth={3} /> New Opportunity
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
                                placeholder="Search opportunities..."
                                value={searchQuery}
                                onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                                className="w-full pl-11 pr-4 py-2.5 bg-[#f4f7f6] border-none rounded-full focus:ring-2 focus:ring-[#005d52]/20 text-sm outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-center">
                            
                            {/* Source Filter */}
                            <div className="relative">
                                <button 
                                    onClick={() => {setIsSourceOpen(!isSourceOpen); setIsPriorityOpen(false); setIsStageOpen(false)}}
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
                                    onClick={() => {setIsPriorityOpen(!isPriorityOpen); setIsStageOpen(false); setIsSourceOpen(false)}}
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
                                        {(["All", "High", "Medium", "Low"] as Priority[]).map(p => (
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

                            {/* Stage Filter */}
                            <div className="relative">
                                <button 
                                    onClick={() => {setIsStageOpen(!isStageOpen); setIsPriorityOpen(false); setIsSourceOpen(false)}}
                                    className={`flex items-center gap-3 px-6 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
                                        stageFilter !== "All" 
                                        ? "bg-[#d1e9e7] border-[#005d52] text-[#005d52]" 
                                        : "bg-white border-gray-200 text-gray-700"
                                    }`}
                                >
                                    {stageLabel}
                                    <ChevronDown className={`transition-transform duration-300 ${isStageOpen ? 'rotate-180' : ''}`} size={16}/>
                                </button>
                                {isStageOpen && (
                                    <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                        {(["All", "Discovery", "Proposal", "Negotiation", "Closed Won", "Closed Lost"] as Stage[]).map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => {setStageFilter(s); setIsStageOpen(false); setCurrentPage(1)}}
                                                className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition-colors ${stageFilter === s ? "text-[#005d52] font-bold" : "text-gray-600"}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Clear All Filters */}
                            {(priorityFilter !== "All" || stageFilter !== "All" || sourceFilter !== "All" || activeTab !== "All Time") && (
                                <button 
                                    onClick={() => {setPriorityFilter("All"); setStageFilter("All"); setSourceFilter("All"); setActiveTab("All Time"); setCurrentPage(1)}}
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
                                        <input type="checkbox" className="accent-[#005d52]" checked={selectedIds.length === paginatedOpportunities.length && paginatedOpportunities.length > 0} onChange={toggleSelectAll} />
                                    </th>
                                    {[
                                        "Opp ID", "Date Created", "Company name", "Est. value", 
                                        "Priority", "Exp. Close Date", "Actions"
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
                                {paginatedOpportunities.map((opp) => (
                                    <tr key={opp.id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="p-5 sticky left-0 bg-white z-10"><input type="checkbox" className="accent-[#005d52]" checked={selectedIds.includes(opp.id)} onChange={() => toggleSelectOne(opp.id)} /></td>
                                        <td className="p-5 text-sm ">{opp.id}</td>
                                        <td className="p-5 text-sm text-gray-800">{opp.createdAt}</td>
                                        <td className="p-5 text-sm  text-gray-800">{opp.company}</td>
                                        <td className="p-5 text-sm text-gray-800">{opp.expectedValue}</td>
                                        <td className="p-5 text-sm text-gray-700">{opp.priority}</td>
                                        <td className="p-5 text-sm text-gray-800 ">{opp.expectedCloseDate}</td>
                                        <td className="p-5">
                                            <div className="flex gap-2">
                                                <button onClick={() => navigate(`/sales/opportunity-view/${opp.id}`)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 "><Eye size={18}/></button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"><FileEdit size={16}/></button>
                                                <button className="p-1.5 hover:bg-red-50 rounded-md text-gray-600 hover:text-red-500 " onClick={() => {setOpportunities(prev => prev.filter(o => o.id !== opp.id))}}><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedOpportunities.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-20 text-center text-gray-400 italic">No opportunities match your criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 bg-gray-50/20 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing <span className="text-gray-800">{paginatedOpportunities.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOpportunities.length)}</span> out of <span className="text-gray-800">{filteredOpportunities.length}</span> Opportunities
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

export default OpportunityList;
