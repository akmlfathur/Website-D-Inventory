const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['inbound', 'outbound', 'adjustment'],
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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        supplier: {
            type: String,
            default: '',
        },
        invoiceNo: {
            type: String,
            default: '',
        },
        purpose: {
            type: String,
            default: '',
        },
        notes: {
            type: String,
            default: '',
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
        },
    },
    {
        timestamps: true,
    }
);

// Update item stock after transaction
transactionSchema.post('save', async function () {
    const Item = mongoose.model('Item');
    const item = await Item.findById(this.item);

    if (item) {
        if (this.type === 'inbound') {
            item.stock += this.quantity;
        } else if (this.type === 'outbound') {
            item.stock -= this.quantity;
        }
        await item.save();
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);
