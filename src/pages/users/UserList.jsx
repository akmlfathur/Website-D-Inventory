import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Shield,
    User,
    Mail,
    Building,
} from 'lucide-react';
import './UserList.css';

const usersData = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@company.com',
        role: 'super_admin',
        department: 'IT',
        status: 'active',
        lastLogin: '2024-12-21T10:30:00',
    },
    {
        id: 2,
        name: 'Staff Gudang',
        email: 'staff@company.com',
        role: 'staff',
        department: 'Warehouse',
        status: 'active',
        lastLogin: '2024-12-21T09:15:00',
    },
    {
        id: 3,
        name: 'Budi Santoso',
        email: 'budi@company.com',
        role: 'employee',
        department: 'Marketing',
        status: 'active',
        lastLogin: '2024-12-20T14:45:00',
    },
    {
        id: 4,
        name: 'Rina Dewi',
        email: 'rina@company.com',
        role: 'employee',
        department: 'Marketing',
        status: 'active',
        lastLogin: '2024-12-19T11:20:00',
    },
    {
        id: 5,
        name: 'Ahmad Fauzi',
        email: 'ahmad@company.com',
        role: 'employee',
        department: 'Finance',
        status: 'inactive',
        lastLogin: '2024-12-10T08:00:00',
    },
];

export default function UserList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showActions, setShowActions] = useState(null);

    const getRoleBadge = (role) => {
        const roleMap = {
            super_admin: { label: 'Super Admin', class: 'badge-danger' },
            staff: { label: 'Staff', class: 'badge-info' },
            employee: { label: 'Employee', class: 'badge-neutral' },
        };
        const info = roleMap[role] || roleMap.employee;
        return <span className={`badge ${info.class}`}>{info.label}</span>;
    };

    const getStatusBadge = (status) => {
        return (
            <span className={`badge ${status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                {status === 'active' ? 'Active' : 'Inactive'}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="users-page">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>
                        <Users size={28} className="header-icon" style={{ color: 'var(--primary)' }} />
                        User Management
                    </h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>Users</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary">
                        <Plus size={18} />
                        Tambah User
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="card filter-card">
                <div className="filter-row">
                    <div className="search-input-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Cari nama atau email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select className="form-select" style={{ width: 'auto', minWidth: '150px' }}>
                        <option value="all">Semua Role</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="staff">Staff</option>
                        <option value="employee">Employee</option>
                    </select>
                    <select className="form-select" style={{ width: 'auto', minWidth: '150px' }}>
                        <option value="all">Semua Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                {getInitials(user.name)}
                                            </div>
                                            <div className="user-info">
                                                <span className="user-name">{user.name}</span>
                                                <span className="user-email">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{getRoleBadge(user.role)}</td>
                                    <td>
                                        <div className="dept-cell">
                                            <Building size={14} />
                                            {user.department}
                                        </div>
                                    </td>
                                    <td>{getStatusBadge(user.status)}</td>
                                    <td className="text-muted text-sm">{formatDate(user.lastLogin)}</td>
                                    <td className="actions-cell">
                                        <div className="action-menu">
                                            <button
                                                className="btn btn-ghost btn-icon"
                                                onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            {showActions === user.id && (
                                                <div className="action-dropdown">
                                                    <button className="dropdown-item">
                                                        <Edit size={16} />
                                                        Edit User
                                                    </button>
                                                    <button className="dropdown-item">
                                                        <Shield size={16} />
                                                        Change Role
                                                    </button>
                                                    <hr className="dropdown-divider" />
                                                    <button className="dropdown-item danger">
                                                        <Trash2 size={16} />
                                                        Delete User
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
