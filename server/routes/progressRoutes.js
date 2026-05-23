const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

// MARK LESSON COMPLETE
router.post("/complete", async (req, res) => {

  try {

    const { userId, courseId, lessonTitle } = req.body;

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({
        userId,
        courseId,
        completedLessons: []
      });
    }

    if (!progress.completedLessons.includes(lessonTitle)) {
      progress.completedLessons.push(lessonTitle);
    }

    await progress.save();

    res.json({ msg: "Progress updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error updating progress" });
  }

});

router.get("/:userId/:courseId", async (req, res) => {

  try {

    const { userId, courseId } = req.params;

    const progress = await Progress.findOne({
      userId,
      courseId
    });

    if (!progress) {

      return res.json({
        completedLessons: []
      });

    }

    res.json(progress);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Error fetching progress"
    });

  }

});

module.exports = router;