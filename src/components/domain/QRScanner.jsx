import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, Scan, AlertCircle } from 'lucide-react';
import './QRScanner.css';

export default function QRScanner({ onScanSuccess, onClose }) {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const scannerRef = useRef(null);
    const html5QrcodeRef = useRef(null);

    useEffect(() => {
        // Get available cameras
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length) {
                    setCameras(devices);
                    setSelectedCamera(devices[0].id);
                } else {
                    setError('Tidak ada kamera yang ditemukan');
                }
            })
            .catch((err) => {
                setError('Gagal mengakses kamera: ' + err.message);
            });

        return () => {
            stopScanning();
        };
    }, []);

    const startScanning = async () => {
        if (!selectedCamera) {
            setError('Pilih kamera terlebih dahulu');
            return;
        }

        setError(null);
        setIsScanning(true);

        try {
            html5QrcodeRef.current = new Html5Qrcode('qr-reader');

            await html5QrcodeRef.current.start(
                selectedCamera,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    // Success callback
                    onScanSuccess(decodedText);
                    stopScanning();
                },
                (errorMessage) => {
                    // Error callback - ignore, just scanning
                }
            );
        } catch (err) {
            setError('Gagal memulai scanner: ' + err.message);
            setIsScanning(false);
        }
    };

    const stopScanning = async () => {
        if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
            try {
                await html5QrcodeRef.current.stop();
                html5QrcodeRef.current.clear();
            } catch (err) {
                console.error('Error stopping scanner:', err);
            }
        }
        setIsScanning(false);
    };

    const handleClose = () => {
        stopScanning();
        onClose();
    };

    return (
        <div className="qr-scanner-overlay">
            <div className="qr-scanner-modal">
                <div className="scanner-header">
                    <h3>
                        <Scan size={20} />
                        Scan QR Code
                    </h3>
                    <button className="btn btn-ghost btn-icon" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="scanner-body">
                    {error && (
                        <div className="scanner-error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Camera Selection */}
                    {cameras.length > 1 && (
                        <div className="camera-select">
                            <label className="form-label">Pilih Kamera</label>
                            <select
                                className="form-select"
                                value={selectedCamera || ''}
                                onChange={(e) => setSelectedCamera(e.target.value)}
                                disabled={isScanning}
                            >
                                {cameras.map((camera) => (
                                    <option key={camera.id} value={camera.id}>
                                        {camera.label || `Camera ${camera.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Scanner View */}
                    <div className="scanner-viewport">
                        <div id="qr-reader" ref={scannerRef}></div>
                        {!isScanning && (
                            <div className="scanner-placeholder">
                                <Camera size={48} />
                                <p>Klik tombol di bawah untuk mulai scan</p>
                            </div>
                        )}
                    </div>

                    {/* Scanner Frame Overlay */}
                    {isScanning && (
                        <div className="scanner-frame">
                            <div className="frame-corner top-left"></div>
                            <div className="frame-corner top-right"></div>
                            <div className="frame-corner bottom-left"></div>
                            <div className="frame-corner bottom-right"></div>
                            <div className="scan-line"></div>
                        </div>
                    )}
                </div>

                <div className="scanner-footer">
                    {!isScanning ? (
                        <button
                            className="btn btn-primary btn-block"
                            onClick={startScanning}
                            disabled={!selectedCamera}
                        >
                            <Camera size={18} />
                            Mulai Scan
                        </button>
                    ) : (
                        <button className="btn btn-danger btn-block" onClick={stopScanning}>
                            <X size={18} />
                            Berhenti Scan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
