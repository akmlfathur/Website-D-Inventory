import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Box,
  Layers,
  MapPin,
} from 'lucide-react';
import { useAuthStore } from '../../store';
import './Sidebar.css';

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isStaff } = useAuthStore();

  // Build menu based on role
  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      label: 'D\'Inventory',
      icon: Package,
      path: '/inventory',
      children: [
        { label: 'Semua Barang', path: '/inventory', icon: Box },
        { label: 'Kategori', path: '/inventory/categories', icon: Layers },
        { label: 'Lokasi', path: '/inventory/locations', icon: MapPin },
      ],
    },
  ];

  // Add transactions menu for staff and admin
  if (isStaff()) {
    menuItems.push({
      label: 'Transaksi',
      icon: FileText,
      path: '/transactions',
      children: [
        { label: 'Barang Masuk', path: '/transactions/inbound', icon: ArrowDownToLine },
        { label: 'Barang Keluar', path: '/transactions/outbound', icon: ArrowUpFromLine },
        { label: 'Request Pending', path: '/transactions/requests', icon: ClipboardList },
      ],
    });
  }

  // Add users menu for admin only
  if (isAdmin()) {
    menuItems.push({
      label: 'Users',
      icon: Users,
      path: '/users',
    });
  }

  const bottomMenuItems = [
    {
      label: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <Package size={24} />
          </div>
          {!collapsed && <span className="logo-text">D'Inventory</span>}
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          <ChevronLeft size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              {item.children ? (
                <>
                  <NavLink
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                  {!collapsed && isActive(item.path) && (
                    <ul className="nav-submenu">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              `nav-sublink ${isActive ? 'active' : ''}`
                            }
                            end={child.path === item.path}
                          >
                            <child.icon size={16} />
                            <span>{child.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end
                >
                  <item.icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && user && (
          <div className="user-info-sidebar">
            <div className="user-avatar-small">
              {user.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role?.replace('_', ' ')}</span>
            </div>
          </div>
        )}
        <ul className="nav-list">
          {bottomMenuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
          <li className="nav-item">
            <button className="nav-link logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              {!collapsed && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
