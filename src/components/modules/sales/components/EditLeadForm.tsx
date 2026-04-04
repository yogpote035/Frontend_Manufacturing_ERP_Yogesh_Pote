import React, { useState, useMemo } from "react";
import {
    ChevronRight,
    Building2,
    Package,
    FileText,
    Plus,
    ChevronDown,
    ArrowLeft,
    Trash2,
    Save,
    MapPin,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Interfaces ---
interface LeadFormData {
    companyName: string;
    contactPerson: string;
    designation: string;
    phoneNumber: string;
    email: string;
    gstNumber: string;
    city: string;
    state: string;
    leadSource: string;
    priority: string;
    expectedDecisionDate: string;
    followUpDate: string;
    initialStatus: string;
    address: string;
    notes: string;
}

interface ProductItem {
    id: number;
    product: string;
    variant: string;
    quantity: number;
    unit: string;
    estValue: number;
}

interface ValidationErrors {
    [key: string]: string;
}

// --- Sub-Component Props ---
interface InputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    error?: string;
}

interface SelectProps {
    label: string;
    name: string;
    value: string;
    options: string[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
}

const EditLeadForm: React.FC = () => {
    const navigate = useNavigate();

    // --- State ---
    const [formData, setFormData] = useState<LeadFormData>({
        companyName: "",
        contactPerson: "",
        designation: "",
        phoneNumber: "",
        email: "",
        gstNumber: "",
        city: "",
        state: "",
        leadSource: "",
        priority: "Warm",
        expectedDecisionDate: "",
        followUpDate: "",
        initialStatus: "New Lead",
        address: "",
        notes: "",
    });

    const [products, setProducts] = useState<ProductItem[]>([
        { id: Date.now(), product: "", variant: "", quantity: 1, unit: "Units", estValue: 0 }
    ]);

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Totals Calculation ---
    const summary = useMemo(() => {
        const qty = products.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
        const val = products.reduce((acc, curr) => acc + ((Number(curr.quantity) || 0) * (Number(curr.estValue) || 0)), 0);
        return { totalQty: qty, totalValue: val };
    }, [products]);

    // --- Validation Logic ---
    const validate = (): boolean => {
        const newErrors: ValidationErrors = {};
        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
        if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required";
        if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Valid 10-digit phone required";
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";

        products.forEach((p, idx) => {
            if (!p.product) newErrors[`prod_${idx}`] = "Select product";
            if (p.quantity <= 0) newErrors[`qty_${idx}`] = "Min 1";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => {
            const temp = { ...prev };
            delete temp[name];
            return temp;
        });
    };

    const handleProductChange = (id: number, field: keyof ProductItem, value: string | number) => {
        setProducts(prev => prev.map(p => {
            if (p.id === id) {
                // Prevent negative numbers
                if ((field === 'quantity' || field === 'estValue')) {
                    const numVal = Math.max(0, Number(value));
                    return { ...p, [field]: numVal };
                }
                return { ...p, [field]: value };
            }
            return p;
        }));
    };

    const addProduct = () => {
        setProducts(prev => [...prev, { id: Date.now(), product: "", variant: "", quantity: 1, unit: "Units", estValue: 0 }]);
    };

    const removeProduct = (id: number) => {
        if (products.length > 1) setProducts(prev => prev.filter(p => p.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            // Simulation of API Call
            setTimeout(() => {
                setIsSubmitting(false);
                navigate("/leads");
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto">

                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm font-medium">
                            <button onClick={() => navigate("/sales/leads")} className="hover:text-[#005d52] flex items-center gap-1 transition-colors">
                                Leads
                            </button>
                            <ChevronRight size={14} />
                            <span className="text-slate-600">Edit Lead</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Lead</h1>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => navigate(-1)}
                            type="button"
                            className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm text-white bg-[#005d52] shadow-lg shadow-teal-900/20 hover:bg-[#004a41] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting ? "Saving..." : <><Save size={18} /> Edit Lead</>}
                        </button>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="bg-white rounded-2xl p-6 mb-8 border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {[
                            { step: 1, label: "Details", active: true },
                            { step: 2, label: "Products", active: false },
                            { step: 3, label: "Review", active: false }
                        ].map((item, idx) => (
                            <React.Fragment key={item.step}>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${item.active ? 'bg-[#005d52] border-[#005d52] text-white shadow-md' : 'bg-white border-slate-200 text-slate-300'
                                        }`}>
                                        {item.step}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${item.active ? 'text-[#005d52]' : 'text-slate-400'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                {idx < 2 && <div className="h-[2px] flex-1 bg-slate-100 mx-4" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Customer Info */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                        <SectionHeader icon={<Building2 size={20} />} title="Company Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormInput label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} required error={errors.companyName} placeholder="e.g. Acme Corp" />
                            <FormInput label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required error={errors.contactPerson} />
                            <FormInput label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required error={errors.phoneNumber} placeholder="10-digit number" />
                            <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
                            <FormInput label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} />
                            <FormInput label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder="Optional" />
                            <FormInput label="City" name="city" value={formData.city} onChange={handleInputChange} />
                            <FormInput label="State" name="state" value={formData.state} onChange={handleInputChange} />
                            <FormSelect label="Lead Source" name="leadSource" value={formData.leadSource} onChange={handleInputChange} options={["Website", "Cold Call", "Referral", "Event"]} />
                        </div>
                    </div>

                    {/* Section 2: Products */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                        <SectionHeader icon={<Package size={20} />} title="Requirement Analysis" />
                        <div className="space-y-4">
                            {products.map((item, idx) => (
                                <div key={item.id} className="relative grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 items-start hover:bg-slate-50 transition-colors">
                                    <div className="md:col-span-4">
                                        <FormSelect label="Product" name={`prod_${idx}`} value={item.product} onChange={(e) => handleProductChange(item.id, 'product', e.target.value)} options={["Industrial Lathe", "Milling Machine", "Drill Press"]} />
                                        {errors[`prod_${idx}`] && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors[`prod_${idx}`]}</p>}
                                    </div>
                                    <div className="md:col-span-3">
                                        <FormInput label="Variant/Specs" name={`var_${idx}`} value={item.variant} onChange={(e) => handleProductChange(item.id, 'variant', e.target.value)} placeholder="Model No." />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormInput label="Qty" type="number" name={`qty_${idx}`} value={String(item.quantity)} onChange={(e) => handleProductChange(item.id, 'quantity', e.target.value)} error={errors[`qty_${idx}`]} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormInput label="Price (₹)" type="number" name={`val_${idx}`} value={String(item.estValue)} onChange={(e) => handleProductChange(item.id, 'estValue', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-1 flex justify-center pt-7">
                                        <button type="button" onClick={() => removeProduct(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addProduct} className="flex items-center gap-2 text-[#005d52] font-black text-xs uppercase tracking-widest px-4 py-2 hover:bg-teal-50 rounded-lg transition-all">
                                <Plus size={16} strokeWidth={3} /> Add Another Item
                            </button>
                        </div>

                        {/* Totals Summary */}
                        <div className="mt-8 bg-[#005d52] rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-teal-900/20">
                            <div className="flex gap-12">
                                <div>
                                    <p className="text-[10px] uppercase text-teal-200 font-black tracking-widest mb-1">Total Quantity</p>
                                    <p className="text-2xl font-black">{summary.totalQty} Units</p>
                                </div>
                                <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
                                <div>
                                    <p className="text-[10px] uppercase text-teal-200 font-black tracking-widest mb-1">Estimated Value</p>
                                    <p className="text-2xl font-black">₹ {summary.totalValue.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-2 text-xs text-teal-100 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                                    <CheckCircle2 size={14} /> Live Valuation Active
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Logistics */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                            <SectionHeader icon={<FileText size={20} />} title="Lead Strategy" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <FormSelect label="Priority" name="priority" value={formData.priority} onChange={handleInputChange} options={["Hot", "Warm", "Cold"]} />
                                <FormSelect label="Status" name="initialStatus" value={formData.initialStatus} onChange={handleInputChange} options={["New Lead", "Contacted", "Awaiting Quote"]} />
                                <FormInput label="Decision Date" name="expectedDecisionDate" type="date" value={formData.expectedDecisionDate} onChange={handleInputChange} />
                                <FormInput label="Follow-up Date" name="followUpDate" type="date" value={formData.followUpDate} onChange={handleInputChange} />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                            <SectionHeader icon={<MapPin size={20} />} title="Delivery Site" />
                            <textarea
                                name="address"
                                placeholder="Full factory/office address..."
                                rows={4}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-teal-500/5 focus:border-[#005d52] outline-none transition-all resize-none"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="bg-[#f1f8f7] rounded-3xl p-6 border-l-8 border-[#005d52]">
                        <SectionHeader icon={<Save size={20} />} title="Internal Remarks" />
                        <textarea
                            name="notes"
                            placeholder="Add specific client requests or technical notes..."
                            className="w-full bg-transparent border-none text-sm text-slate-700 italic focus:ring-0 outline-none resize-none"
                            rows={3}
                            value={formData.notes}
                            onChange={handleInputChange}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Sub-Components (Strictly Typed) ---

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-teal-50 text-[#005d52] rounded-xl border border-teal-100 shadow-sm">
            {icon}
        </div>
        <h3 className="font-bold text-xl text-slate-800 tracking-tight">{title}</h3>
    </div>
);

const FormInput: React.FC<InputProps> = ({
    label, name, value, onChange, placeholder, type = "text", required, error
}) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-slate-50 border ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-teal-500/5 focus:border-[#005d52] outline-none transition-all`}
            />
            {error && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400" size={16} />}
            {!error && value && required && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500" size={16} />}
        </div>
        {error && <p className="text-[10px] text-red-500 font-bold uppercase px-1">{error}</p>}
    </div>
);

const FormSelect: React.FC<SelectProps> = ({ label, name, value, options, onChange, error }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full bg-slate-50 border ${error ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-teal-500/5 focus:border-[#005d52] outline-none appearance-none cursor-pointer transition-all`}
            >
                <option value="">Choose Option</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
    </div>
);

export default EditLeadForm;