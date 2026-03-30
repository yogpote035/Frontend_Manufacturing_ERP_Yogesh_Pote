import  { useState, useMemo } from "react";
import type { FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// --- Types ---
type TimeRange = "Weekly" | "Monthly" | "Quarterly" | "Yearly";

interface LeaderboardItem {
  name: string;
  leads: number;
  conversion: string;
  revenue: string;
}

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  svg: string;
  isNeg?: boolean;
}

// --- Theme Config ---
const THEME = {
  primary: "#005d52",
  secondary: "#4fb29b",
  lightTeal: "#d1e9e7",
  chart: ["#005d52", "#4fb29b", "#b0d9d9", "#f08552"]
};

// --- Mock Data Store ---
const DATA_STORE: Record<TimeRange, any> = {
  Weekly: {
    revenue: [{ name: "Mon", val: 1.2 }, { name: "Tue", val: 2.1 }, { name: "Wed", val: 1.8 }, { name: "Thu", val: 3.4 }, { name: "Fri", val: 2.9 }, { name: "Sat", val: 4.1 }, { name: "Sun", val: 3.2 }],
    sources: [{ name: "Trade Fair", value: 40 }, { name: "Referral", value: 30 }, { name: "Web", value: 20 }, { name: "Direct", value: 10 }],
    kpis: { rev: "₹12.4L", leads: "42", conv: "9.5%", avg: "₹0.8L" },
    leaderboard: [{ name: "Sneha Patil", leads: 12, conversion: "10%", revenue: "₹2.1L" }, { name: "Rahul Deshpande", leads: 8, conversion: "12%", revenue: "₹3.4L" }]
  },
  Monthly: {
    revenue: [{ name: "W1", val: 10 }, { name: "W2", val: 18 }, { name: "W3", val: 14 }, { name: "W4", val: 22 }],
    sources: [{ name: "Trade Fair", value: 120 }, { name: "Referral", value: 80 }, { name: "Web", value: 60 }, { name: "Direct", value: 40 }],
    kpis: { rev: "₹48.2L", leads: "233", conv: "14.2%", avg: "₹1.4L" },
    leaderboard: [
      { name: "Sneha Patil", leads: 45, conversion: "12%", revenue: "₹8.4L" },
      { name: "Rahul Deshpande", leads: 38, conversion: "15%", revenue: "₹12.2L" },
      { name: "Anjali Sharma", leads: 52, conversion: "8%", revenue: "₹5.1L" },
      { name: "Priya Mehta", leads: 31, conversion: "22%", revenue: "₹14.8L" }
    ]
  },
  Quarterly: {
    revenue: [{ name: "Jan", val: 35 }, { name: "Feb", val: 42 }, { name: "Mar", val: 51 }],
    sources: [{ name: "Trade Fair", value: 350 }, { name: "Referral", value: 210 }, { name: "Web", value: 140 }, { name: "Direct", value: 100 }],
    kpis: { rev: "₹1.2Cr", leads: "680", conv: "12.8%", avg: "₹1.9L" },
    leaderboard: [{ name: "Priya Mehta", leads: 120, conversion: "20%", revenue: "₹45.2L" }, { name: "Rahul Deshpande", leads: 95, conversion: "18%", revenue: "₹38.1L" }, { name: "Sneha Patil", leads: 110, conversion: "14%", revenue: "₹31.5L" }]
  },
  Yearly: {
    revenue: [{ name: "2023", val: 120 }, { name: "2024", val: 240 }, { name: "2025", val: 310 }],
    sources: [{ name: "Trade Fair", value: 1500 }, { name: "Referral", value: 1000 }, { name: "Web", value: 500 }, { name: "Direct", value: 300 }],
    kpis: { rev: "₹4.8Cr", leads: "2.4K", conv: "15.4%", avg: "₹2.2L" },
    leaderboard: [{ name: "Rahul Deshpande", leads: 420, conversion: "16%", revenue: "₹1.4Cr" }, { name: "Sneha Patil", leads: 380, conversion: "14%", revenue: "₹1.1Cr" }, { name: "Priya Mehta", leads: 450, conversion: "24%", revenue: "₹1.8Cr" }]
  }
};

const ReportsAndAnalytics: FC = () => {
  const [range, setRange] = useState<TimeRange>("Monthly");
  const currentData = useMemo(() => DATA_STORE[range], [range]);

  // --- Export Logic ---
  const handleExport = () => {
    const headers = ["Name", "Leads", "Conversion", "Revenue"];
    const rows = currentData.leaderboard.map((item: LeaderboardItem) => [
      item.name, item.leads, item.conversion, item.revenue
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map((e: any) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sales_Report_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Reports & Analytics</h1>
            <p className="text-sm text-gray-400 mt-1">Data insights for the {range} period.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={handleExport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              <Download size={16} /> Export CSV
            </button>
            <button 
              onClick={() => alert("Report scheduled for next Monday!")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#005d52] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-teal-900/20 hover:opacity-90 active:scale-95 transition-all"
            >
              <Calendar size={16} /> Schedule
            </button>
          </div>
        </div>

        {/* Dynamic Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex gap-2 p-1.5 bg-white/60 rounded-2xl border border-white shadow-sm w-fit overflow-x-auto">
            {(["Weekly", "Monthly", "Quarterly", "Yearly"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-6 py-2 text-xs font-bold rounded-xl transition-all duration-300 whitespace-nowrap ${
                  range === r ? "bg-[#d1e9e7] text-[#005d52] shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="bg-[#005d52] text-white px-5 py-2 rounded-full text-[11px] font-bold shadow-md shadow-teal-900/10">
            {range === "Weekly" ? "Current Week" : `FY 2025-26 - ${range}`}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Revenue" value={currentData.kpis.rev} trend="+12.4%" svg="/icons/inr.svg" />
          <StatCard label="Active Leads" value={currentData.kpis.leads} trend="+18" svg="/icons/users-bold.svg" />
          <StatCard label="Conv. Rate" value={currentData.kpis.conv} trend="-2.1%" isNeg svg="/icons/percent.svg" />
          <StatCard label="Avg Deal Value" value={currentData.kpis.avg} trend="+5.2%" svg="/icons/graph-up.svg" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white rounded-4xl p-6 sm:p-8 border border-gray-50 shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-8">Revenue Growth Trend</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData.revenue} margin={{ left: -20 }}>
                  <defs>
                    <linearGradient id="pGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={THEME.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#cbd5e1' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="val" stroke={THEME.primary} strokeWidth={4} fill="url(#pGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-4xl p-8 border border-gray-50 shadow-sm flex flex-col">
            <h3 className="font-bold text-lg text-gray-800 mb-6">Lead Sources</h3>
            <div className="flex-1 flex flex-col justify-center">
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={currentData.sources} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" cornerRadius={6}>
                      {currentData.sources.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} tabIndex={-1} style={{outline:"none"}} fill={THEME.chart[index % THEME.chart.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-6">
                {currentData.sources.map((s: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: THEME.chart[i % THEME.chart.length] }}></div>
                      <span className="text-gray-400 uppercase tracking-widest">{s.name}</span>
                    </div>
                    <span className="text-gray-800">{Math.round((s.value / currentData.sources.reduce((a: number, b: any) => a + b.value, 0)) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-4xl border border-gray-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Performance Leaderboard</h3>
              <span className="text-[10px] font-bold text-[#005d52] uppercase tracking-widest">Top Reps</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/30 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Representative</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Leads</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Conversion</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentData.leaderboard.map((person: LeaderboardItem, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#d1e9e7] flex items-center justify-center text-[#005d52] font-bold text-xs">
                        {person.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-800">{person.name}</span>
                    </td>
                    <td className="px-8 py-5 text-center text-sm text-gray-500 font-semibold">{person.leads}</td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 bg-[#d1e9e7] text-[#005d52] rounded-full text-[10px] font-bold">{person.conversion}</span>
                    </td>
                    <td className="px-8 py-5 text-right text-sm font-bold text-gray-800">{person.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Stat Card Sub-Component ---
const StatCard: FC<StatCardProps> = ({ label, value, trend, svg, isNeg }) => (
  <div className="bg-white rounded-[28px] p-6 border border-gray-50 hover:border-[#005d52]/30 transition-all group shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-[#f4f7f6] rounded-2xl text-[#005d52] group-hover:bg-[#005d52] group-hover:text-white transition-all duration-300 shadow-sm">
        <img
          src={svg}
          className="h-5 w-5 transition-all duration-300 
             brightness-0 saturate-100 
             invert-[23%] sepia-[21%] saturate-[1100%] hue-rotate-[120deg] brightness-[90%]
             group-hover:invert group-hover:brightness-0"
          alt=""
        />            </div>
      <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${isNeg ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
        {isNeg ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />} {trend}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default ReportsAndAnalytics;