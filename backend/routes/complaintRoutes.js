const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const {

    addComplaint,

    getMyComplaints

} = require("../controllers/complaintController");

router.post(

    "/",

    upload.fields([

        {
            name: "image",
            maxCount: 1
        },

        {
            name: "audio",
            maxCount: 1
        }

    ]),

    addComplaint

);

router.get(

    "/:userId",

    getMyComplaints

);

module.exports = router;