const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        match: [/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"]
    },
    phone: { 
        type: String, 
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    mandal: { type: String, required: true, trim: true },
    village: { type: String, required: true, trim: true },
    username: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 4,
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
    },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);