#!/usr/bin/env node

/* user auth router */

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { JWT_SECRET_KEY, CLIENT_URL } = require("../config/config");
const Token = require("../models/Token");
const User = require("../models/User");
const sendEmail = require("../services/sendEmail.service");

const authRouter = require("express").Router();

// signup functionality
authRouter.post("/register", async (req, resp, next) => {
  const { username, password, name, email } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const userExists = await User.exists({ email });
  if (userExists) {
    return resp.status(409).json({ error: `Email ${email} is already taken` });
  }
  try {
    const newUser = new User({
      username,
      name,
      email,
      passwordHash,
    });
    await newUser.save();
    const id = newUser._id;

    const token = crypto.randomBytes(32).toString("hex");
    const url = `${CLIENT_URL}auth/verify/${id}?token=${token}`;

    const data = {
      name: name,
      link: url,
    };
    const hashedToken = await bcrypt.hash(token, 10);
    await new Token({
      userId: newUser._id,
      action: "verify",
      token: hashedToken,
    }).save();

    await sendEmail(email, "Confirm your account", "register", data);
    return resp.status(201).json({
      status: "success",
      message: "new user created",
      user: newUser,
    });
  } catch (error) {
    return next(error);
  }
});

// verify account functionality

authRouter.get("/verify/:id", async (req, resp, next) => {
  try {
    const { id } = req.params;
    const token = req.query.token;
    const user = await User.findById(id);
    console.log(req);
    const hashedVerifyToken = await Token.findOne({
      userId: id,
      action: "verify",
    });
    if (user === null || hashedVerifyToken === null) {
      return resp
        .status(403)
        .json({ error: "cannot verify account at this time" });
    }

    // console.log(hashedVerifyToken);
    const validVerifyToken = await bcrypt.compare(
      token,
      hashedVerifyToken.token
    );
    // account is valid
    if (validVerifyToken) {
      await User.updateOne(
        { _id: id },
        { $set: { verified: true } },
        { new: true }
      );

      await hashedVerifyToken.deleteOne();
      return resp.json({ status: "success", message: "user is verified" });
    }
  } catch (error) {
    next(error);
  }
});
// login functionality
authRouter.post("/login", async (req, resp, next) => {
  const { username, password } = req.body;
  if (!username && !password) {
    return resp.status(400).json({ error: "provide a username and password" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return resp
        .status(403)
        .json({ error: "user with not found with that username" });
    }
    const correctCredentials = await bcrypt.compare(
      password,
      user.passwordHash
    );
    if (correctCredentials) {
      const userToSerialize = {
        userName: user.username,
        userId: user._id,
        userEmail: user.email,
        name: user.name,
      };
      const token = jsonwebtoken.sign(userToSerialize, JWT_SECRET_KEY, {
        expiresIn: 60 * 60,
      });
      return resp.json({
        accessToken: token,
        username: user.username,
        name: user.username,
      });
    }
    // password provided did not match password hash
    return resp.status(403).json({ error: "Invalid username or password" });
  } catch (error) {
    next(error);
  }
});

// forgot password functionality
authRouter.post("/forgot", async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "No email provided" });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });
  const token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = await bcrypt.hash(resetToken, 10);

  await new Token({
    userId: user._id,
    token: resetTokenHash,
    createdAt: Date.now(),
  }).save();

  const link = `${CLIENT_URL}/reset?token${resetToken}`;
  // send the reset link to user.email
  return res.json({
    status: "sucess",
    link,
    token: resetToken,
  });
});

// password reset flow
authRouter.post("/reset/:id", async (req, resp, next) => {
  const { id } = req.params;
  const token = req.query.token;
  const { password } = req.body;

  if (!id || !token) return resp.status(400).json({ error: "bad request" });
  const user = await User.findById(id);
  if (!user) {
    return resp.status(403).json({ error: "password reset failed" });
  }
  const userResetToken = await Token.findOne({ userId: id });
  if (!userResetToken) {
    return resp
      .status(401)
      .json({ error: "cannot reset password for this user" });
  }

  // compare reset token stored with the one passed as a query param
  const validToken = bcrypt.compare(token, userResetToken.token);
  if (!validToken) {
    return resp.status(403).json({ error: "Invalid or expired reset token" });
  }
  const passwordHash = await bcrypt.hash(password, 10);

  await User.updateOne({ _id: id }, { $set: { passwordHash } }, { new: true });

  await userResetToken.deleteOne();

  const newUser = await User.findById(id);
  return resp.json({ message: "password reset", user: newUser });
});

module.exports = authRouter;
