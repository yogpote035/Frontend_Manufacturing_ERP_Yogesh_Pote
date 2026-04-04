import React from "react";
import {
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  BarChart3,
  MapPin,
  Settings,
  MoreVertical,
  Activity,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Award,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from "recharts";

// --- Interfaces ---
interface PerformanceData {
  name: string;
  sales: number;
  leads: number;
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  isPositive?: boolean;
}

// --- Mock Data ---
const PERFORMANCE_DATA: PerformanceData[] = [
  { name: "Week 1", sales: 4000, leads: 24 },
  { name: "Week 2", sales: 3000, leads: 18 },
  { name: "Week 3", sales: 2000, leads: 22 },
  { name: "Week 4", sales: 2780, leads: 29 },
  { name: "Week 5", sales: 1890, leads: 15 },
  { name: "Week 6", sales: 2390, leads: 25 },
  { name: "Week 7", sales: 3490, leads: 32 },
];

const ViewSalesEmployee: React.FC = () => {
  const navigate = useNavigate();

  const employee = {
    id: "EMP-SAL-001",
    name: "Sneha Patil",
    role: "Senior Sales Lead",
    email: "sneha.p@electronics.in",
    phone: "+91 98234 56789",
    location: "Pune, MH",
    joined: "12 Jan 2024",
    status: "Active",
    territory: "Western Region"
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER & BREADCRUMBS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
           <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm font-medium">
                         <button onClick={() => navigate("/sales/employees")} className="hover:text-[#005d52] flex items-center gap-1 transition-colors">
                           Employee
                         </button>
                         <ChevronRight size={14} />
                         <span className="text-slate-600">EMP-001</span>
                         {/* <ChevronRight size={14} /> */}
                         {/* <span className="text-slate-600">E001</span> */}
                       </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Employee Intelligence</h1>
          </div>

          <div className="flex gap-3">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm transition-all"><Settings size={18}/></button>
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm transition-all"><MoreVertical size={18}/></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: PROFILE SUMMARY */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-[#005d52] to-[#004a41] relative">
                 <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest">{employee.status}</p>
                 </div>
              </div>

              <div className="px-8 pb-10 text-center">
                <div className="relative -mt-16 mb-6 inline-block">
                  <div className="w-32 h-32 bg-white p-2 rounded-[2rem] shadow-2xl">
                    <div className="w-full h-full rounded-[1.5rem] bg-[#d1e9e7] flex items-center justify-center text-3xl font-black text-[#005d52]">
                      SP
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-slate-900">{employee.name}</h2>
                <p className="text-[10px] font-black text-[#005d52] uppercase tracking-[0.2em] mt-3 bg-teal-50 inline-block px-4 py-1.5 rounded-full border border-teal-100">
                  {employee.role}
                </p>

                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                  <InfoRow icon={<Mail size={16} />} label="Official Email" text={employee.email} />
                  <InfoRow icon={<Phone size={16} />} label="Direct Line" text={employee.phone} />
                  <InfoRow icon={<MapPin size={16} />} label="HQ Location" text={employee.location} />
                  <InfoRow icon={<ShieldCheck size={16} />} label="Assigned Territory" text={employee.territory} />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl flex items-center gap-5 border border-white/5">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-teal-400 border border-white/10">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Onboarded Since</p>
                <p className="text-lg font-black tracking-wide mt-0.5">{employee.joined}</p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: ANALYTICS & STATS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricsCard label="Active Leads" value="48" icon={<Activity size={20} />} trend="+12% Week" isPositive={true} />
              <MetricsCard label="Conversions" value="12" icon={<Target size={20} />} trend="+2.4% MoM" isPositive={true} />
              <MetricsCard label="Revenue Gen." value="₹12.4L" icon={<BarChart3 size={20} />} trend="Target: 15L" isPositive={false} />
            </div>

            {/* REAL CHART SECTION */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em]">Performance Analytics</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Weekly Sales vs Lead Generation</p>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-2 px-3 py-1 bg-teal-50 rounded-lg border border-teal-100">
                      <div className="w-2 h-2 rounded-full bg-[#005d52]" />
                      <span className="text-[9px] font-black text-[#005d52] uppercase">Sales</span>
                   </div>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                    />
                    <Bar dataKey="sales" radius={[6, 6, 0, 0]} barSize={32}>
                      {PERFORMANCE_DATA.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 6 ? "#005d52" : "#d1e9e7"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* SKILLS BOX */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <Award size={16} className="text-[#005d52]" /> System Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Enterprise CRM", "Bulk Quoting", "Industrial Inventory", "Client Retention", "Field Sales"].map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-teal-50 hover:text-[#005d52] hover:border-teal-100 transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* SECONDARY AREA CHART */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <TrendingUp size={16} className="text-teal-500" /> Lead Velocity
                </h3>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PERFORMANCE_DATA}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="leads" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; text: string }> = ({ icon, label, text }) => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-[#005d52] transition-all">
      {icon}
    </div>
    <div className="text-left">
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{text}</p>
    </div>
  </div>
);

const MetricsCard: React.FC<MetricCardProps> = ({ label, value, icon, trend, isPositive }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center hover:border-teal-500/20 hover:shadow-xl hover:shadow-teal-900/5 transition-all group">
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{value}</h3>
      <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${isPositive ? 'text-green-500' : 'text-slate-400'}`}>
        {isPositive && <TrendingUp size={12} />}
        {trend}
      </div>
    </div>
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#d1e9e7] group-hover:text-[#005d52] transition-all border border-slate-100 shadow-inner">
      {icon}
    </div>
  </div>
);

export default ViewSalesEmployee;