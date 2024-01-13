const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        default:"user"
    }
});
userSchema.pre("save",async function(next){     
    //before save the password in the db first convert to hesh this is a event

    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token create a function to get token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}



module.exports = mongoose.model("User",userSchema);