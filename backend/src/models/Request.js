const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Jumlah minimal 1'],
        },
        reason: {
            type: String,
            required: [true, 'Alasan permintaan wajib diisi'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'completed'],
            default: 'pending',
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        approvedAt: {
            type: Date,
            default: null,
        },
        rejectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        rejectedAt: {
            type: Date,
            default: null,
        },
        rejectReason: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Generate request code before save
requestSchema.pre('save', async function (next) {
    if (!this.code) {
        const year = new Date().getFullYear();
        const count = await this.constructor.countDocuments({
            createdAt: {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1),
            },
        });
        this.code = `REQ-${year}-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Request', requestSchema);
