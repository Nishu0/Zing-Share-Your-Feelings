const express=require("express");
const route=express.Router()
const dotenv=require('dotenv')
dotenv.config({path:'config.env'})

const controller=require('../controller/user');
route.post('/register',controller.register)
route.post('/login',controller.login)
route.get('/',controller.home)
route.get('/api/:id/verify/:passtoken',controller.verify)
route.post('/forgot-password',controller.forgot)
route.get('/api/:id/reset-password/:passtoken',controller.reset)
route.post('/api/:id/reset-password/:passtoken',controller.resetpassword)

module.exports=route