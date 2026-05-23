const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Course = require("../models/Course");

const Enrollment = require("../models/Enrollment");

// =======================
// RAZORPAY INSTANCE
// =======================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});
// =======================
// CREATE ORDER
// =======================
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);

  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json({ msg: "Payment Order Error" });
  }
});


// =======================
// VERIFY PAYMENT + ENROLL
// =======================
router.post("/verify", async (req, res) => {
  try {
    console.log("VERIFY BODY:", req.body);

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
      courseId
    } = req.body;

    // 1. CREATE SIGNATURE
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    // 2. VERIFY PAYMENT
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: "Invalid signature" });
    }

    // 3. CHECK IF ALREADY ENROLLED
    const existing = await Enrollment.findOne({ userId, courseId });

    if (existing) {
      return res.json({ msg: "Already Enrolled" });
    }

    // 4. CREATE ENROLLMENT
    const enrollment = new Enrollment({
      userId,
      courseId,
      paymentId: razorpay_payment_id,
      status: "enrolled"
    });

    await enrollment.save();

    const user = await User.findById(userId);
const course = await Course.findById(courseId);

await transporter.sendMail({
  from: process.env.EMAIL,
  to: user.email,
  subject: "🎉 Enrollment Successful",
  text: `Hi ${user.name},\n\nYou are enrolled in ${course.title}.\nStart learning now!`
});

    // 5. RESPONSE
    return res.json({
      msg: "Payment verified & enrolled successfully",
      enrollment
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({ msg: "Verification Error" });
  }
});

module.exports = router;