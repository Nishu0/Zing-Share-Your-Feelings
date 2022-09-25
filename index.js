const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Post = require("./models/post");
app.use(express.json());

const session = require("express-session");
const User=require("./models/user")
const connectDB=require("./db/connection");
const dotenv=require('dotenv')
const bcrypt=require("bcryptjs");
dotenv.config({path:'config.env'})
const PORT=process.env.PORT || 8000
const userRoutes=require('./routes/Ruser')
const jwt=require('jsonwebtoken')
const passport=require('passport')
const passportjwt=require('./auth/passport_jwt')
const nodemailer = require('nodemailer');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

//db connection
connectDB();
/*
mongoose
  .connect("mongodb://localhost:27017/forumApp", { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo connection is open!");
  })
  .catch((err) => {
    console.log("Mongo connection error!");
    console.log(err);
  });*/

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use('/public', express.static(path.join(__dirname, '/public')));
const categories = ["Anger", "Sadness", "Hope", "Happy"];

app.use(
    session({
        secret: "safasfcgxgbcvdf124!",
        resave: false,
        saveUninitialized: true
    })
);

app.use(express.urlencoded({ extended: false }));

// Set up Passport
app.use(passport.initialize());
app.use(passport.session());

//passport.use(User.createStrategy());
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

//User Information
app.post('/register',userRoutes)
app.post('/login',userRoutes)

//Mail
app.post('/forgot-password',userRoutes)
app.get('/api/:id/verify/:passtoken',userRoutes)
app.get('/api/:id/reset-password/:passtoken',userRoutes)
app.post('/api/:id/reset-password/:passtoken',userRoutes)


app.get("/", (req, res) => {
  res.render("login", { name: "Home Page" });
});
app.get("/login", (req, res) => {
  res.render("login", { name: "Login Page" });
});
app.get("/register", (req, res) => {
  res.render("register");
  //res.redirect("/posts");
});
app.get("/forgot-password",(req,res)=>{
  res.render("forgot-password",{name : "Reset-Password"});
})

app.get("/posts", async (req, res) => {
  const { category } = req.query;
  if (category && category !== "All") {
    const posts = await Post.find({ category });
    res.render("posts/index", { posts, name: "Posts", category, categories });
  } else {
    const posts = await Post.find({});
    res.render("posts/index", {
      posts,
      name: "Posts",
      category: "All",
      categories,
    });
  }
});

app.get("/posts/new", (req, res) => {
  res.render("posts/new", { name: "Add New", categories });
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render("posts/show", { name: "Post", post });
});

app.get("/posts/:id/edit", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render("posts/edit", { name: "Edit", post, categories });
});

app.post("/posts", async (req, res) => {
  const { title, username, post, photo, category } = req.body;
  const newPost = new Post({ username, title, post, photo, category });
  await newPost.save();
  res.redirect(`/posts/${newPost._id}`);
});

app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/posts/${post._id}`);
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.redirect("/posts");
});

// app.get("/search", (req, res) => {
//   const { q } = req.query;
//   if (!q) {
//     res.send("nothing found if nothing searched");
//   }
//   console.log(q);
//   res.send(`<h1>Search results for ${q}</h1>`);
// });

app.get("*", (req, res) => {
  res.render("notfound", { name: "Not Found" });
});

app.listen(PORT,()=>{
  console.log(`The port is at ${PORT}`)
});
