const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER

exports.registerUser = async (req, res) => {

    try {

        const {
            name,
            phone,
            mandal,
            village,
            username,
            password
        } = req.body;

        const userExists = await User.findOne({
            username
        });

        if (userExists) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password,10);

        const user = await User.create({

            name,

            phone,

            mandal,

            village,

            username,

            password:hashedPassword

        });

        res.status(201).json({

            success:true,

            message:"Registration Successful",

            user

        });

    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

};


// LOGIN

exports.loginUser = async(req,res)=>{

try{

const {

username,

password

}=req.body;

const user=

await User.findOne({

username

});

if(!user){

return res.status(400).json({

message:"User Not Found"

});

}

const match=

await bcrypt.compare(

password,

user.password

);

if(!match){

return res.status(400).json({

message:"Invalid Password"

});

}

const token=

jwt.sign(

{

id:user._id

},

process.env.JWT_SECRET,

{

expiresIn:"7d"

}

);

res.json({

success:true,

token,

user

});

}

catch(err){

res.status(500).json({

message:err.message

});

}

};