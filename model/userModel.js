const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin:{
        type:Boolean,
        default:false   
    }
}, { timestamps: true }); 

userSchema.pre("save", async function(next) {   
    try {
        if (this.isModified("password")) { 
            const salt = await bcrypt.genSalt(10); 
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("users", userSchema);
