const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({

  userId: String,
  courseId: String,

  completedLessons: [String] // store lesson titles

});

module.exports = mongoose.model("Progress", ProgressSchema);