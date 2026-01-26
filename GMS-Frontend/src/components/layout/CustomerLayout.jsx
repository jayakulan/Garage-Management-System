import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarLayout from './SidebarLayout';
import EditProfileModal from '../EditProfileModal';
import { Home, History, PlusCircle, Car } from 'lucide-react';

const CustomerLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleProfileClick = () => {
        setIsProfileModalOpen(true);
    };

    const handleProfileSave = (updatedUser) => {
        console.log('Profile updated:', updatedUser);
    };

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: Home, path: '/customer/dashboard' },
        { id: 'request-service', label: 'Request Service', icon: PlusCircle, path: '/customer/request-service' },
        { id: 'history', label: 'Service History', icon: History, path: '/customer/history' },
        { id: 'vehicles', label: 'My Vehicles', icon: Car, path: '/customer/vehicles' },
    ];

    // Determine active tab based on current route
    const getActiveTab = () => {
        const currentPath = location.pathname;
        const activeItem = menuItems.find(item => item.path === currentPath);
        return activeItem ? activeItem.id : 'dashboard';
    };

    const handleTabChange = (tabId) => {
        const item = menuItems.find(i => i.id === tabId);
        if (item) {
            navigate(item.path);
        }
    };

    return (
        <>
            <SidebarLayout
                title="Customer"
                user={user}
                menuItems={menuItems}
                activeTab={getActiveTab()}
                onTabChange={handleTabChange}
                onLogout={handleLogout}
                onProfileClick={handleProfileClick}
            >
                <Outlet />
            </SidebarLayout>

            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
                onSave={handleProfileSave}
            />
        </>
    );
};

export default CustomerLayout;
