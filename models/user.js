const mongoose=require('mongoose')
const bcrypt=require("bcryptjs")
var userSchema=new mongoose.Schema({
	name:{
		type:String
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true,
		minLength:8
	},
	verified:{
        type: Boolean,
        required: true,
        default: false
    }
});


const OwnUser=mongoose.model('usersData',userSchema)
module.exports=OwnUser




