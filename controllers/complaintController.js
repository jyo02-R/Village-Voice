const Complaint = require("../models/Complaint");

// ===========================
// Submit Complaint
// ===========================

exports.addComplaint = async (req, res) => {

    try {

        const {
            complaintId,
            userId,
            name,
            mandal,
            village,
            category,
            language,
            description
        } = req.body;

        const complaint = await Complaint.create({

            complaintId,

            userId,

            name,

            mandal,

            village,

            category,

            language,

            description,

            image: req.files?.image
                ? req.files.image[0].filename
                : "",

            audio: req.files?.audio
                ? req.files.audio[0].filename
                : "",

            status: "Pending"

        });

        res.status(201).json({

            success: true,

            message: "Complaint Submitted Successfully",

            complaint

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ===========================
// Get My Complaints
// ===========================

exports.getMyComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.find({

            userId: req.params.userId

        }).sort({

            createdAt: -1

        });

        res.json(complaints);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};