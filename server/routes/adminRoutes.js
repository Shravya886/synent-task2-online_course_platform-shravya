const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");


// =======================
// USERS (ADMIN ONLY)
// =======================
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});


// =======================
// CREATE COURSE
// =======================
router.post("/course", verifyToken, verifyAdmin, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json(course);
});


// =======================
// GET COURSES
// =======================
router.get("/courses", verifyToken, verifyAdmin, async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});


// =======================
// DELETE COURSE
// =======================
router.delete("/course/:id", verifyToken, verifyAdmin, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});


// =======================
// ENROLLMENTS (ADMIN ONLY)
// =======================
router.get("/enrollments", verifyToken, verifyAdmin, async (req, res) => {
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