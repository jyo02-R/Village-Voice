const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dns = require("dns");
require("dotenv").config();

// Override DNS servers to Google DNS to fix querySrv ECONNREFUSED on Windows
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { registerUser, loginUser } = require("./controllers/authController");
const adminRoutes = require("./routes/adminRoutes"); // <-- ADD THIS
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads/images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads/images/voice")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));

// User Routes
app.post("/api/users/register", registerUser);
app.post("/api/users/login", loginUser);

// Admin Routes
app.use("/api/admin", adminRoutes); // <-- ADD THIS

// Complaint Routes
app.use("/api/complaints", complaintRoutes);

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/userAuthDB";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB Database successfully");
        app.listen(PORT, () =>
            console.log(`Backend Server is running on port ${PORT}`)
        );
    })
    .catch(err => console.error("Database connection error:", err));