const User=require('../models/user')
const bcrypt=require('bcryptjs')
const dotenv=require('dotenv')
dotenv.config({path:'config.env'})
const nodemailer=require('nodemailer')
const jwt=require('jsonwebtoken')
const verificationToken=require("../models/verification")
const { generateOTP } =  require("../utils/generateOTP")
let jwtSecretKey=process.env.TOKEN_KEY
const sendEmail=require('../utils/mail')



exports.register=async(req,res)=>{
	try{
		const {name,email, password}=req.body;
		if (!email&&name&&password) {
			res.send("All Fields are required")
		}
		const oldUser=await User.findOne({email})
		if(oldUser){
			res.send("User already exists")
		}
		encrytedPassword=await bcrypt.hash(password,10)
		const user=await User.create({
			name,
			email:email.toLowerCase(),
			password: encrytedPassword
		})
		// const OTP=generateOTP();
		// const textoken= await verificationToken.create({
		// 	owner:User._id,
		// 	token:OTP
		// })
		// new verificationToken({
		// owner:User._id,
		// token:OTP
		//})
		//await verificationToken.save();
		let data={
			user_id:user._id
		}
		//const secret=jwtSecretKey+user.password
		const passtoken=jwt.sign(data,jwtSecretKey,{expiresIn:'30m'})
		const url = `http://localhost:3000/api/${user._id}/verify/${passtoken}`
		const html=`Click <a href = '${url}'>here</a> to confirm your email.`
		console.log(email);
		await sendEmail(user.email,"👻Verify Email",html)
		res.redirect('/login')
		//res.send("An email has been sent to verify account")
		//return res.header("auth-token",token).send("Bearer "+token)
		//return res.send("User Created Successfully")
		//res.status(201).json(user);
	}
	catch(err){
		res.redirect('/register')
		console.log(err)
	}
}
exports.verify=async(req,res)=>{
	const {id,passtoken}=req.params
	//console.log(_id)
	//console.log(passtoken)
	const user=await User.findOne({_id:id});
	//console.log(user)
	if(!user){
		res.send("Invalid Token")
	}
	const verifytoken=jwt.verify(passtoken,jwtSecretKey)
	console.log(verifytoken)
	
	await User.findByIdAndUpdate(id,{verified:true})
	res.send(`Email has been verified for email:${user.email}`)

	//console.log(ntoken)
}
exports.login=async(req,res)=>{
	const{email,password}=req.body
	try{
		const user=await User.findOne({email});
		if(!user){
			//res.send('The user is not registered. Pls Sign-up')
		}
		if(user&&(await bcrypt.compare(password,user.password))){
				let data={
					user_id: user._id
				}
				const token = jwt.sign(data,jwtSecretKey);
      			user.token=token;
      			//return res.json({status:'ok',data:token})
      			//return res.header("auth-token",token).send("Bearer "+token)
      			//let url=`http://localhost:8000/verify/${token}`
      			res.redirect('/posts')
      		}
		//res.status(400).send("Invalid Credentials")
		return res.redirect('/posts')
	}
	catch(err){
		//return res.redirect('/login');
		console.log(err)
	}	
}
exports.forgot=async(req,res)=>{
	const {email}=req.body
	const user=await User.findOne({email})
	if(!user){
		res.send("The user does not exists")
	}
	let data={
			user_id:user._id
	}
	const passtoken=jwt.sign(data,jwtSecretKey,{expiresIn:'30m'})
	const url = `http://localhost:3000/api/${user._id}/reset-password/${passtoken}`
	const html=`Click <a href = '${url}'>here</a> to reset your password.`
	console.log(email);
	await sendEmail(user.email,"👻Reset Password",html)
	res.send("Email sent Successfully")
}
exports.reset=async(req,res)=>{
	try{
		const{id,passtoken}=req.params;
		const user=await User.findOne({_id:id})
		if(!user){
			res.send("The user does not exists")
		}
		else if(user){
			res.send(`Enter password and confirm password for ${user.email}`)
		}
	}
	catch(err){
		console.log(err)
	}
}
exports.resetpassword=async(req,res)=>{
	const{id,passtoken}=req.params;
	try{
		const user=await User.findOne({_id:id})
		const{newPassword,confirm}=req.body;
		if(newPassword==confirm){
			const encrytedPassword=await bcrypt.hash(newPassword,10)
			await User.findByIdAndUpdate(id,{password:encrytedPassword})
			res.send("Password Reset Successfully")
		}
		else{
			res.send("Password does not match")
		}
	}
	catch(err){
		console.log(err)
	}
}

exports.home=(req,res)=>{
	res.send("Welcome to home page");
}


