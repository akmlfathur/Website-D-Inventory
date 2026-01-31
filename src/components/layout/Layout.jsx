import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div className="app-layout">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={toggleSidebar}
                mobileOpen={mobileMenuOpen}
            />
            <main className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <Header
                    collapsed={sidebarCollapsed}
                    onMenuClick={toggleMobileMenu}
                />
                <div className="page-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
