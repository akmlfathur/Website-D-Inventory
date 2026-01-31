const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama lokasi wajib diisi'],
            trim: true,
            maxlength: [100, 'Nama lokasi maksimal 100 karakter'],
        },
        type: {
            type: String,
            enum: ['building', 'warehouse', 'room', 'rack', 'shelf'],
            default: 'room',
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            default: null,
        },
        description: {
            type: String,
            default: '',
        },
        code: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for children
locationSchema.virtual('children', {
    ref: 'Location',
    localField: '_id',
    foreignField: 'parent',
});

// Virtual for item count
locationSchema.virtual('itemCount', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'location',
    count: true,
});

// Generate code before save
locationSchema.pre('save', async function (next) {
    if (!this.code) {
        const prefix = this.type.substring(0, 3).toUpperCase();
        const count = await this.constructor.countDocuments({ type: this.type });
        this.code = `${prefix}-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Location', locationSchema);
