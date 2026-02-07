import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Package } from 'lucide-react';
import { useAuthStore } from '../../store';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData.email, formData.password);
        if (result.success) {
            navigate('/');
        }
    };

    const fillDemo = (type) => {
        const emails = {
            admin: 'admin@company.com',
            staff: 'budi@company.com',
            user: 'rina@company.com',
        };
        setFormData({
            email: emails[type],
            password: 'password123',
            rememberMe: false,
        });
    };

    return (
        <div className="login-page">
            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    <div className="logo-icon">
                        <Package size={32} />
                    </div>
                    <h1 className="logo-text">D'Inventory</h1>
                </div>

                {/* Header */}
                <div className="login-header">
                    <h2>Selamat Datang! <span className="wave">👋</span></h2>
                    <p>Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <div className="input-with-icon">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-input"
                                placeholder="nama@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <div className="label-row">
                            <label htmlFor="password" className="form-label">Password</label>
                            <a href="#" className="forgot-link">Lupa password?</a>
                        </div>
                        <div className="input-with-icon">
                            <Lock size={20} className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="form-input"
                                placeholder="Masukkan password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="remember-row">
                        <input
                            type="checkbox"
                            id="remember-me"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="checkbox"
                        />
                        <label htmlFor="remember-me" className="remember-label">
                            Ingat saya
                        </label>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="btn btn-primary btn-login" disabled={isLoading}>
                        {isLoading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                {/* Demo Accounts */}
                <div className="demo-section">
                    <p className="demo-title">Demo Accounts</p>
                    <div className="demo-list">
                        <button type="button" className="demo-item" onClick={() => fillDemo('admin')}>
                            <div className="demo-role">
                                <span className="demo-dot purple"></span>
                                <span>Admin</span>
                            </div>
                            <code>admin@company.com</code>
                        </button>
                        <button type="button" className="demo-item" onClick={() => fillDemo('staff')}>
                            <div className="demo-role">
                                <span className="demo-dot blue"></span>
                                <span>Staff</span>
                            </div>
                            <code>budi@company.com</code>
                        </button>
                        <button type="button" className="demo-item" onClick={() => fillDemo('user')}>
                            <div className="demo-role">
                                <span className="demo-dot green"></span>
                                <span>Employee</span>
                            </div>
                            <code>rina@company.com</code>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
