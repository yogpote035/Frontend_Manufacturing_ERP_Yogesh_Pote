import React, { useState, useMemo } from "react";
import { 
    ChevronRight, 
    Building2, 
    Package, 
    FileText, 
    Plus, 
    ChevronDown,
    Trash2,
    Save,
    MapPin,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Interfaces ---
interface LeadFormData {
    company_name: string;
    contact_person: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    gst_number: string;
    lead_source: string;
    priority: string;
    expected_close_date: string;
    followup_date: string;
    notes: string;
    assigned_to: string | number;
}

interface ProductItem {
    id: number;
    product_name: string;
    variant: string;
    quantity: number;
    unit_price: number;
}

interface ValidationErrors {
    [key: string]: string;
}

// --- Sub-Component Props ---
interface InputProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    error?: string;
}

interface SelectProps {
    label: string;
    name: string;
    value: string | number;
    options: { label: string; value: string | number }[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
}

const LeadForm: React.FC = () => {
    const navigate = useNavigate();
    
    // --- State ---
    const [formData, setFormData] = useState<LeadFormData>({
        company_name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        gst_number: "",
        lead_source: "",
        priority: "Medium",
        expected_close_date: "",
        followup_date: "",
        notes: "",
        assigned_to: "",
    });

    const [products, setProducts] = useState<ProductItem[]>([
        { id: Date.now(), product_name: "", variant: "", quantity: 1, unit_price: 0 }
    ]);

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Totals Calculation ---
    const summary = useMemo(() => {
        const qty = products.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
        const val = products.reduce((acc, curr) => acc + ((Number(curr.quantity) || 0) * (Number(curr.unit_price) || 0)), 0);
        return { totalQty: qty, totalValue: val };
    }, [products]);

    // --- Validation Logic ---
    const validate = (): boolean => {
        const newErrors: ValidationErrors = {};
        if (!formData.company_name.trim()) newErrors.company_name = "Company name is required";
        if (!formData.contact_person.trim()) newErrors.contact_person = "Contact person is required";
        if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Valid 10-digit phone required";
        
        products.forEach((p, idx) => {
            if (!p.product_name) newErrors[`prod_${idx}`] = "Select product";
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
                if ((field === 'quantity' || field === 'unit_price')) {
                    const numVal = Math.max(0, Number(value));
                    return { ...p, [field]: numVal };
                }
                return { ...p, [field]: value };
            }
            return p;
        }));
    };

    const addProduct = () => {
        setProducts(prev => [...prev, { id: Date.now(), product_name: "", variant: "", quantity: 1, unit_price: 0 }]);
    };

    const removeProduct = (id: number) => {
        if (products.length > 1) setProducts(prev => prev.filter(p => p.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            
            // Final JSON Payload Construction
            const payload = {
                ...formData,
                products: products.map(({ product_name, variant, quantity, unit_price }) => ({
                    product_name, variant, quantity, unit_price
                }))
            };
            
            console.log("Submitting Payload:", payload);
                setIsSubmitting(false);
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
                            <span className="text-slate-600 font-bold tracking-tight uppercase text-[10px]">New Lead Onboarding</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create New Lead</h1>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button onClick={() => navigate("/sales/leads")} className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-sm text-slate-600 bg-white border border-slate-200 shadow-sm">
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm text-white bg-[#005d52] shadow-lg shadow-teal-900/20 hover:bg-[#004a41] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                            {isSubmitting ? "Processing..." : <><Save size={18} /> Create Lead</>}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Customer Info */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                        <SectionHeader icon={<Building2 size={20}/>} title="Company Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormInput label="Company Name" name="company_name" value={formData.company_name} onChange={handleInputChange} required error={errors.company_name} placeholder="Tech Solutions Pvt Ltd" />
                            <FormInput label="Contact Person" name="contact_person" value={formData.contact_person} onChange={handleInputChange} required error={errors.contact_person} placeholder="Pooja Masne" />
                            <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} required error={errors.phone} placeholder="9876543210" />
                            <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@techsolutions.com" />
                            <FormInput label="GST Number" name="gst_number" value={formData.gst_number} onChange={handleInputChange} placeholder="27AAACA1234B1Z" />
                            <FormSelect label="Lead Source" name="lead_source" value={formData.lead_source} onChange={handleInputChange} 
                                options={[
                                    {label: "Website", value: "Website"},
                                    {label: "Trade Show", value: "Trade Show"},
                                    {label: "Referral", value: "Referral"},
                                    {label: "Cold Call", value: "Cold Call"}
                                ]} 
                            />
                            <FormInput label="City" name="city" value={formData.city} onChange={handleInputChange} placeholder="Mumbai" />
                            <FormInput label="State" name="state" value={formData.state} onChange={handleInputChange} placeholder="Maharashtra" />
                        </div>
                    </div>

                    {/* Section 2: Products */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                        <SectionHeader icon={<Package size={20}/>} title="Products of Interest" />
                        <div className="space-y-4">
                            {products.map((item, idx) => (
                                <div key={item.id} className="relative grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 items-start">
                                    <div className="md:col-span-4">
                                        <FormSelect label="Select Product" name="product_name" value={item.product_name} 
                                            onChange={(e) => handleProductChange(item.id, 'product_name', e.target.value)} 
                                            options={[
                                                {label: "Double Door Refrigerator", value: "Double Door Refrigerator"},
                                                {label: "1.5 Ton Split AC", value: "1.5 Ton Split AC"},
                                                {label: "Front Load Washing Machine", value: "Front Load Washing Machine"},
                                                {label: "Convection Microwave", value: "Convection Microwave"}
                                            ]} 
                                        />
                                        {errors[`prod_${idx}`] && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors[`prod_${idx}`]}</p>}
                                    </div>
                                    <div className="md:col-span-3">
                                        <FormInput label="Variant/Model" name="variant" value={item.variant} onChange={(e) => handleProductChange(item.id, 'variant', e.target.value)} placeholder="e.g. Inverter" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormInput label="Qty" type="number" name="quantity" value={item.quantity} onChange={(e) => handleProductChange(item.id, 'quantity', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormInput label="Unit Price (₹)" type="number" name="unit_price" value={item.unit_price} onChange={(e) => handleProductChange(item.id, 'unit_price', e.target.value)} />
                                    </div>
                                    <div className="md:col-span-1 flex justify-center pt-7">
                                        <button type="button" onClick={() => removeProduct(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addProduct} className="flex items-center gap-2 text-[#005d52] font-black text-xs uppercase tracking-widest px-4 py-2 hover:bg-teal-50 rounded-lg transition-all">
                                <Plus size={16} strokeWidth={3} /> Add Product
                            </button>
                        </div>

                        {/* Summary Card */}
                        <div className="mt-8 bg-[#005d52] rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-teal-900/20">
                            <div className="flex gap-12">
                                <div>
                                    <p className="text-[10px] uppercase text-teal-200 font-black tracking-widest mb-1">Total Quantity</p>
                                    <p className="text-2xl font-black">{summary.totalQty} Units</p>
                                </div>
                                <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
                                <div>
                                    <p className="text-[10px] uppercase text-teal-200 font-black tracking-widest mb-1">Est. Deal Value</p>
                                    <p className="text-2xl font-black">₹ {summary.totalValue.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <p className="text-xs text-teal-100 italic opacity-80 max-w-[240px] text-right">Pricing calculated as Unit Price × Quantity per product.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Section 3: Logistics */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                            <SectionHeader icon={<FileText size={20}/>} title="Logistics & Timeline" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <FormSelect label="Priority" name="priority" value={formData.priority} onChange={handleInputChange} options={[{label: "High", value: "High"}, {label: "Medium", value: "Medium"}, {label: "Low", value: "Low"}]} />
                                <FormSelect label="Assigned Sales Rep" name="assigned_to" value={formData.assigned_to} onChange={handleInputChange} 
                                    options={[
                                        {label: "Rahul Sharma (Manager)", value: 2},
                                        {label: "Sneha Patil", value: 3},
                                        {label: "Amit Verma", value: 4}
                                    ]} 
                                />
                                <FormInput label="Expected Close Date" name="expected_close_date" type="date" value={formData.expected_close_date} onChange={handleInputChange} />
                                <FormInput label="Follow-up Date" name="followup_date" type="date" value={formData.followup_date} onChange={handleInputChange} />
                            </div>
                        </div>

                        {/* Section 4: Address */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                            <SectionHeader icon={<MapPin size={20}/>} title="Installation Address" />
                            <textarea 
                                name="address"
                                placeholder="Full factory or office address..."
                                rows={5}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-teal-500/5 focus:border-[#005d52] outline-none transition-all resize-none"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Section 5: Remarks */}
                    <div className="bg-[#f1f8f7] rounded-3xl p-6 border-l-8 border-[#005d52]">
                        <div className="flex items-center gap-3 mb-4">
                             <FileText size={18} className="text-[#005d52]" />
                             <h3 className="font-black text-xs uppercase tracking-widest text-[#005d52]">Notes & Special Requirements</h3>
                        </div>
                        <textarea 
                            name="notes"
                            placeholder="Interested in bulk purchase, tax exemptions, etc..."
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
    <div className="flex items-center gap-3 mb-8">
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
                <option value="">Choose...</option>
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
    </div>
);

export default LeadForm;