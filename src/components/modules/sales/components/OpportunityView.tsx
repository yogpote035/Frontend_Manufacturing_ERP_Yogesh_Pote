import React, { useState } from 'react';
import { ChevronRight, Calendar, Building2, MapPin, Edit3, Download, IndianRupee, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const OpportunityView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isEditing, setIsEditing] = useState(false);
    const [expectedValue, setExpectedValue] = useState("₹ 25.5L");
    const [expectedCloseDate, setExpectedCloseDate] = useState("2026-03-31");
    const [assignedTo, setAssignedTo] = useState("Rahul Patil");

    const handleExport = async () => {
        const element = document.getElementById('opportunity-pdf-content');
        if (element) {
            const opt = {
                margin: [0.2, 0.2, 0.2, 0.2] as [number, number, number, number],
                filename: `Opportunity_${id || 'OP001'}_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { 
                    type: 'jpeg' as const, 
                    quality: 0.98 
                },
                html2canvas: { 
                    scale: 2,
                    letterRendering: true,
                    useCORS: true
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'a4', 
                    orientation: 'portrait' as const
                }
            };
            
            try {
                await html2pdf().set(opt).from(element).save();
            } catch (error) {
                console.error('PDF generation error:', error);
            }
        }
    };

    const opportunityStages = [
        { name: 'Discovery', completed: true },
        { name: 'Proposal', completed: true },
        { name: 'Negotiation', completed: false },
        { name: 'Closed Won', completed: false },
    ];

    return (
        <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
            <div className="max-w-5xl mx-auto">
                
                {/* Header & Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <button onClick={() => navigate(-1)} className="hover:text-[#005d52] transition-colors">Opportunities</button>
                            <ChevronRight size={14} />
                            <span className="text-gray-800 font-medium">{id || 'OP001'}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">View Opportunity Details</h1>
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
                <div id="opportunity-pdf-content" className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Pipeline Visualizer */}
                    <div className="bg-gray-50/50 p-8 border-b border-gray-100">
                        <div className="flex justify-between items-start relative max-w-3xl mx-auto">
                            {/* Background Line */}
                            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 z-0" />
                            {/* Active Line (Calculated based on progress) */}
                            <div className="absolute top-4 left-0 w-[33%] h-0.5 bg-[#005d52] z-0" />

                            {opportunityStages.map((stage, index) => (
                                <div key={index} className="relative z-10 flex flex-col items-center group">
                                    <div className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all ${
                                        stage.completed ? 'bg-[#005d52] scale-110' : 'bg-gray-200'
                                    }`} />
                                    <span className={`mt-3 text-[10px] font-bold uppercase tracking-wider ${
                                        stage.completed ? 'text-[#005d52]' : 'text-gray-400'
                                    }`}>
                                        {stage.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 lg:p-12 space-y-12">
                        
                        {/* Section 1: Customer Info */}
                        <section>
                            <div className="flex items-center gap-2 mb-8">
                                <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><Building2 size={20}/></div>
                                <h3 className="font-bold text-lg text-gray-800">Customer Details</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-12">
                                <DetailItem label="Company name" value="Rajesh Electronics" isHighlight />
                                <DetailItem label="Opportunity ID" value={id || "OP001"} />
                                <DetailItem label="Contact person" value="Rakesh Patil" />
                                <DetailItem label="Designation" value="CEO" />
                                <DetailItem label="Phone Number" value="+91 98692 26825" />
                                <DetailItem label="Email Address" value="rajeshelectronics@gmail.com" />
                                <DetailItem label="Lead Source" value="Dealer" />
                                <DetailItem label="Date Created" value="2026-03-18" />
                            </div>
                        </section>

                        {/* Section 2: Deal Info */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><IndianRupee size={20}/></div>
                                <h3 className="font-bold text-lg text-gray-800">Deal Summary</h3>
                            </div>
                            
                            <div className="bg-[#fcfdfdf0] p-6 rounded-3xl border border-gray-100 flex justify-between items-center text-gray-800">
                                <div className="flex gap-16">
                                    <div className="text-left w-40">
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Expected Value</p>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={expectedValue} 
                                                onChange={e => setExpectedValue(e.target.value)}
                                                className="font-bold text-2xl text-[#005d52] bg-white border-b-2 border-[#005d52] outline-none w-32" 
                                            />
                                        ) : (
                                            <p className="font-bold text-2xl text-[#005d52]">{expectedValue}</p>
                                        )}
                                    </div>
                                    <div className="text-left w-48">
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Expected Close Date</p>
                                        {isEditing ? (
                                            <input 
                                                type="date" 
                                                value={expectedCloseDate} 
                                                onChange={e => setExpectedCloseDate(e.target.value)}
                                                className="font-bold text-xl bg-white border-b-2 border-gray-300 outline-none w-full text-gray-800" 
                                            />
                                        ) : (
                                            <p className="font-bold text-xl">{expectedCloseDate.split('-').reverse().join('-')}</p>
                                        )}
                                    </div>
                                    <div className="text-left w-48">
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Assigned To</p>
                                        <div className="flex items-center gap-2 pt-1.5">
                                            <User size={18} className="text-[#005d52]"/>
                                            {isEditing ? (
                                                <input 
                                                    type="text" 
                                                    value={assignedTo} 
                                                    onChange={e => setAssignedTo(e.target.value)}
                                                    className="font-medium bg-white border-b-2 border-gray-300 outline-none w-full text-gray-800" 
                                                />
                                            ) : (
                                                <span className="font-medium">{assignedTo}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Section 3: Priority & Status */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><Calendar size={20}/></div>
                                    <h3 className="font-bold text-lg text-gray-800">Status</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-3xl">
                                    <DetailItem label="Priority" value="High" isStatus />
                                    <DetailItem label="Stage" value="Proposal" />
                                </div>
                            </section>

                            {/* Section 4: Address */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><MapPin size={20}/></div>
                                    <h3 className="font-bold text-lg text-gray-800">Location</h3>
                                </div>
                                <div className="p-6 border border-gray-100 rounded-3xl text-sm text-gray-600 leading-relaxed min-h-35 flex items-center bg-white">
                                    Navi Mumbai, Maharashtra, 400708
                                </div>
                            </section>
                        </div>

                        {/* Section 5: Notes */}
                        <section>
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Internal Notes</h3>
                            <div className="bg-[#f1f8f7] border-l-4 border-[#005d52] p-6 rounded-r-2xl">
                                <p className="text-sm text-gray-700 italic leading-loose">
                                    "Dealer contacted us for a large order. Proposal has been sent on 21st March. Evaluating competitor offers but leaning towards us due to service guarantees. Needs follow-up before end of month."
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helper Component ---
const DetailItem: React.FC<{ label: string; value: string; isHighlight?: boolean; isStatus?: boolean }> = ({ 
    label, value, isHighlight, isStatus 
}) => (
    <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        {isStatus ? (
            <span className="w-fit px-3 py-1 rounded-lg bg-[#d1e9e7] text-[#005d52] text-xs font-bold">
                {value}
            </span>
        ) : (
            <span className={`text-sm font-medium ${isHighlight ? 'text-[#005d52] font-bold text-base' : 'text-gray-700'}`}>
                {value}
            </span>
        )}
    </div>
);

export default OpportunityView;