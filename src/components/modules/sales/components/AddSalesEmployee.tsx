import React, { useState } from "react";
import {
    Mail,
    Phone,
    Briefcase,
    Globe,
    Save,
    Calendar,
    CheckCircle2,
    X,
    User,
    ShieldCheck,
    ChevronRight,
    FileText,
    ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Interfaces ---
interface EmployeeFormData {
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    designation: string;
    territory: string;
    joiningDate: string;
    employeeId: string;
    status: string;
    notes: string;
}

interface FormInputProps {
    label: string;
    icon: React.ReactNode;
    placeholder?: string;
    type?: string;
    value: string;
    onChange: (val: string) => void;
    required?: boolean;
}

interface FormSelectProps {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void;
    icon?: React.ReactNode;
}

const AddSalesEmployee: React.FC = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // --- Form State ---
    const [formData, setFormData] = useState<EmployeeFormData>({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        designation: "",
        territory: "",
        joiningDate: "",
        employeeId: "",
        status: "Active",
        notes: ""
    });

    const handleSimulateSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate API Call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate("/sales/employees");
            }, 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 font-sans text-slate-900">

            {/* SUCCESS NOTIFICATION TOAST */}
            {showSuccess && (
                <div className="fixed top-6 right-6 z-100 animate-in slide-in-from-right duration-300">
                    <div className="relative flex items-center gap-4 p-5 rounded-2xl shadow-2xl bg-white border-l-4 border-teal-500 min-w-[320px]">
                        <CheckCircle2 className="text-teal-500" size={20} />
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ERP System</h4>
                            <p className="text-sm font-bold text-slate-700">Employee record synchronized.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowSuccess(false)}
                            className="ml-auto text-slate-300 hover:text-slate-500"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto">

                {/* TOP NAVIGATION & HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm font-medium">
                            <button onClick={() => navigate("/sales/employees")} className="hover:text-[#005d52] flex items-center gap-1 transition-colors">
                                Employee
                            </button>
                            <ChevronRight size={14} />
                            <span className="text-slate-600">Add Sales Employee</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add Sales Employee</h1>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="employee-form"
                            disabled={isSaving}
                            className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm text-white bg-[#005d52] shadow-lg shadow-teal-900/20 hover:bg-[#004a41] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isSaving ? "Saving..." : <><Save size={18} /> Save Employee</>}
                        </button>
                    </div>
                </div>

                <form id="employee-form" onSubmit={handleSimulateSave} className="space-y-8">

                    {/* SECTION 1: PERSONAL DETAILS */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                        <SectionHeader icon={<User size={20} />} title="Identity Information" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FormInput
                                label="Full Name"
                                icon={<User size={14} />}
                                placeholder="e.g. Rahul Sharma"
                                value={formData.fullName}
                                onChange={(val) => setFormData({ ...formData, fullName: val })}
                                required
                            />
                            <FormInput
                                label="Email Address"
                                type="email"
                                icon={<Mail size={14} />}
                                placeholder="r.sharma@company.com"
                                value={formData.email}
                                onChange={(val) => setFormData({ ...formData, email: val })}
                                required
                            />
                            <FormInput
                                label="Phone Number"
                                icon={<Phone size={14} />}
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.phone}
                                onChange={(val) => setFormData({ ...formData, phone: val })}
                                required
                            />
                            <FormSelect
                                label="Gender"
                                icon={<User size={14} />}
                                options={["Male", "Female", "Other"]}
                                value={formData.gender}
                                onChange={(val) => setFormData({ ...formData, gender: val })}
                            />
                        </div>
                    </div>

                    {/* SECTION 2: PROFESSIONAL DETAILS */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                        <SectionHeader icon={<Briefcase size={20} />} title="Corporate Assignment" />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FormInput
                                label="Designation"
                                icon={<Briefcase size={14} />}
                                placeholder="Senior Executive"
                                value={formData.designation}
                                onChange={(val) => setFormData({ ...formData, designation: val })}
                            />
                            <FormInput
                                label="Territory"
                                icon={<Globe size={14} />}
                                placeholder="Maharashtra Region"
                                value={formData.territory}
                                onChange={(val) => setFormData({ ...formData, territory: val })}
                            />
                            <FormInput
                                label="Joining Date"
                                type="date"
                                icon={<Calendar size={14} />}
                                value={formData.joiningDate}
                                onChange={(val) => setFormData({ ...formData, joiningDate: val })}
                            />
                            <FormInput
                                label="Employee ID"
                                icon={<ShieldCheck size={14} />}
                                placeholder="EMP-SAL-102"
                                value={formData.employeeId}
                                onChange={(val) => setFormData({ ...formData, employeeId: val })}
                                required
                            />
                        </div>
                    </div>

                    {/* SECTION 3: STATUS & REMARKS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <SectionHeader icon={<ShieldCheck size={18} />} title="Account Control" />
                            <FormSelect
                                label="Employment Status"
                                options={["Active", "Inactive"]}
                                value={formData.status}
                                onChange={(val) => setFormData({ ...formData, status: val })}
                            />
                            <div className="mt-4 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                                <p className="text-[10px] text-teal-700 font-bold leading-relaxed flex items-start gap-2">
                                    <ShieldCheck size={12} className="shrink-0 mt-0.5" />
                                    Note: Onboarding this employee will automatically trigger workspace credentials generation.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-[#f1f8f7] rounded-3xl p-6 border-l-8 border-[#005d52]">
                            <SectionHeader icon={<FileText size={18} />} title="HR Remarks" />
                            <textarea
                                rows={3}
                                placeholder="Add background verification details or specific onboarding instructions..."
                                className="w-full bg-transparent border-none text-sm text-slate-700 italic focus:ring-0 outline-none resize-none"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- INTERNAL UI SUB-COMPONENTS ---

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-teal-50 text-[#005d52] rounded-xl border border-teal-100 shadow-sm">
            {icon}
        </div>
        <h3 className="font-bold text-xl text-slate-800 tracking-tight">{title}</h3>
    </div>
);

const FormInput: React.FC<FormInputProps> = ({ label, icon, placeholder, type = "text", value, onChange, required }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {icon}
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-teal-500/5 focus:border-[#005d52] outline-none transition-all placeholder:text-slate-300"
            />
        </div>
    </div>
);

const FormSelect: React.FC<FormSelectProps> = ({ label, options, value, onChange, icon }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${icon ? 'pl-11' : 'pl-4'} pr-10 py-3 text-sm focus:ring-4 focus:ring-teal-500/5 focus:border-[#005d52] outline-none appearance-none cursor-pointer transition-all`}
            >
                <option value="">Select Level</option>
                {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
    </div>
);

export default AddSalesEmployee;