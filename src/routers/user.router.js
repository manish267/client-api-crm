const { json } = require("body-parser");
const express = require("express");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const router = express.Router();
const { insertUser,getUserByEmail } = require("../model/user/User.model");
const { hashPassword,comparePassword } = require("./../helpers/bcrypt.helper");
const { post } = require("./ticket.router");

router.all("/", (req, res, next) => {
  // console.log(name)
  // res.json({message:"return form user router"});
  next();
});


// Create new user route

router.post("/", async (req, res) => {
  const { password } = req.body;

  try {
    // hash password
    const hashedPass = await hashPassword(password);

    const newUserObj={
        ...req.body,
        password:hashedPass
    }

    const result = await insertUser(newUserObj);
    console.log(result);
    // console.log(req.body);
    res.json({ message: "New user created" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: error.message });
  }
});

// User sign in Router

router.post('/login',async (req,res,next)=>{
  const {email,password}=req.body;
  console.log(req.body);

  // get user with email from db

  // hash our password and compare with the db one

  if(!email || !password){
    return res.json({status:"error",message:"Invalid form submission"})
  }

  const user=await getUserByEmail(email);
  const passwordFromDb=user && user._id ? user.password : null;

  if(!passwordFromDb) return res.json({status:"error",message:"Invalid email or password"});

  const result= await comparePassword(password,passwordFromDb);


  if(!result){
    return res.json({status:"error",message:"Invalid email or password"})
    
  }
  
  const accessJWT=await createAccessJWT(user.email);
  const refreshJWT=await createRefreshJWT(user.email);



  res.json({status:"Success",message:"Login Successfully",accessJWT,refreshJWT})
})

module.exports = router;
