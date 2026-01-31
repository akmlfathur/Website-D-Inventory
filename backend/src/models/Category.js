const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama kategori wajib diisi'],
            unique: true,
            trim: true,
            maxlength: [50, 'Nama kategori maksimal 50 karakter'],
        },
        description: {
            type: String,
            default: '',
            maxlength: [200, 'Deskripsi maksimal 200 karakter'],
        },
        icon: {
            type: String,
            default: '📦',
        },
        color: {
            type: String,
            default: '#6366F1',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for item count
categorySchema.virtual('itemCount', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'category',
    count: true,
});

module.exports = mongoose.model('Category', categorySchema);
