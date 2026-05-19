const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
router.get("/check/:userId/:courseId", async (req, res) => {
  try {
    const { userId, courseId } = req.params;

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
router.post("/enroll", async (req, res) => {

  try {

    console.log("ENROLL ROUTE HIT");

    const { userId, courseId } = req.body;

    const existing = await Enrollment.findOne({ userId, courseId });

    if (existing) {
      return res.json({ msg: "Already Enrolled" });
    }

    const enrollment = new Enrollment({
      userId,
      courseId
    });

    await enrollment.save();   // 🔥 THIS WAS MISSING

    res.json({ msg: "Enrolled Successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Enrollment Error" });
  }

});

module.exports = router;