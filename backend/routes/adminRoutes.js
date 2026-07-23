const express = require("express");
const router = express.Router();

const {
    loginSarpanch,
    registerSarpanch,
    getVillageComplaints,
    updateComplaintStatus,
    changeSarpanchPassword
} = require("../controllers/adminController");

const { protectAdmin } = require("../middleware/auth");

router.post("/login", loginSarpanch);
router.post("/register", registerSarpanch);
router.get("/complaints", protectAdmin, getVillageComplaints);
router.put("/complaints/:id", protectAdmin, updateComplaintStatus);
router.put("/change-password", protectAdmin, changeSarpanchPassword);

module.exports = router;