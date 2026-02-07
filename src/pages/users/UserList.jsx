import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Shield,
    Building,
    Loader,
} from 'lucide-react';
import { userService } from '../../services';
import './UserList.css';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showActions, setShowActions] = useState(null);

    const hasFetched = useRef(false);

    // Fetch users on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await userService.getAll();
            if (res.success) {
                setUsers(res.data?.data || res.data || []);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Gagal memuat data user');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

        try {
            const res = await userService.delete(userId);
            if (res.success) {
                setUsers(prev => prev.filter(u => u.id !== userId));
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Gagal menghapus user');
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

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
        const isActive = status === 'active' || status !== 'inactive';
        return (
            <span className={`badge ${isActive ? 'badge-success' : 'badge-neutral'}`}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
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
        if (!name) return 'U';
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

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                    {error}
                </div>
            )}

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
                    <select
                        className="form-select"
                        style={{ width: 'auto', minWidth: '150px' }}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">Semua Role</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="staff">Staff</option>
                        <option value="employee">Employee</option>
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        <div style={{ padding: 'var(--spacing-8)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                            <Loader size={20} className="animate-spin" />
                                            <span>Memuat data user...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">
                                        {searchQuery || roleFilter !== 'all'
                                            ? 'Tidak ada user yang cocok dengan filter'
                                            : 'Tidak ada data user'}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
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
                                                {user.department || '-'}
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(user.status)}</td>
                                        <td className="text-muted text-sm">{formatDate(user.last_login_at || user.updated_at)}</td>
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
                                                        <button
                                                            className="dropdown-item danger"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                            Delete User
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
