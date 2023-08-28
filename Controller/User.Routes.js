const express = require("express");
const bcrypt = require("bcrypt");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Model/User.Model");

userRouter.post("/signup", async (req, res) => {
  const { name, email, mobile, password, designation } = req.body;

  try {
    const existingUser = await UserModel.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ error: "User Already Exist Cannot Register" });
    }

    const hashed = await bcrypt.hash(password, 5);

    const User = new UserModel({
      name,
      email,
      password: hashed,
      mobile,
      designation,
    });

    await User.save();

    return res.status(200).json({ message: "The new user has been registered" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const user = await UserModel.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ error: "User Not Found Please Register" });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ userID: user._id, user: user.name }, "lokendra", {
          expiresIn: "1d",
        });
        const refreshToken = jwt.sign({ userID: user._id, user: user.name }, "lokendra", {
          expiresIn: "1d",
        });

        return res.status(200).json({ message: "Login Successful", token, refreshToken });
      } else {
        return res.status(400).json({ message: "Wrong Crediential" });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Something Went Wrong" });
  }
});

module.exports = {
  userRouter,
};
