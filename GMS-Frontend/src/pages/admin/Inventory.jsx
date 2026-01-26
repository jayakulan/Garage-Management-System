import React, { useState, useEffect } from 'react';
import { Package, X, DollarSign, List, Activity, Hash, Layers, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const InventoryManagement = () => {
    const [parts, setParts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedPart, setSelectedPart] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
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
                showToast('Part added successfully!', 'success');
            } else {
                showToast('Failed to add part', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error adding part', 'error');
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type, visible: true });
        setTimeout(() => setToast({ ...toast, visible: false }), 3000);
    };

    const handleEditPart = (part) => {
        setSelectedPart({ ...part });
        setShowEditModal(true);
    };

    const handleUpdatePart = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/parts/${selectedPart.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(selectedPart)
            });

            if (response.ok) {
                setShowEditModal(false);
                fetchParts();
                showToast('Part updated successfully!', 'success');
            } else {
                const errorData = await response.json();
                console.error('Update error:', errorData);
                showToast(errorData.message || 'Failed to update part', 'error');
            }
        } catch (error) {
            console.error('Error updating part:', error);
            showToast('Error updating part: ' + error.message, 'error');
        }
    };

    const handleDeletePart = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/parts/${selectedPart.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setShowDeleteConfirm(false);
                fetchParts();
                showToast('Part deleted successfully!', 'success');
            } else {
                const errorData = await response.json();
                console.error('Delete error:', errorData);
                showToast(errorData.message || 'Failed to delete part', 'error');
            }
        } catch (error) {
            console.error('Error deleting part:', error);
            showToast('Error deleting part: ' + error.message, 'error');
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
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleEditPart(part)}
                                    className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button 
                                    onClick={() => {
                                        setSelectedPart(part);
                                        setShowDeleteConfirm(true);
                                    }}
                                    className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stylish Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Package className="text-blue-500" size={24} />
                                    Add New Part
                                </h3>
                                <p className="text-slate-400 text-sm mt-1">Enter details to add a new item to inventory.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <form id="addPartForm" onSubmit={handleCreatePart} className="space-y-6">
                                {/* Basic Info Section */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <List size={14} /> Basic Information
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Part Name</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                                    placeholder="e.g. Oil Filter"
                                                    value={newPart.name}
                                                    onChange={e => setNewPart({ ...newPart, name: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">SKU / Code</label>
                                            <div className="relative group">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                                    <Hash size={16} />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-mono"
                                                    placeholder="AUTO-001"
                                                    value={newPart.sku}
                                                    onChange={e => setNewPart({ ...newPart, sku: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Description</label>
                                        <textarea
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 min-h-[100px] resize-none"
                                            placeholder="Detailed description of the part, compatibility, etc."
                                            value={newPart.description}
                                            onChange={e => setNewPart({ ...newPart, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-800 w-full my-6"></div>

                                {/* Tracking & Pricing Section */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Activity size={14} /> Inventory & Pricing
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Initial Stock</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                                    <Layers size={16} />
                                                </div>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                                    placeholder="0"
                                                    value={newPart.quantity}
                                                    onChange={e => setNewPart({ ...newPart, quantity: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Cost Price</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                                    <DollarSign size={16} />
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                                    placeholder="0.00"
                                                    value={newPart.cost_price}
                                                    onChange={e => setNewPart({ ...newPart, cost_price: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Selling Price</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
                                                    <DollarSign size={16} />
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    min="0"
                                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-slate-600"
                                                    placeholder="0.00"
                                                    value={newPart.price}
                                                    onChange={e => setNewPart({ ...newPart, price: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-4 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="addPartForm"
                                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                <Package size={18} />
                                Add Part
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Part Modal */}
            {showEditModal && selectedPart && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Edit2 className="text-blue-500" size={24} />
                                    Edit Part
                                </h3>
                                <p className="text-slate-400 text-sm mt-1">Update inventory details.</p>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            <form id="editPartForm" onSubmit={handleUpdatePart} className="space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase">Basic Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Part Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all"
                                                value={selectedPart.name}
                                                onChange={e => setSelectedPart({ ...selectedPart, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">SKU / Code</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-mono"
                                                value={selectedPart.sku}
                                                onChange={e => setSelectedPart({ ...selectedPart, sku: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Description</label>
                                        <textarea
                                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all min-h-[100px] resize-none"
                                            value={selectedPart.description}
                                            onChange={e => setSelectedPart({ ...selectedPart, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-slate-800"></div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase">Inventory & Pricing</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Stock Quantity</label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all"
                                                value={selectedPart.quantity}
                                                onChange={e => setSelectedPart({ ...selectedPart, quantity: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Cost Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all"
                                                value={selectedPart.cost_price}
                                                onChange={e => setSelectedPart({ ...selectedPart, cost_price: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Selling Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                min="0"
                                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-all"
                                                value={selectedPart.price}
                                                onChange={e => setSelectedPart({ ...selectedPart, price: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-4 justify-end">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-6 py-2.5 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="editPartForm"
                                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all"
                            >
                                Update Part
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && selectedPart && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md border border-red-500/30 shadow-2xl">
                        <h3 className="text-xl font-bold text-red-400 mb-4">Delete Part</h3>
                        <p className="text-slate-300 mb-6">
                            Are you sure you want to delete <span className="font-semibold">{selectedPart.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowDeleteConfirm(false)} 
                                className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeletePart}
                                className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.visible && (
                <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg font-medium flex items-center gap-2 z-50 ${
                    toast.type === 'success' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                }`}>
                    <span className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-green-300' : 'bg-red-300'}`}></span>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
