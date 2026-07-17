const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerUser = async (req, res) => {
    try {
        const { name, phone, mandal, village, username, password } = req.body;

        if (!name || !phone || !mandal || !village || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            phone,
            mandal,
            village,
            username,
            password: hashedPassword
        });

        const userResponse = user.toObject();
        delete userResponse.password; // Do not send password back

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

        const user = await User.findOne({ username });
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