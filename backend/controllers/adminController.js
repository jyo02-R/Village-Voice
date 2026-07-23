const Complaint = require("../models/Complaint");
const Sarpanch = require("../models/Sarpanch");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Sarpanch Login
exports.loginSarpanch = async (req, res) => {

    try {

        const { username, password } = req.body;

        const sarpanch = await Sarpanch.findOne({ username });

        if (!sarpanch) {
            return res.status(404).json({
                success:false,
                message:"Sarpanch not found"
            });
        }

        const match = await bcrypt.compare(password, sarpanch.password);

        if (!match) {
            return res.status(401).json({
                success:false,
                message:"Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id:sarpanch._id,
                village:sarpanch.village
            },
            process.env.JWT_SECRET,
            { expiresIn:"7d" }
        );

        res.json({
            success:true,
            token,
            sarpanch
        });

    } catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

};

// Get complaints for this village
exports.getVillageComplaints = async (req,res)=>{

    try{

        const complaints = await Complaint.find({
            village:req.user.village
        });

        res.json({
            success:true,
            complaints
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

};

// Update complaint status
exports.updateComplaintStatus = async(req,res)=>{

    try{

        const complaint = await Complaint.findByIdAndUpdate(

            req.params.id,

            {
                status:req.body.status
            },

            {
                new:true
            }

        );

        res.json({

            success:true,

            complaint

        });

    }catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};
exports.registerSarpanch = async (req, res) => {
    try {

        // Delete old sarpanch accounts (optional)
        await Sarpanch.deleteMany({});

        const sarpanchs = [
            {
                name: "Dathi Sarpanch",
                username: "dathi",
                password: await bcrypt.hash("dathi123", 10),
                mandal: "Kothavalasa",
                village: "Dathi"
            },
            {
                name: "Devarapalli Sarpanch",
                username: "devarapalli",
                password: await bcrypt.hash("devarapalli123", 10),
                mandal: "Kothavalasa",
                village: "Devarapalli"
            },
            {
                name: "Cheedivalasa Sarpanch",
                username: "cheedivalasa",
                password: await bcrypt.hash("cheedivalasa123", 10),
                mandal: "Kothavalasa",
                village: "Cheedivalasa"
            },
            {
                name: "Pedabhimavaram Sarpanch",
                username: "pedabhimavaram",
                password: await bcrypt.hash("pedabhimavaram123", 10),
                mandal: "Kothavalasa",
                village: "Pedabhimavaram"
            },
            {
                name: "Korukonda Sarpanch",
                username: "korukonda",
                password: await bcrypt.hash("korukonda123", 10),
                mandal: "Kothavalasa",
                village: "Korukonda"
            },
            {
                name: "Piridi Sarpanch",
                username: "piridi",
                password: await bcrypt.hash("piridi123", 10),
                mandal: "Bobbili",
                village: "Piridi"
            },
            {
                name: "Bobbili Sarpanch",
                username: "bobbili",
                password: await bcrypt.hash("bobbili123", 10),
                mandal: "Bobbili",
                village: "Bobbili"
            }
        ];

        await Sarpanch.insertMany(sarpanchs);

        res.status(201).json({
            success: true,
            message: "All Sarpanch accounts created successfully."
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Change Sarpanch Password
exports.changeSarpanchPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Both current and new passwords are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters long" });
        }

        const sarpanchId = req.admin?._id || req.user?._id;
        const sarpanch = await Sarpanch.findById(sarpanchId);

        if (!sarpanch) {
            return res.status(404).json({ success: false, message: "Sarpanch not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, sarpanch.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password" });
        }

        // Update password (pre-save hook hashes it automatically)
        sarpanch.password = newPassword;
        await sarpanch.save();

        res.json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};