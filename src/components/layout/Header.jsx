import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, User, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store';
import './Header.css';

export default function Header({ onMenuClick, collapsed }) {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const notifications = [
        { id: 1, type: 'warning', message: 'Stok Kertas A4 menipis (8 rim)', time: '5 menit lalu' },
        { id: 2, type: 'info', message: 'Request baru dari Budi Santoso', time: '15 menit lalu' },
        { id: 3, type: 'success', message: 'Laptop Dell XPS dikembalikan', time: '1 jam lalu' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRoleLabel = (role) => {
        const roleLabels = {
            super_admin: 'Super Admin',
            staff: 'Staff Gudang',
            employee: 'Employee',
        };
        return roleLabels[role] || role;
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className={`header ${collapsed ? 'collapsed' : ''}`}>
            <div className="header-left">
                <button className="menu-btn" onClick={onMenuClick}>
                    <Menu size={20} />
                </button>
            </div>

            <div className="header-right">
                {/* Notifications */}
                <div className="header-dropdown">
                    <button
                        className="icon-btn notification-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        <span className="notification-badge">3</span>
                    </button>
                    {showNotifications && (
                        <div className="dropdown-menu notifications-dropdown">
                            <div className="dropdown-header">
                                <h4>Notifikasi</h4>
                                <button className="text-btn">Tandai semua dibaca</button>
                            </div>
                            <div className="dropdown-body">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className={`notification-item ${notif.type}`}>
                                        <div className="notification-content">
                                            <p>{notif.message}</p>
                                            <span className="notification-time">{notif.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="dropdown-footer">
                                <Link to="/notifications">Lihat semua notifikasi</Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="header-dropdown">
                    <button
                        className="profile-btn"
                        onClick={() => setShowProfile(!showProfile)}
                    >
                        <div className="avatar">
                            {getInitials(user?.name)}
                        </div>
                        <div className="profile-info">
                            <span className="profile-name">{user?.name || 'User'}</span>
                            <span className="profile-role">{getRoleLabel(user?.role)}</span>
                        </div>
                        <ChevronDown size={16} />
                    </button>
                    {showProfile && (
                        <div className="dropdown-menu profile-dropdown">
                            <Link to="/settings" className="dropdown-item" onClick={() => setShowProfile(false)}>
                                <User size={16} />
                                Profil Saya
                            </Link>
                            <Link to="/settings" className="dropdown-item" onClick={() => setShowProfile(false)}>
                                <Settings size={16} />
                                Settings
                            </Link>
                            <hr className="dropdown-divider" />
                            <button className="dropdown-item logout" onClick={handleLogout}>
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
