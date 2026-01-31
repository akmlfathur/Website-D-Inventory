const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama wajib diisi'],
            trim: true,
            maxlength: [100, 'Nama maksimal 100 karakter'],
        },
        email: {
            type: String,
            required: [true, 'Email wajib diisi'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid'],
        },
        password: {
            type: String,
            required: [true, 'Password wajib diisi'],
            minlength: [6, 'Password minimal 6 karakter'],
            select: false,
        },
        role: {
            type: String,
            enum: ['super_admin', 'staff', 'employee'],
            default: 'employee',
        },
        department: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        avatar: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Get user initials
userSchema.methods.getInitials = function () {
    return this.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

module.exports = mongoose.model('User', userSchema);
