const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");


// =======================
// CREATE COURSE (ADMIN)
// =======================
router.post("/add", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: "Error creating course" });
  }
});


// =======================
// GET ALL COURSES (PUBLIC)
// =======================
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching courses" });
  }
});


// =======================
// GET SINGLE COURSE (PUBLIC)
// =======================
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching course" });
  }
});


// =======================
// UPDATE COURSE (ADMIN) ⭐ NEW
// =======================
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.json(updatedCourse);

  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
});


// =======================
// DELETE COURSE (ADMIN)
// =======================
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});


// =======================
// ADD MODULE (ADMIN) ⭐ FIXED SECURITY
// =======================
router.put("/module/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    course.modules.push({
      title: req.body.title,
      lessons: []
    });

    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: "Add module failed" });
  }
});


// =======================
// ADD LESSON (ADMIN) ⭐ FIXED SECURITY
// =======================
router.put("/lesson/:courseId/:moduleIndex", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (!course.modules || course.modules.length === 0) {
      return res.status(400).json({ msg: "No modules in this course" });
    }

    const moduleIndex = Number(req.params.moduleIndex);

    if (moduleIndex < 0 || moduleIndex >= course.modules.length) {
      return res.status(400).json({ msg: "Invalid module index" });
    }

    course.modules[moduleIndex].lessons.push({
      title: req.body.title,
      videoUrl: req.body.videoUrl
    });

    await course.save();

    res.json(course);

  } catch (err) {
    console.log("LESSON ERROR:", err);
    res.status(500).json({ msg: "Add lesson failed" });
  }
});

module.exports = router;