const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama barang wajib diisi'],
            trim: true,
            maxlength: [200, 'Nama barang maksimal 200 karakter'],
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Kategori wajib diisi'],
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            required: [true, 'Lokasi wajib diisi'],
        },
        type: {
            type: String,
            enum: ['asset', 'consumable'],
            default: 'consumable',
        },
        stock: {
            type: Number,
            default: 0,
            min: [0, 'Stok tidak boleh negatif'],
        },
        minStock: {
            type: Number,
            default: 0,
            min: [0, 'Minimum stok tidak boleh negatif'],
        },
        unit: {
            type: String,
            default: 'pcs',
        },
        price: {
            type: Number,
            default: 0,
        },
        supplier: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: '',
        },
        specifications: {
            type: Map,
            of: String,
            default: {},
        },
        images: [{
            type: String,
        }],
        qrCode: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for status
itemSchema.virtual('status').get(function () {
    if (this.stock <= 0) return 'out_of_stock';
    if (this.stock <= this.minStock) return 'low';
    return 'available';
});

// Generate SKU before save
itemSchema.pre('save', async function (next) {
    if (!this.sku) {
        const category = await mongoose.model('Category').findById(this.category);
        const prefix = category ? category.name.substring(0, 3).toUpperCase() : 'ITM';
        const count = await this.constructor.countDocuments();
        this.sku = `${prefix}-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

// Index for search
itemSchema.index({ name: 'text', sku: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);
