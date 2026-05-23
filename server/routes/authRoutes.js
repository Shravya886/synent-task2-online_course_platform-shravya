const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


const User = require("../models/User");

const router = express.Router();

/* =========================
   EMAIL TRANSPORTER
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

/* =========================
   GET USERS (ADMIN)
========================= */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching users" });
  }
});

/* =========================
   REGISTER + EMAIL VERIFY
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

     if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      verifyToken,
      verifyExpire: Date.now() + 24 * 60 * 60 * 1000
    });

    await user.save();

    const verifyLink = `http://10.148.101.197:5000/api/auth/verify-email/${verifyToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      text: `Click to verify your account:\n${verifyLink}`
    });

    res.json({ msg: "Registered. Check email to verify account." });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

/* =========================
   VERIFY EMAIL
========================= */
router.get("/verify-email/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      verifyToken: req.params.token,
      verifyExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyExpire = undefined;

    await user.save();

    res.send("Email verified successfully. You can now login.");

  } catch (err) {
    console.log(err);
    res.status(500).send("Verification failed");
  }
});

/* =========================
   RESEND VERIFICATION
========================= */
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ msg: "Already verified" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.verifyToken = token;
    user.verifyExpire = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

const FRONTEND_URL = "http://10.148.101.197:3000";

const verifyLink = `${FRONTEND_URL}/verify-email/${verifyToken}`;
    await transporter.sendMail({
      to: email,
      subject: "Verify Email Again",
      text: `Click to verify:\n${link}`
    });

    res.json({ msg: "Verification email sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error sending email" });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email/Password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        msg: "Please verify your email before login"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* =========================
   FORGOT PASSWORD
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetExpire = Date.now() + 3600000;

    await user.save();

    const FRONTEND_URL = "http://10.148.101.197:3000";
    const link = `${FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      text: `Reset password:\n${link}`
    });

    res.json({ msg: "Reset link sent to email" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Email failed" });
  }
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetToken = undefined;
    user.resetExpire = undefined;

    await user.save();

    res.json({ msg: "Password updated successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Reset failed" });
  }
});

/* =========================
   TEST EMAIL
========================= */
router.get("/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Test Email",
      text: "Working fine"
    });

    res.send("EMAIL SENT");
  } catch (err) {
    console.log(err);
    res.status(500).send("FAILED");
  }
});

router.get("/make-admin-setup", async (req, res) => {
  const email = "yourmail@gmail.com"; // change this

  await User.findOneAndUpdate(
    { email },
    { role: "admin" }
  );

  res.json({ msg: "Admin created" });
});


router.get("/enrollments", async (req, res) => {
  try {

    const enrollments = await Enrollment.find()
      .populate("userId", "name email")
      .populate("courseId", "title");

    res.json(enrollments);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Error fetching enrollments"
    });
  }
});

module.exports = router;