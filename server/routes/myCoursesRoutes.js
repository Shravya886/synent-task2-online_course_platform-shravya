const express = require("express");
const router = express.Router();

const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

router.get("/:userId", async (req, res) => {

  try {

    const enrollments = await Enrollment.find({ userId: req.params.userId });

    const courseIds = enrollments.map(e => e.courseId);

    const courses = await Course.find({
      _id: { $in: courseIds }
    });

    res.json(courses);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching my courses" });
  }

});

module.exports = router;