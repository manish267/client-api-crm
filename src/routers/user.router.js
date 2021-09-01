const { json } = require("body-parser");
const express = require("express");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  storeUserRefreshJWT
} = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("./../helpers/bcrypt.helper");
const {
  userAuthorization, 
} = require("./../middlewares/authorization.middleware");
const {
  setPasswordResetPin,
  getPinByEmailPin, 
  deletePin,
} = require("../model/resetPin/ResetPin.model");
const { emailProcessor } = require("../helpers/email.helper");
const {
  resetPassReqValidation,
  updatePassValidation,
} = require("../middlewares/formValidation.middleware");
const {deleteJWT}=require('./../helpers/redis.helper')

router.all("/", (req, res, next) => {
  // console.log(name)
  // res.json({message:"return form user router"});
  next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  // this data is coming from databases
  const _id = req.userId;
  const userProf = await getUserById(_id);

  res.json({ user: userProf });
});

// Create new user route
router.post("/", async (req, res) => {
  const { password } = req.body;

  try {
    // hash password
    const hashedPass = await hashPassword(password);

    const newUserObj = {
      ...req.body,
      password: hashedPass,
    };

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

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  // get user with email from db

  // hash our password and compare with the db one

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid form submission" });
  }

  const user = await getUserByEmail(email);
  const passwordFromDb = user && user._id ? user.password : null;

  if (!passwordFromDb)
    return res.json({ status: "error", message: "Invalid email or password" });

  const result = await comparePassword(password, passwordFromDb);

  if (!result) {
    return res.json({ status: "error", message: "Invalid email or password" });
  }

  const accessJWT = await createAccessJWT(user.email, `${user._id}`);
  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

  res.json({
    status: "Success",
    message: "Login Successfully",
    accessJWT,
    refreshJWT,
  });
});

// A. Create and send password reset pin number
// 1.receive email
// 2. check if user exist
// 3.create 6 digit pin
// 4.save pin and email in database

//C. server side form validation
// 1.create middleware to validate form data

router.post("/reset-password", resetPassReqValidation, async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (user && user._id) {
    // create unique 6 digit pin
    const setPin = await setPasswordResetPin(email);
    const result = await emailProcessor(
      email,
      setPin.pin,
      "request-new-password"
    );

    return res.json({
      status: "success",
      message:
        "If the email is exist in our database ,the password reset pin will be send shortly",
    });
  }

  res.json({
    status: "error",
    message:
      "If the email is exist in our database ,the password reset pin will be send shortly",
  });
});

// B. update password in DB
// 1.receive email,pin and new password
// 2.validate pin
// 3.encrypt new password
// 4.update password in db
// 5.send email notification

router.patch(
  "/reset-password",
  updatePassValidation,
  async (req, res, next) => {
    const { email, pin, newPassword } = req.body;

    const getPin = await getPinByEmailPin(email, pin);

    if (getPin._id) {
      const dbDate = getPin.addedAt;
      const expiresIn = 1;
      let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

      const today = new Date();
      if (today > expDate) {
        return res.json({ status: "error", message: "invalid or expired pin" });
      }
      // encrypt the new password
      const hashedPass = await hashPassword(newPassword);

      const user = await updatePassword(email, hashedPass);
      if (user._id) {
        // 5.send email notification
        await emailProcessor(email, "", "passwrod-update-success");
        // delete pin from db
        deletePin(email, pin);
        return res.json({
          status: "success",
          message: "Your password has been updated",
        });
      }
      res.json({
        status: "error",
        message: "Unable to update your password .plz try again later",
      });
    }

    res.json(getPin);
  }
);

// User logout and invalidate jwts

router.delete('/logout',userAuthorization,async (req,res)=>{
  // 1.get jwt and verify
  const {authorization}=req.headers;
  // this data coming form database;
  const _id=req.userId;
// 2.delete accessJWT from redis database
  deleteJWT(authorization);
// 3.delete refreshJWT from mongodb
const result=await storeUserRefreshJWT(_id,"");
if(result._id){
  return res.json({status:"success",message:"Logged out successfully"})
}
 res.json({status:"error",message:"Unable to log you out,plz try again later"})

})

module.exports = router;
