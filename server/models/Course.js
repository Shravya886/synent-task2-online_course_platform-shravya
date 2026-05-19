const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  videoUrl: {
    type: String,
    required: true
  }

});

const ModuleSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  lessons: [LessonSchema]

});

const CourseSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  modules: [ModuleSchema]

});

module.exports = mongoose.model("Course", CourseSchema);