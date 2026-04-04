import React from 'react';
import { ChevronRight, Calendar, Building2, Package, MapPin, Edit3, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface Product {
    name: string;
    variant: string;
    qty: string;
    value: string;
}

const LeadView: React.FC = () => {
    const navigate = useNavigate();

    const products: Product[] = [
        { name: 'Refrigerator', variant: '4-door 500L', qty: '25 units', value: '₹ 11.3L' },
        { name: 'AC', variant: '1.5 Ton 5-Star', qty: '10 units', value: '₹ 3.5L' },
    ];

    const pipelineStages = [
        { name: 'New Lead', completed: true, progress: 20 },
        { name: 'Contacted', completed: true, progress: 40 },
        { name: 'Converted', completed: false, progress: 60 },
        { name: 'Quotation', completed: false, progress: 80 },
        { name: 'Won', completed: false, progress: 100 },
    ];

    const calculatePipelineProgress = (stages: { name: string; completed: boolean; progress: number }[]) => {
        let isBroken = false;
        let lastValidProgress = 0;

        const correctedStages = stages.map((stage) => {
            if (isBroken) {
                return { ...stage, completed: false };
            }

            if (!stage.completed) {
                isBroken = true;
                return { ...stage, completed: false };
            }

            lastValidProgress = stage.progress;
            return stage;
        });

        return {
            progress: lastValidProgress,
            correctedStages,
        };
    };
    const result = calculatePipelineProgress(pipelineStages);
    console.log("Pipeline Progress:", result.progress);
    console.log("Corrected Stages:", result.correctedStages);
    return (
        <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
            <div className="max-w-5xl mx-auto">

                {/* Header & Navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <button onClick={() => navigate("/sales/leads")} className="hover:text-[#005d52] transition-colors">Leads</button>
                            <ChevronRight size={14} />
                            <span className="text-gray-800 font-medium">L001</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">View Lead Details</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-white text-gray-600 px-5 py-2.5 rounded-full font-bold text-sm border border-gray-200 shadow-sm hover:bg-gray-50 transition-all">
                            <Download size={18} /> Export
                        </button>
                        <button
                            onClick={() => navigate("/sales/leads/edit-lead/id")}
                            className="flex items-center gap-2 bg-[#005d52] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-teal-900/20 hover:bg-[#004a41] transition-all">
                            <Edit3 size={18} /> Edit Lead
                        </button>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Pipeline Visualizer */}
                    <div className="bg-gray-50/50 p-8 border-b border-gray-100">
                        <div className="flex justify-between items-start relative max-w-3xl mx-auto">
                            {/* Background Line */}
                            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 z-0" />
                            {/* Active Line (Calculated based on progress) */}
                            <div
                                className="absolute top-4 left-0 h-0.5 bg-[#005d52] z-0 transition-all duration-500"
                                style={{ width: `${result.progress}%` }}
                            />
                            {result && result?.correctedStages?.map((stage, index) => (
                                <div key={index} className="relative z-10 flex flex-col items-center group">
                                    <div className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all ${stage.completed ? 'bg-[#005d52] scale-110' : 'bg-gray-200'
                                        }`} />
                                    <span className={`mt-3 text-[10px] font-bold uppercase tracking-wider ${stage.completed ? 'text-[#005d52]' : 'text-gray-400'
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
                                <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><Building2 size={20} /></div>
                                <h3 className="font-bold text-lg text-gray-800">Customer Details</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-12">
                                <DetailItem label="Company name" value="Rajesh Electronics" isHighlight />
                                <DetailItem label="Lead ID" value="L001" />
                                <DetailItem label="Contact person" value="Arvind Sharma" />
                                <DetailItem label="Designation" value="Proprietor" />
                                <DetailItem label="Phone Number" value="+91 98765 43210" />
                                <DetailItem label="Email Address" value="arvind@sharmaha.in" />
                                <DetailItem label="GST Number" value="27AABCS5678G1Z3" />
                                <DetailItem label="Lead Source" value="Trade Fair" />
                            </div>
                        </section>

                        {/* Section 2: Products */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><Package size={20} /></div>
                                <h3 className="font-bold text-lg text-gray-800">Products of Interest</h3>
                            </div>

                            <div className="rounded-2xl border border-gray-100 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <th className="p-4">Product Name</th>
                                            <th className="p-4">Variant / Model</th>
                                            <th className="p-4 text-center">Quantity</th>
                                            <th className="p-4 text-right">Est. Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {products.map((p, i) => (
                                            <tr key={i} className="text-sm">
                                                <td className="p-4 font-bold text-gray-700">{p.name}</td>
                                                <td className="p-4 text-gray-500">{p.variant}</td>
                                                <td className="p-4 text-center font-medium text-gray-800">{p.qty}</td>
                                                <td className="p-4 text-right font-extrabold text-[#005d52]">{p.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="bg-[#005d52] p-4 flex justify-between items-center text-white">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Deal Summary</span>
                                    <div className="flex gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase opacity-70">Total Qty</p>
                                            <p className="font-bold">35 Units</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase opacity-70">Deal Value</p>
                                            <p className="font-bold text-lg">₹ 14.8L</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Section 3: Assignment & Dates */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><Calendar size={20} /></div>
                                    <h3 className="font-bold text-lg text-gray-800">Logistics</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-3xl">
                                    <DetailItem label="Priority" value="Warm" isStatus />
                                    <DetailItem label="Assigned To" value="Sneha Patil" />
                                    <DetailItem label="Expected Decision" value="31-03-2026" />
                                    <DetailItem label="Next Follow-up" value="26-03-2026" />
                                </div>
                            </section>

                            {/* Section 4: Address */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-[#d1e9e7] text-[#005d52] rounded-lg"><MapPin size={20} /></div>
                                    <h3 className="font-bold text-lg text-gray-800">Installation Address</h3>
                                </div>
                                <div className="p-6 border border-gray-100 rounded-3xl text-sm text-gray-600 leading-relaxed min-h-35 flex items-center">
                                    Vasukamal Express -2nd Floor, Rohan Sehar Ln, Pancard Club Rd, behind Beverly Hills Society, Samarth Colony, Baner, Pune, Maharashtra 411069
                                </div>
                            </section>
                        </div>

                        {/* Section 5: Notes */}
                        <section>
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Internal Notes</h3>
                            <div className="bg-[#f1f8f7] border-l-4 border-[#005d52] p-6 rounded-r-2xl">
                                <p className="text-sm text-gray-700 italic leading-loose">
                                    "Met at Trade Fair 2026, Pune. Interested in bulk purchase for summer season. Wants competitive pricing on refrigerators and ACs. Decision expected by end of March 2026. Followed up on 18th, sent initial catalog."
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

export default LeadView;