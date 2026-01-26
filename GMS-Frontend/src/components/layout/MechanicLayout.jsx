import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarLayout from './SidebarLayout';
import EditProfileModal from '../EditProfileModal';
import { Briefcase, Package } from 'lucide-react';

const MechanicLayout = () => {
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
        { id: 'dashboard', label: 'My Assignments', icon: Briefcase, path: '/mechanic/dashboard' },
        { id: 'inventory', label: 'Parts Inventory', icon: Package, path: '/mechanic/inventory' },
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
                title="Mechanic"
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

export default MechanicLayout;
