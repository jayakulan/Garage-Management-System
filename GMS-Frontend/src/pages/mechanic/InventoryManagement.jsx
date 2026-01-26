import React, { useState, useEffect } from 'react';
import { Package, Search, AlertCircle } from 'lucide-react';

const InventoryManagement = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchParts();
    }, []);

    const fetchParts = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/parts/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Handle both paginated (data.results) and non-paginated (data) responses
                const partsArray = data.results || data;
                setParts(partsArray);
            }
        } catch (error) {
            console.error('Error fetching parts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredParts = parts.filter(part =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Package className="text-blue-400" /> Inventory Management
            </h2>

            {/* Search Bar */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search parts by name or SKU..."
                    className="bg-transparent border-none outline-none text-white w-full placeholder-slate-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center p-12">
                    <p className="text-slate-400">Loading inventory...</p>
                </div>
            ) : (
                <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-700/50">
                                <tr>
                                    <th className="p-5 border-b border-slate-700 text-slate-300 font-semibold">SKU</th>
                                    <th className="p-5 border-b border-slate-700 text-slate-300 font-semibold">Part Name</th>
                                    <th className="p-5 border-b border-slate-700 text-slate-300 font-semibold">Stock Level</th>
                                    <th className="p-5 border-b border-slate-700 text-slate-300 font-semibold">Unit Price</th>
                                    <th className="p-5 border-b border-slate-700 text-slate-300 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParts.length > 0 ? (
                                    filteredParts.map(part => (
                                        <tr key={part.id} className="hover:bg-slate-700/30 transition-colors border-b border-slate-700/50 last:border-0">
                                            <td className="p-5 font-mono text-sm text-slate-400">{part.sku}</td>
                                            <td className="p-5 font-medium text-white">{part.name}</td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-lg font-bold ${part.quantity < 5 ? 'text-red-400' : 'text-white'}`}>
                                                        {part.quantity}
                                                    </span>
                                                    <span className="text-xs text-slate-500">units</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-slate-300">Rs {part.price}</td>
                                            <td className="p-5">
                                                {part.quantity === 0 ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                                        <AlertCircle size={12} /> Out of Stock
                                                    </span>
                                                ) : part.quantity < 5 ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                                        In Stock
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-slate-500">
                                            No parts found matching "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
