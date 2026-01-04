import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const InventoryManagement = () => {
    const [parts, setParts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPart, setNewPart] = useState({
        name: '',
        sku: '',
        description: '',
        quantity: 0,
        price: 0.00,
        cost_price: 0.00
    });

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
                setParts(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreatePart = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/parts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newPart)
            });

            if (response.ok) {
                setShowModal(false);
                fetchParts();
                setNewPart({ name: '', sku: '', description: '', quantity: 0, price: 0, cost_price: 0 });
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Spare Parts & Inventory</h2>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2">
                    + Add New Part
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parts.map(part => (
                    <div key={part.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-100">{part.name}</h3>
                                <p className="text-xs text-slate-400 font-mono mt-1">SKU: {part.sku}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${part.quantity > 5 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                Stock: {part.quantity}
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{part.description}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                            <div>
                                <p className="text-xs text-slate-500">Selling Price</p>
                                <p className="text-lg font-bold text-blue-400">Rs{part.price}</p>
                            </div>
                            <button className="text-slate-400 hover:text-white transition-colors">Edit</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md border border-slate-700 shadow-2xl">
                        <h3 className="text-xl font-bold mb-6">Add New Part</h3>
                        <form onSubmit={handleCreatePart} className="space-y-4">
                            <input type="text" placeholder="Part Name" required className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none" value={newPart.name} onChange={e => setNewPart({ ...newPart, name: e.target.value })} />
                            <input type="text" placeholder="SKU" required className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none" value={newPart.sku} onChange={e => setNewPart({ ...newPart, sku: e.target.value })} />
                            <textarea placeholder="Description" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none h-24" value={newPart.description} onChange={e => setNewPart({ ...newPart, description: e.target.value })}></textarea>
                            <div className="grid grid-cols-3 gap-4">
                                <input type="number" placeholder="Quantity" required className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none" value={newPart.quantity} onChange={e => setNewPart({ ...newPart, quantity: e.target.value })} />
                                <input type="number" step="0.01" placeholder="Cost Price" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none" value={newPart.cost_price} onChange={e => setNewPart({ ...newPart, cost_price: e.target.value })} />
                                <input type="number" step="0.01" placeholder="Selling Price" required className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white outline-none" value={newPart.price} onChange={e => setNewPart({ ...newPart, price: e.target.value })} />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium">Add Part</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
