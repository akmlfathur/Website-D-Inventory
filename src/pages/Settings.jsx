import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Settings as SettingsIcon,
    User,
    Building,
    Bell,
    Shield,
    Save,
    Camera,
} from 'lucide-react';
import { useAuthStore } from '../store';
import './Settings.css';

export default function Settings() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+62 812 3456 7890',
        department: user?.department || '',
    });

    const [companyData, setCompanyData] = useState({
        companyName: 'PT D\'Inventory Indonesia',
        address: 'Jl. Sudirman No. 123, Jakarta Selatan',
        phone: '+62 21 1234 5678',
        email: 'info@inventaris.id',
    });

    const [notifSettings, setNotifSettings] = useState({
        emailLowStock: true,
        emailNewRequest: true,
        emailApproval: false,
        browserNotifications: true,
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNotifChange = (key) => {
        setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="settings-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>
                        <SettingsIcon size={28} className="header-icon" style={{ color: 'var(--primary)' }} />
                        Settings
                    </h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>Settings</span>
                    </div>
                </div>
            </div>

            <div className="settings-layout">
                {/* Sidebar Tabs */}
                <div className="settings-sidebar">
                    <nav className="settings-nav">
                        <button
                            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={18} />
                            Profil Saya
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'company' ? 'active' : ''}`}
                            onClick={() => setActiveTab('company')}
                        >
                            <Building size={18} />
                            Perusahaan
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <Bell size={18} />
                            Notifikasi
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Shield size={18} />
                            Keamanan
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="settings-content">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Profil Saya</h3>
                            </div>
                            <div className="card-body">
                                <div className="avatar-section">
                                    <div className="avatar-large">
                                        {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <button className="btn btn-secondary btn-sm">
                                        <Camera size={16} />
                                        Ubah Foto
                                    </button>
                                </div>

                                <form className="settings-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-input"
                                                value={profileData.name}
                                                onChange={handleProfileChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-input"
                                                value={profileData.email}
                                                onChange={handleProfileChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">No. Telepon</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="form-input"
                                                value={profileData.phone}
                                                onChange={handleProfileChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Department</label>
                                            <input
                                                type="text"
                                                name="department"
                                                className="form-input"
                                                value={profileData.department}
                                                onChange={handleProfileChange}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary">
                                            <Save size={18} />
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Company Tab */}
                    {activeTab === 'company' && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Informasi Perusahaan</h3>
                            </div>
                            <div className="card-body">
                                <form className="settings-form">
                                    <div className="form-group">
                                        <label className="form-label">Nama Perusahaan</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            className="form-input"
                                            value={companyData.companyName}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Alamat</label>
                                        <textarea
                                            name="address"
                                            className="form-input"
                                            rows="2"
                                            value={companyData.address}
                                            onChange={handleCompanyChange}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Telepon</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="form-input"
                                                value={companyData.phone}
                                                onChange={handleCompanyChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-input"
                                                value={companyData.email}
                                                onChange={handleCompanyChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary">
                                            <Save size={18} />
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Pengaturan Notifikasi</h3>
                            </div>
                            <div className="card-body">
                                <div className="toggle-list">
                                    <div className="toggle-item">
                                        <div className="toggle-info">
                                            <h4>Low Stock Alert</h4>
                                            <p>Kirim email saat stok barang menipis</p>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifSettings.emailLowStock}
                                                onChange={() => handleNotifChange('emailLowStock')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="toggle-item">
                                        <div className="toggle-info">
                                            <h4>Request Baru</h4>
                                            <p>Kirim email saat ada request barang baru</p>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifSettings.emailNewRequest}
                                                onChange={() => handleNotifChange('emailNewRequest')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="toggle-item">
                                        <div className="toggle-info">
                                            <h4>Approval Status</h4>
                                            <p>Kirim email saat request disetujui/ditolak</p>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifSettings.emailApproval}
                                                onChange={() => handleNotifChange('emailApproval')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="toggle-item">
                                        <div className="toggle-info">
                                            <h4>Browser Notifications</h4>
                                            <p>Tampilkan notifikasi di browser</p>
                                        </div>
                                        <label className="toggle">
                                            <input
                                                type="checkbox"
                                                checked={notifSettings.browserNotifications}
                                                onChange={() => handleNotifChange('browserNotifications')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Keamanan Akun</h3>
                            </div>
                            <div className="card-body">
                                <form className="settings-form">
                                    <div className="form-group">
                                        <label className="form-label">Password Saat Ini</label>
                                        <input type="password" className="form-input" placeholder="••••••••" />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Password Baru</label>
                                            <input type="password" className="form-input" placeholder="••••••••" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Konfirmasi Password</label>
                                            <input type="password" className="form-input" placeholder="••••••••" />
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary">
                                            <Save size={18} />
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
