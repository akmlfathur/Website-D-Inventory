import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowDownToLine,
    Scan,
    Package,
    MapPin,
    FileText,
    Save,
    X,
    CheckCircle,
    Loader,
    Plus,
    Layers,
} from 'lucide-react';
import { QRScanner } from '../../components/domain';
import { itemService, categoryService, locationService, transactionService } from '../../services';
import './Transactions.css';

export default function Inbound() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);

    // New Item Modal
    const [showNewItemModal, setShowNewItemModal] = useState(false);
    const [isCreatingItem, setIsCreatingItem] = useState(false);
    const [newItemForm, setNewItemForm] = useState({
        name: '',
        sku: '',
        category_id: '',
        location_id: '',
        type: 'consumable',
        unit: 'pcs',
        stock: 0,
        min_stock: 0,
        price: 0,
        description: '',
    });
    const [newItemError, setNewItemError] = useState(null);

    // New Category Modal
    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryForm, setNewCategoryForm] = useState({
        name: '',
        description: '',
    });
    const [newCategoryError, setNewCategoryError] = useState(null);

    const hasFetched = useRef(false);

    const [formData, setFormData] = useState({
        item_id: '',
        quantity: 1,
        supplier: '',
        invoice_no: '',
        location_id: '',
        notes: '',
    });

    // Fetch items, categories, and locations on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [itemsRes, locationsRes, categoriesRes] = await Promise.all([
                    itemService.getAll({ per_page: 100 }),
                    locationService.getAll(),
                    categoryService.getAll().catch(() => ({ success: false })),
                ]);

                if (itemsRes.success) {
                    setItems(itemsRes.data.data || itemsRes.data || []);
                }
                if (locationsRes.success) {
                    setLocations(locationsRes.data?.data || locationsRes.data || []);
                }
                if (categoriesRes.success) {
                    setCategories(categoriesRes.data || []);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Gagal memuat data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleScanSuccess = (decodedText) => {
        setScannedData(decodedText);
        setShowScanner(false);

        // Parse QR code data (format: INVT-ASSET-SKU-SERIAL)
        const parts = decodedText.split('-');
        if (parts.length >= 3) {
            const sku = parts[2];
            // Find item by SKU
            const foundItem = items.find(item => item.sku === sku);
            if (foundItem) {
                setFormData(prev => ({ ...prev, item_id: foundItem.id.toString() }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await transactionService.create({
                type: 'inbound',
                item_id: parseInt(formData.item_id),
                quantity: parseInt(formData.quantity),
                supplier: formData.supplier || null,
                invoice_no: formData.invoice_no || null,
                location_id: formData.location_id ? parseInt(formData.location_id) : null,
                notes: formData.notes || null,
            });

            if (res.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                // Reset form
                setFormData({
                    item_id: '',
                    quantity: 1,
                    supplier: '',
                    invoice_no: '',
                    location_id: '',
                    notes: '',
                });
                setScannedData(null);
            } else {
                setError(res.message || 'Gagal menyimpan transaksi');
            }
        } catch (err) {
            console.error('Error submitting transaction:', err);
            setError('Gagal menyimpan transaksi');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            item_id: '',
            quantity: 1,
            supplier: '',
            invoice_no: '',
            location_id: '',
            notes: '',
        });
        setScannedData(null);
        setError(null);
    };

    // ===== New Item Handlers =====
    const handleOpenNewItem = () => {
        setNewItemForm({
            name: '',
            sku: '',
            category_id: '',
            location_id: '',
            type: 'consumable',
            unit: 'pcs',
            stock: 0,
            min_stock: 0,
            price: 0,
            description: '',
        });
        setNewItemError(null);
        setShowNewItemModal(true);
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItemForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateItem = async (e) => {
        e.preventDefault();
        setIsCreatingItem(true);
        setNewItemError(null);

        try {
            const payload = {
                name: newItemForm.name.trim(),
                sku: newItemForm.sku.trim() || null,
                category_id: parseInt(newItemForm.category_id),
                location_id: parseInt(newItemForm.location_id),
                type: newItemForm.type,
                unit: newItemForm.unit || 'pcs',
                stock: parseInt(newItemForm.stock) || 0,
                min_stock: parseInt(newItemForm.min_stock) || 0,
                price: parseFloat(newItemForm.price) || 0,
                description: newItemForm.description.trim() || null,
            };

            const res = await itemService.create(payload);

            if (res.success) {
                const newItem = res.data;
                // Add new item to the items list
                setItems(prev => [...prev, newItem]);
                // Auto-select the new item in the inbound form
                setFormData(prev => ({ ...prev, item_id: newItem.id.toString() }));
                setShowNewItemModal(false);
            } else {
                setNewItemError(res.message || 'Gagal membuat item baru');
            }
        } catch (err) {
            console.error('Error creating item:', err);
            const errMsg = err?.response?.data?.message || 'Gagal membuat item baru';
            setNewItemError(errMsg);
        } finally {
            setIsCreatingItem(false);
        }
    };

    // ===== New Category Handlers =====
    const handleOpenNewCategory = () => {
        setNewCategoryForm({ name: '', description: '' });
        setNewCategoryError(null);
        setShowNewCategoryModal(true);
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setIsCreatingCategory(true);
        setNewCategoryError(null);

        try {
            const res = await categoryService.create({
                name: newCategoryForm.name.trim(),
                description: newCategoryForm.description.trim() || null,
            });

            if (res.success) {
                const newCat = res.data;
                setCategories(prev => [...prev, newCat]);
                // Auto-select the new category in the new item form
                setNewItemForm(prev => ({ ...prev, category_id: newCat.id.toString() }));
                setShowNewCategoryModal(false);
            } else {
                setNewCategoryError(res.message || 'Gagal membuat kategori baru');
            }
        } catch (err) {
            console.error('Error creating category:', err);
            setNewCategoryError('Gagal membuat kategori baru');
        } finally {
            setIsCreatingCategory(false);
        }
    };

    return (
        <div className="transaction-page">
            {/* Success Toast */}
            {showSuccess && (
                <div className="toast-container">
                    <div className="toast success">
                        <CheckCircle size={20} />
                        <div>
                            <strong>Berhasil!</strong>
                            <p>Transaksi barang masuk berhasil disimpan</p>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Scanner Modal */}
            {showScanner && (
                <QRScanner
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>
                        <ArrowDownToLine size={28} className="header-icon success" />
                        Barang Masuk
                    </h1>
                    <div className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/transactions">Transaksi</Link>
                        <span>/</span>
                        <span>Barang Masuk</span>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                    {error}
                </div>
            )}

            <div className="transaction-grid">
                {/* QR Scan Section */}
                <div className="card scan-card">
                    <div className="card-header">
                        <h3>📷 Scan QR Code</h3>
                    </div>
                    <div className="card-body">
                        <div className="scan-prompt">
                            <div className="scan-icon">
                                <Scan size={48} />
                            </div>
                            <p>Scan QR Code pada barang untuk mengisi form secara otomatis</p>

                            {scannedData && (
                                <div className="scanned-result">
                                    <CheckCircle size={16} />
                                    <span>Scanned: {scannedData}</span>
                                </div>
                            )}

                            <button
                                className="btn btn-primary btn-block"
                                onClick={() => setShowScanner(true)}
                            >
                                <Scan size={18} />
                                Mulai Scan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="card form-card">
                    <div className="card-header">
                        <h3>📝 Detail Barang Masuk</h3>
                    </div>
                    <div className="card-body">
                        {isLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-8)' }}>
                                <Loader size={24} className="animate-spin" />
                                <span style={{ marginLeft: 'var(--spacing-2)' }}>Memuat data...</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Item Details */}
                                <div className="form-section">
                                    <h4>
                                        <Package size={18} />
                                        Informasi Barang
                                    </h4>
                                    <div className="form-row">
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label className="form-label">Item *</label>
                                            <select
                                                name="item_id"
                                                className="form-select"
                                                value={formData.item_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Pilih atau cari item...</option>
                                                {items.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name} (Stok: {item.stock})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                                            <button type="button" className="btn btn-secondary" onClick={handleOpenNewItem} title="Tambah Item Baru">
                                                <Plus size={18} />
                                                Item Baru
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-row" style={{ marginTop: 'var(--spacing-3)' }}>
                                        <div className="form-group" style={{ maxWidth: '150px' }}>
                                            <label className="form-label">Jumlah *</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                className="form-input"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Supplier</label>
                                            <input
                                                type="text"
                                                name="supplier"
                                                className="form-input"
                                                placeholder="Nama supplier..."
                                                value={formData.supplier}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">No. Invoice</label>
                                            <input
                                                type="text"
                                                name="invoice_no"
                                                className="form-input"
                                                placeholder="INV-XXXX"
                                                value={formData.invoice_no}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="form-section">
                                    <h4>
                                        <MapPin size={18} />
                                        Lokasi Penyimpanan
                                    </h4>
                                    <div className="form-group">
                                        <label className="form-label">Lokasi</label>
                                        <select
                                            name="location_id"
                                            className="form-select"
                                            value={formData.location_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">Pilih lokasi...</option>
                                            {locations.map((loc) => (
                                                <option key={loc.id} value={loc.id}>
                                                    {loc.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="form-section">
                                    <h4>
                                        <FileText size={18} />
                                        Catatan
                                    </h4>
                                    <div className="form-group">
                                        <textarea
                                            name="notes"
                                            className="form-input"
                                            rows="3"
                                            placeholder="Tambahkan catatan jika diperlukan..."
                                            value={formData.notes}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        <X size={18} />
                                        Batal
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader size={18} className="animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Simpan Barang Masuk
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== New Item Modal ===== */}
            {showNewItemModal && (
                <div className="modal-overlay" onClick={() => setShowNewItemModal(false)}>
                    <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📦 Tambah Item Baru</h3>
                            <button className="modal-close" onClick={() => setShowNewItemModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateItem}>
                            <div className="modal-body">
                                {newItemError && (
                                    <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                                        {newItemError}
                                    </div>
                                )}
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Nama Barang *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            placeholder="Masukkan nama barang"
                                            value={newItemForm.name}
                                            onChange={handleNewItemChange}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">SKU</label>
                                        <input
                                            type="text"
                                            name="sku"
                                            className="form-input"
                                            placeholder="SKU-XXXX"
                                            value={newItemForm.sku}
                                            onChange={handleNewItemChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Kategori *</label>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                                            <select
                                                name="category_id"
                                                className="form-select"
                                                value={newItemForm.category_id}
                                                onChange={handleNewItemChange}
                                                required
                                                style={{ flex: 1 }}
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-icon"
                                                onClick={handleOpenNewCategory}
                                                title="Kategori Baru"
                                                style={{ flexShrink: 0 }}
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Lokasi *</label>
                                        <select
                                            name="location_id"
                                            className="form-select"
                                            value={newItemForm.location_id}
                                            onChange={handleNewItemChange}
                                            required
                                        >
                                            <option value="">Pilih Lokasi</option>
                                            {locations.map(loc => (
                                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tipe</label>
                                        <select
                                            name="type"
                                            className="form-select"
                                            value={newItemForm.type}
                                            onChange={handleNewItemChange}
                                        >
                                            <option value="consumable">Consumable</option>
                                            <option value="asset">Asset</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Satuan</label>
                                        <input
                                            type="text"
                                            name="unit"
                                            className="form-input"
                                            placeholder="pcs, rim, unit..."
                                            value={newItemForm.unit}
                                            onChange={handleNewItemChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Stok Awal</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            className="form-input"
                                            value={newItemForm.stock}
                                            onChange={handleNewItemChange}
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Stok Minimum</label>
                                        <input
                                            type="number"
                                            name="min_stock"
                                            className="form-input"
                                            value={newItemForm.min_stock}
                                            onChange={handleNewItemChange}
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Harga</label>
                                        <input
                                            type="number"
                                            name="price"
                                            className="form-input"
                                            value={newItemForm.price}
                                            onChange={handleNewItemChange}
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label className="form-label">Deskripsi</label>
                                        <textarea
                                            name="description"
                                            className="form-input"
                                            rows="2"
                                            placeholder="Deskripsi barang (opsional)"
                                            value={newItemForm.description}
                                            onChange={handleNewItemChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowNewItemModal(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isCreatingItem}>
                                    {isCreatingItem ? (
                                        <><Loader size={16} className="animate-spin" /> Menyimpan...</>
                                    ) : (
                                        <><Save size={16} /> Simpan Item Baru</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== New Category Modal ===== */}
            {showNewCategoryModal && (
                <div className="modal-overlay" onClick={() => setShowNewCategoryModal(false)} style={{ zIndex: 1100 }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ zIndex: 1101 }}>
                        <div className="modal-header">
                            <h3><Layers size={20} style={{ marginRight: 'var(--spacing-2)' }} /> Kategori Baru</h3>
                            <button className="modal-close" onClick={() => setShowNewCategoryModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCategory}>
                            <div className="modal-body">
                                {newCategoryError && (
                                    <div className="alert alert-danger" style={{ marginBottom: 'var(--spacing-4)' }}>
                                        {newCategoryError}
                                    </div>
                                )}
                                <div className="form-group">
                                    <label className="form-label">Nama Kategori *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Masukkan nama kategori"
                                        value={newCategoryForm.name}
                                        onChange={(e) => setNewCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group" style={{ marginTop: 'var(--spacing-3)' }}>
                                    <label className="form-label">Deskripsi</label>
                                    <textarea
                                        className="form-input"
                                        rows="2"
                                        placeholder="Deskripsi kategori (opsional)"
                                        value={newCategoryForm.description}
                                        onChange={(e) => setNewCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowNewCategoryModal(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isCreatingCategory}>
                                    {isCreatingCategory ? (
                                        <><Loader size={16} className="animate-spin" /> Menyimpan...</>
                                    ) : (
                                        <><Plus size={16} /> Tambah Kategori</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
