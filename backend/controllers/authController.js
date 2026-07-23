const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Configure SMTP transport using environment variables
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Helper function to send welcome email
const sendWelcomeEmail = async (email, name) => {
    // Development fallback if environment variables are not set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`\n==================================================`);
        console.log(`[Development Mail Fallback] Sending email to ${email}:`);
        console.log(`Subject: Welcome to Village Voice, ${name}!`);
        console.log(`Message: Thank you for registering on Village Voice. Your account is active.`);
        console.log(`==================================================\n`);
        return;
    }

    const mailOptions = {
        from: `"Village Voice" <${process.env.EMAIL_USER}>`,
        to: email.trim(),
        subject: `Welcome to Village Voice, ${name}!`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px; max-width: 600px;">
                <h2 style="color: #4A90E2;">Welcome to Village Voice!</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Thank you for registering on the Village Voice portal. Your account has been successfully created.</p>
                <p>You can now log in, submit complaints, and track their progress from your dashboard.</p>
                <br/>
                <p>Best regards,</p>
                <p><strong>Village Voice Team</strong></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Welcome email successfully sent to ${email}`);
    } catch (error) {
        console.error(`❌ Failed to send welcome email to ${email}:`, error.message);
    }
};

// REGISTER
exports.registerUser = async (req, res) => {
    try {
        const { name, phone, email, mandal, village, username, password } = req.body;

        // 1. Basic validation (presence of all fields)
        if (!name || !phone || !email || !mandal || !village || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Strict Input Formats
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name.trim())) {
            return res.status(400).json({ message: "Name must contain only letters and spaces" });
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone.trim())) {
            return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        const normalizedUsername = username.trim().toLowerCase();
        if (!usernameRegex.test(normalizedUsername) || normalizedUsername.length < 4) {
            return res.status(400).json({ message: "Username must be at least 4 characters and contain only letters, numbers, or underscores (no spaces)" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // 3. Check duplicate username or email
        const usernameExists = await User.findOne({ username: normalizedUsername });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const emailExists = await User.findOne({ email: email.trim().toLowerCase() });
        if (emailExists) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // 4. Create User
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            mandal: mandal.trim(),
            village: village.trim(),
            username: normalizedUsername,
            password: hashedPassword
        });

        // 5. Send welcome email asynchronously
        sendWelcomeEmail(user.email, user.name);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            user: userResponse
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// LOGIN
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const normalizedUsername = username.trim().toLowerCase();
        const user = await User.findOne({ username: normalizedUsername });
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "supersecretkey123",
            { expiresIn: "7d" }
        );

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            success: true,
            token,
            user: userResponse
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};