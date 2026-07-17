const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const sarpanchSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    mandal: {
        type: String,
        required: true
    },

    village: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
);

sarpanchSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();

});

module.exports = mongoose.model("Sarpanch", sarpanchSchema);