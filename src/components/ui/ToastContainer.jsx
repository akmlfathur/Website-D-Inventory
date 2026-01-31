import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import useToastStore from '../../store/toastStore';
import './Toast.css';

export default function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <AlertCircle size={20} />;
            case 'warning':
                return <AlertTriangle size={20} />;
            default:
                return <Info size={20} />;
        }
    };

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <div className="toast-icon">{getIcon(toast.type)}</div>
                    <div className="toast-content">
                        {toast.title && <strong>{toast.title}</strong>}
                        <p>{toast.message}</p>
                    </div>
                    <button
                        className="toast-close"
                        onClick={() => removeToast(toast.id)}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
