import React, { useState, useEffect } from 'react';
import { ChevronRight, Building2, Edit3, Download, List, Calendar, Save, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

// Define the Quotation type matching the QuotationList
type QuotationStatus = "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired";

type Quotation = {
    id: string;
    company: string;
    date: string;
    validUntil: string;
    amount: string;
    status: QuotationStatus;
    createdBy: string;
};

// Mock data - should match QuotationList or come from API
const QUOTATIONS_DATA: Quotation[] = [
    { id: "QT-001", company: "Rajesh Electronics", date: "25-03-2026", validUntil: "25-04-2026", amount: "₹ 25.5L", status: "Sent", createdBy: "Rahul Patil" },
    { id: "QT-002", company: "Modern Appliances", date: "10-03-2026", validUntil: "10-04-2026", amount: "₹ 5.5L", status: "Draft", createdBy: "Sneha P." },
    { id: "QT-003", company: "Kitchen Hub", date: "15-02-2026", validUntil: "15-03-2026", amount: "₹ 11.2L", status: "Accepted", createdBy: "Rahul Patil" },
    { id: "QT-004", company: "Elite Tech Solutions", date: "19-03-2026", validUntil: "19-04-2026", amount: "₹ 18.75L", status: "Draft", createdBy: "Amit S." },
    { id: "QT-005", company: "Global Traders", date: "05-01-2026", validUntil: "05-02-2026", amount: "₹ 42.0L", status: "Expired", createdBy: "Sneha P." },
    { id: "QT-006", company: "Oceanic Resorts", date: "20-03-2026", validUntil: "20-04-2026", amount: "₹ 14.2L", status: "Sent", createdBy: "Rahul Patil" },
    { id: "QT-007", company: "Sunshine Schools", date: "15-01-2026", validUntil: "15-02-2026", amount: "₹ 8.1L", status: "Accepted", createdBy: "Amit S." },
    { id: "QT-008", company: "Apex Hospitals", date: "27-03-2026", validUntil: "27-04-2026", amount: "₹ 35.8L", status: "Rejected", createdBy: "Sneha P." },
];

const QuotationView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Editable states
    const [discount, setDiscount] = useState<number>(5000);
    const [gstPercent, setGstPercent] = useState<number>(18);
    const [validUntil, setValidUntil] = useState("");
    const [editedStatus, setEditedStatus] = useState<QuotationStatus>("Draft");
    const [editedCompany, setEditedCompany] = useState("");
    const [editedCreatedBy, setEditedCreatedBy] = useState("");
    const [editedDate, setEditedDate] = useState("");
    
    // Editable line items
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { id: '1', description: 'Advanced Manufacturing Unit V2', quantity: 1, unitPrice: 1500000 },
        { id: '2', description: 'Annual Maintenance Contract (1 Yr)', quantity: 1, unitPrice: 120000 },
        { id: '3', description: 'On-site Staff Training', quantity: 5, unitPrice: 15000 },
    ]);

    // Fetch quotation data based on ID
    useEffect(() => {
        const foundQuotation = QUOTATIONS_DATA.find(q => q.id === id);
        if (foundQuotation) {
            setQuotation(foundQuotation);
            setEditedStatus(foundQuotation.status);
            setEditedCompany(foundQuotation.company);
            setEditedCreatedBy(foundQuotation.createdBy);
            setEditedDate(foundQuotation.date);
            // Convert validUntil from DD-MM-YYYY to YYYY-MM-DD for input
            const [day, month, year] = foundQuotation.validUntil.split('-');
            setValidUntil(`${year}-${month}-${day}`);
        }
    }, [id]);

    const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const gstAmount = (subtotal - discount) * (gstPercent / 100);
    const grandTotal = subtotal - discount + gstAmount;

    // Function to get status color
    const getStatusColor = (status: QuotationStatus) => {
        switch(status) {
            case "Sent": return "bg-blue-50 text-blue-600 border-blue-200";
            case "Draft": return "bg-gray-50 text-gray-600 border-gray-200";
            case "Accepted": return "bg-green-50 text-green-600 border-green-200";
            case "Rejected": return "bg-red-50 text-red-600 border-red-200";
            case "Expired": return "bg-orange-50 text-orange-600 border-orange-200";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    // Handle save changes
    const handleSave = () => {
        if (quotation) {
            const updatedQuotation = {
                ...quotation,
                status: editedStatus,
                company: editedCompany,
                createdBy: editedCreatedBy,
                date: editedDate,
                validUntil: validUntil.split('-').reverse().join('-')
            };
            setQuotation(updatedQuotation);
            // Here you would typically make an API call to save the changes
            console.log("Saved quotation:", updatedQuotation);
            console.log("Line items:", lineItems);
            console.log("Discount:", discount);
            console.log("GST:", gstPercent);
        }
        setIsEditing(false);
    };

    // Handle cancel edit
    const handleCancel = () => {
        if (quotation) {
            setEditedStatus(quotation.status);
            setEditedCompany(quotation.company);
            setEditedCreatedBy(quotation.createdBy);
            setEditedDate(quotation.date);
            const [day, month, year] = quotation.validUntil.split('-');
            setValidUntil(`${year}-${month}-${day}`);
            // Reset line items to original
            setLineItems([
                { id: '1', description: 'Advanced Manufacturing Unit V2', quantity: 1, unitPrice: 1500000 },
                { id: '2', description: 'Annual Maintenance Contract (1 Yr)', quantity: 1, unitPrice: 120000 },
                { id: '3', description: 'On-site Staff Training', quantity: 5, unitPrice: 15000 },
            ]);
            setDiscount(5000);
            setGstPercent(18);
        }
        setIsEditing(false);
    };

    // Line item handlers
    const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
        setLineItems(prev => prev.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const addLineItem = () => {
        const newId = String(lineItems.length + 1);
        setLineItems([...lineItems, { id: newId, description: 'New Item', quantity: 1, unitPrice: 0 }]);
    };

    const removeLineItem = (id: string) => {
        setLineItems(prev => prev.filter(item => item.id !== id));
    };

    const handleExport = () => {
        const element = document.getElementById('quotation-pdf-content');
        if (element && quotation) {
            const opt = {
                margin:       0.2,
                filename:     `Quotation_${quotation.id}.pdf`,
                image:        { type: 'jpeg' as const, quality: 0.98 },
                html2canvas:  { scale: 1 },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' as const }
            };
            html2pdf().set(opt).from(element).save();
        }
    };

    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    if (!quotation) {
        return (
            <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
                <div className="max-w-4xl mx-auto text-center py-20">
                    <p className="text-gray-400">Quotation not found</p>
                    <button 
                        onClick={() => navigate("/sales/quotation")}
                        className="mt-4 text-[#005d52] hover:underline"
                    >
                        Back to Quotations
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto">
                
                {/* Header & Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <button onClick={() => navigate("/sales/quotation")} className="hover:text-[#005d52] transition-colors">Quotations</button>
                            <ChevronRight size={14} />
                            <span className="text-gray-800 font-medium">{quotation.id}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-800">Quotation Details</h1>
                            {isEditing ? (
                                <select
                                    value={editedStatus}
                                    onChange={(e) => setEditedStatus(e.target.value as QuotationStatus)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border focus:outline-none focus:ring-2 focus:ring-[#005d52] ${getStatusColor(editedStatus)}`}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Sent">Sent</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            ) : (
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusColor(quotation.status)}`}>
                                    {quotation.status}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleExport} className="flex items-center gap-2 bg-white text-gray-600 px-5 py-2.5 rounded-full font-bold text-sm border border-gray-200 shadow-sm hover:bg-gray-50 transition-all">
                            <Download size={18} /> Export
                        </button>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button onClick={handleCancel} className="flex items-center gap-2 bg-white text-gray-600 px-6 py-2.5 rounded-full font-bold text-sm border border-gray-200 transition-all hover:bg-gray-50">
                                    <X size={18} /> Cancel
                                </button>
                                <button onClick={handleSave} className="flex items-center gap-2 bg-[#005d52] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-teal-900/20 hover:bg-[#004a41] transition-all">
                                    <Save size={18} /> Save
                                </button>
                            </div>
                        ) : (
                            <button className="flex items-center gap-2 bg-[#005d52] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-teal-900/20 hover:bg-[#004a41] transition-all" onClick={() => setIsEditing(true)}>
                                <Edit3 size={18} /> Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Card */}
                <div id="quotation-pdf-content" className="bg-white rounded-4xl shadow-sm border border-gray-100">
                    
                    <div className="p-8 lg:p-12 space-y-10">

                        {/* Official Document Header (Visible in PDF) */}
                        <div className="flex justify-between items-start border-b border-gray-100 pb-8">
                            <div>
                                <h2 className="text-3xl font-black text-[#005d52] tracking-tighter">Manufacturing ERP</h2>
                                <p className="text-gray-500 text-sm mt-1">100 Industry Way, Tech Park</p>
                                <p className="text-gray-500 text-sm">Mumbai, Maharashtra, 400001</p>
                                <p className="text-gray-500 text-sm mt-2">VAT: IN2938475892</p>
                            </div>
                            <div className="text-right">
                                <h1 className="text-4xl font-black text-gray-200 uppercase tracking-widest mb-2">Quotation</h1>
                                <p className="font-bold text-gray-800 text-lg">{quotation.id}</p>
                                <p className="text-gray-500 text-sm font-medium">Date: {isEditing ? (
                                    <input 
                                        type="date" 
                                        value={editedDate.split('-').reverse().join('-')}
                                        onChange={(e) => {
                                            const date = new Date(e.target.value);
                                            const day = String(date.getDate()).padStart(2, "0");
                                            const month = String(date.getMonth() + 1).padStart(2, "0");
                                            const year = date.getFullYear();
                                            setEditedDate(`${day}-${month}-${year}`);
                                        }}
                                        className="font-medium text-gray-800 bg-white border-b-2 border-gray-300 outline-none w-40 text-right"
                                    />
                                ) : (
                                    quotation.date
                                )}</p>
                            </div>
                        </div>
                        
                        {/* Summary & Customer Info Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Customer Details */}
                            <div className="bg-[#fcfdfdf0] p-6 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><Building2 size={18}/></div>
                                    <h3 className="font-bold text-gray-800">Bill To (Customer)</h3>
                                </div>
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <input 
                                            type="text"
                                            value={editedCompany}
                                            onChange={(e) => setEditedCompany(e.target.value)}
                                            className="w-full font-bold text-lg text-[#005d52] mb-1 bg-white border-b-2 border-gray-300 outline-none focus:border-[#005d52]"
                                        />
                                        <input 
                                            type="text"
                                            placeholder="Address Line 1"
                                            defaultValue="Industrial Estate Road, Building B"
                                            className="w-full text-gray-600 text-sm bg-white border-b border-gray-200 outline-none focus:border-[#005d52]"
                                        />
                                        <input 
                                            type="text"
                                            placeholder="City, State, PIN"
                                            defaultValue="Navi Mumbai, Maharashtra, 400708"
                                            className="w-full text-gray-600 text-sm bg-white border-b border-gray-200 outline-none focus:border-[#005d52]"
                                        />
                                        <div className="text-sm mt-4">
                                            <p className="font-bold text-gray-800">Attn:</p>
                                            <input 
                                                type="text"
                                                defaultValue="Rakesh Patil"
                                                className="w-full text-gray-600 bg-white border-b border-gray-200 outline-none focus:border-[#005d52]"
                                            />
                                            <input 
                                                type="email"
                                                defaultValue="rajeshelectronics@gmail.com"
                                                className="w-full text-gray-600 bg-white border-b border-gray-200 outline-none focus:border-[#005d52] mt-2"
                                            />
                                            <input 
                                                type="tel"
                                                defaultValue="+91 98692 26825"
                                                className="w-full text-gray-600 bg-white border-b border-gray-200 outline-none focus:border-[#005d52] mt-2"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h4 className="font-bold text-lg text-[#005d52] mb-1">{quotation.company}</h4>
                                        <p className="text-gray-600 text-sm">Industrial Estate Road, Building B</p>
                                        <p className="text-gray-600 text-sm mb-4">Navi Mumbai, Maharashtra, 400708</p>
                                        <div className="text-sm">
                                            <p className="font-bold text-gray-800">Attn: Rakesh Patil</p>
                                            <p className="text-gray-600">rajeshelectronics@gmail.com</p>
                                            <p className="text-gray-600">+91 98692 26825</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Quotation Meta */}
                            <div className="bg-[#fcfdfdf0] p-6 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><Calendar size={18}/></div>
                                    <h3 className="font-bold text-gray-800">Quotation Details</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-y-6">
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Creation Date</p>
                                        <p className="font-medium text-gray-800">{quotation.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Valid Until</p>
                                        {isEditing ? (
                                            <input 
                                                type="date" 
                                                value={validUntil} 
                                                onChange={e => setValidUntil(e.target.value)}
                                                className="font-medium text-gray-800 bg-white border-b-2 border-gray-300 outline-none w-full" 
                                            />
                                        ) : (
                                            <p className="font-medium text-gray-800">{quotation.validUntil}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Prepared By</p>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={editedCreatedBy}
                                                onChange={(e) => setEditedCreatedBy(e.target.value)}
                                                className="font-medium text-gray-800 bg-white border-b-2 border-gray-300 outline-none w-full"
                                            />
                                        ) : (
                                            <p className="font-medium text-gray-800">{quotation.createdBy}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Quote Reference</p>
                                        <p className="font-medium text-gray-800">{quotation.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><List size={18}/></div>
                                    <h3 className="font-bold text-gray-800">Products & Services</h3>
                                </div>
                                {isEditing && (
                                    <button 
                                        onClick={addLineItem}
                                        className="text-xs bg-[#005d52] text-white px-3 py-1 rounded-lg hover:bg-[#004a41] transition-colors"
                                    >
                                        + Add Item
                                    </button>
                                )}
                            </div>
                            
                            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/80 border-b border-gray-100">
                                        <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                            <th className="p-4 rounded-tl-2xl">Description</th>
                                            <th className="p-4 text-center">Qty</th>
                                            <th className="p-4 text-right">Unit Price</th>
                                            <th className="p-4 text-right rounded-tr-2xl">Total</th>
                                            {isEditing && <th className="p-4 text-center">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {lineItems.map(item => (
                                            <tr key={item.id} className="text-sm">
                                                <td className="p-4 font-medium text-gray-800">
                                                    {isEditing ? (
                                                        <input 
                                                            type="text"
                                                            value={item.description}
                                                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                                            className="w-full bg-white border-b border-gray-200 outline-none focus:border-[#005d52]"
                                                        />
                                                    ) : (
                                                        item.description
                                                    )}
                                                </td>
                                                <td className="p-4 text-center text-gray-600">
                                                    {isEditing ? (
                                                        <input 
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                            className="w-20 text-center bg-white border-b border-gray-200 outline-none focus:border-[#005d52]"
                                                        />
                                                    ) : (
                                                        item.quantity
                                                    )}
                                                </td>
                                                <td className="p-4 text-right text-gray-600">
                                                    {isEditing ? (
                                                        <input 
                                                            type="number"
                                                            value={item.unitPrice}
                                                            onChange={(e) => updateLineItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                                                            className="w-32 text-right bg-white border-b border-gray-200 outline-none focus:border-[#005d52]"
                                                        />
                                                    ) : (
                                                        formatINR(item.unitPrice)
                                                    )}
                                                </td>
                                                <td className="p-4 text-right font-bold text-gray-800">
                                                    {formatINR(item.quantity * item.unitPrice)}
                                                </td>
                                                {isEditing && (
                                                    <td className="p-4 text-center">
                                                        <button 
                                                            onClick={() => removeLineItem(item.id)}
                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="flex justify-end">
                            <div className="w-full lg:w-1/2 bg-[#f9fbfa] p-6 rounded-3xl border border-gray-100 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="font-bold text-gray-800">{formatINR(subtotal)}</span>
                                </div>
                                
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium tracking-wide">Discount</span>
                                    <div className="flex items-center gap-2">
                                        {isEditing ? (
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                <input 
                                                    type="number" 
                                                    value={discount}
                                                    onChange={(e) => setDiscount(Number(e.target.value))}
                                                    className="pl-8 pr-2 py-1 w-32 border-b-2 border-[#005d52] bg-white outline-none font-bold text-gray-800 text-right"
                                                />
                                            </div>
                                        ) : (
                                            <span className="font-bold text-red-500">- {formatINR(discount)}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">
                                        GST (
                                        {isEditing ? (
                                            <input 
                                                type="number" 
                                                value={gstPercent}
                                                onChange={(e) => setGstPercent(Number(e.target.value))}
                                                className="w-12 border-b-2 border-[#005d52] bg-white outline-none font-bold text-gray-800 text-center mx-1"
                                            />
                                        ) : (
                                            <span className="font-bold mx-1">{gstPercent}</span>
                                        )}
                                        %)
                                    </span>
                                    <span className="font-bold text-gray-800">+ {formatINR(gstAmount)}</span>
                                </div>

                                <div className="pt-4 border-t border-gray-200 mt-4 flex justify-between items-center">
                                    <span className="font-bold text-gray-800 text-lg">Grand Total</span>
                                    <span className="font-black text-2xl text-[#005d52]">{formatINR(grandTotal)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Terms & Notes */}
                        <div className="pt-8 border-t border-gray-100">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Terms & Conditions</h3>
                            {isEditing ? (
                                <textarea 
                                    defaultValue="Quotation is valid until {validUntil}. Prices may be subject to change thereafter.\nPayment terms: 50% advance along with Purchase Order, 50% prior to dispatch.\nDelivery will be made within 4-6 weeks from receipt of advance payment.\nStandard warranty of 12 months applicable on all manufactured units."
                                    className="w-full text-xs text-gray-500 bg-white border border-gray-200 rounded-lg p-3 outline-none focus:border-[#005d52]"
                                    rows={4}
                                />
                            ) : (
                                <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                                    <li>Quotation is valid until {quotation.validUntil}. Prices may be subject to change thereafter.</li>
                                    <li>Payment terms: 50% advance along with Purchase Order, 50% prior to dispatch.</li>
                                    <li>Delivery will be made within 4-6 weeks from receipt of advance payment.</li>
                                    <li>Standard warranty of 12 months applicable on all manufactured units.</li>
                                </ul>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationView;