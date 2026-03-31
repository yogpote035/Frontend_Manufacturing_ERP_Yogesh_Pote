import React, { useState } from 'react';
import { ChevronRight, Building2, Edit3, Download, List, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

const QuotationView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isEditing, setIsEditing] = useState(false);
    
    // Editable states
    const [discount, setDiscount] = useState<number>(5000);
    const [gstPercent, setGstPercent] = useState<number>(18);
    
    // Fixed states for demo
    const [validUntil, setValidUntil] = useState("2026-04-20");

    const lineItems: LineItem[] = [
        { id: '1', description: 'Advanced Manufacturing Unit V2', quantity: 1, unitPrice: 1500000 },
        { id: '2', description: 'Annual Maintenance Contract (1 Yr)', quantity: 1, unitPrice: 120000 },
        { id: '3', description: 'On-site Staff Training', quantity: 5, unitPrice: 15000 },
    ];

    const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const gstAmount = (subtotal - discount) * (gstPercent / 100);
    const grandTotal = subtotal - discount + gstAmount;

    const handleExport = () => {
        const element = document.getElementById('quotation-pdf-content');
        if (element) {
            const opt = {
                margin:       0.5,
                filename:     `Quotation_${id || 'QT-001'}.pdf`,
                image:        { type: 'jpeg' as const, quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' as const }
            };
            html2pdf().set(opt).from(element).save();
        }
    };

    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto">
                
                {/* Header & Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <button onClick={() => navigate(-1)} className="hover:text-[#005d52] transition-colors">Quotations</button>
                            <ChevronRight size={14} />
                            <span className="text-gray-800 font-medium">{id || 'QT-001'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-800">Quotation Details</h1>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold uppercase tracking-wider">
                                Sent
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleExport} className="flex items-center gap-2 bg-white text-gray-600 px-5 py-2.5 rounded-full font-bold text-sm border border-gray-200 shadow-sm hover:bg-gray-50 transition-all">
                            <Download size={18} /> Export
                        </button>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 bg-white text-gray-600 px-6 py-2.5 rounded-full font-bold text-sm border border-gray-200 transition-all hover:bg-gray-50" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                                <button className="flex items-center gap-2 bg-[#005d52] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-teal-900/20 hover:bg-[#004a41] transition-all" onClick={() => setIsEditing(false)}>
                                    Save
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
                <div id="quotation-pdf-content" className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    <div className="p-8 lg:p-10 space-y-10">
                        
                        {/* Summary & Customer Info Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Customer Details */}
                            <div className="bg-[#fcfdfdf0] p-6 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><Building2 size={18}/></div>
                                    <h3 className="font-bold text-gray-800">Bill To (Customer)</h3>
                                </div>
                                <h4 className="font-bold text-lg text-[#005d52] mb-1">Rajesh Electronics</h4>
                                <p className="text-gray-600 text-sm">Industrial Estate Road, Building B</p>
                                <p className="text-gray-600 text-sm mb-4">Navi Mumbai, Maharashtra, 400708</p>
                                
                                <div className="text-sm">
                                    <p className="font-bold text-gray-800">Attn: Rakesh Patil</p>
                                    <p className="text-gray-600">rajeshelectronics@gmail.com</p>
                                    <p className="text-gray-600">+91 98692 26825</p>
                                </div>
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
                                        <p className="font-medium text-gray-800">2026-03-25</p>
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
                                            <p className="font-medium text-gray-800">{validUntil.split('-').reverse().join('-')}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Prepared By</p>
                                        <p className="font-medium text-gray-800">Rahul Patil</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Quote Reference</p>
                                        <p className="font-medium text-gray-800">{id || 'QT-001'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><List size={18}/></div>
                                <h3 className="font-bold text-gray-800">Products & Services</h3>
                            </div>
                            
                            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/80 border-b border-gray-100">
                                        <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                            <th className="p-4 rounded-tl-2xl">Description</th>
                                            <th className="p-4 text-center">Qty</th>
                                            <th className="p-4 text-right">Unit Price</th>
                                            <th className="p-4 text-right rounded-tr-2xl">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {lineItems.map(item => (
                                            <tr key={item.id} className="text-sm">
                                                <td className="p-4 font-medium text-gray-800">{item.description}</td>
                                                <td className="p-4 text-center text-gray-600">{item.quantity}</td>
                                                <td className="p-4 text-right text-gray-600">{formatINR(item.unitPrice)}</td>
                                                <td className="p-4 text-right font-bold text-gray-800">{formatINR(item.quantity * item.unitPrice)}</td>
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
                            <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                                <li>Quotation is valid until {isEditing ? validUntil : validUntil.split('-').reverse().join('-')}. Prices may be subject to change thereafter.</li>
                                <li>Payment terms: 50% advance along with Purchase Order, 50% prior to dispatch.</li>
                                <li>Delivery will be made within 4-6 weeks from receipt of advance payment.</li>
                                <li>Standard warranty of 12 months applicable on all manufactured units.</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationView;
