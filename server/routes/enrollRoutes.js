const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const { verifyToken } = require("../middleware/authMiddleware");


// =======================
// CHECK ENROLLMENT
// =======================
router.get("/check/:courseId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      userId,
      courseId
    });

    res.json({
      enrolled: !!enrollment
    });

  } catch (err) {
    console.log("CHECK ENROLL ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// =======================
// ENROLL COURSE (SECURE)
// =======================
router.post("/enroll", verifyToken, async (req, res) => {
  try {
    console.log("ENROLL ROUTE HIT");

    const userId = req.user.id;   // 🔥 FROM TOKEN (NOT FRONTEND)
    const { courseId } = req.body;

    const existing = await Enrollment.findOne({
      userId,
      courseId
    });

    if (existing) {
      return res.json({ msg: "Already Enrolled" });
    }

    const enrollment = new Enrollment({
      userId,
      courseId
    });

    await enrollment.save();

    res.json({ msg: "Enrolled Successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Enrollment Error" });
  }
});

module.exports = router;