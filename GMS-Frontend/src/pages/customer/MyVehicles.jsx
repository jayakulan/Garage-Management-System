import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Car } from 'lucide-react';

const MyVehicles = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (user) {
            fetchMyVehicles();
        }
    }, [user]);

    const fetchMyVehicles = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/jobs/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const allJobs = data.results || data;
                const myJobs = allJobs.filter(job => Number(job.customer) === Number(user.user_id));
                const uniqueVehicles = [...new Set(myJobs.map(job => job.vehicle_reg_number))]
                    .map(reg => {
                        const job = myJobs.find(j => j.vehicle_reg_number === reg);
                        return { reg, model: job.vehicle_model };
                    });
                setVehicles(uniqueVehicles);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.length === 0 ? (
                    <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg col-span-full text-center">
                        <p className="text-slate-400">No vehicles tracked in system yet.</p>
                        <p className="text-xs text-slate-500 mt-2">Vehicles will appear here once you request a service.</p>
                    </div>
                ) : (
                    vehicles.map((v, idx) => (
                        <div key={idx} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center justify-between group hover:border-blue-500/50 transition-all">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{v.reg}</h3>
                                <p className="text-slate-400 text-sm mt-1">{v.model}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <Car size={24} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyVehicles;
