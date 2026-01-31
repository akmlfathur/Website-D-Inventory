import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';

export default function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role if required
    if (requiredRole) {
        const roleHierarchy = {
            super_admin: 3,
            staff: 2,
            employee: 1,
        };

        const userLevel = roleHierarchy[user?.role] || 0;
        const requiredLevel = roleHierarchy[requiredRole] || 0;

        if (userLevel < requiredLevel) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
}
