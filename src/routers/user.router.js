const express = require("express");
const router = express.Router();
const { insertUser } = require("../model/user/User.model");
const { hashPassword } = require("./../helpers/bcrypt.helper");

router.all("/", (req, res, next) => {
  // console.log(name)
  // res.json({message:"return form user router"});
  next();
});

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

module.exports = router;
