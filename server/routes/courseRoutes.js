const express = require("express");
const router = express.Router();
const Course = require("../models/Course");


// =======================
// CREATE COURSE (ADMIN)
// =======================
router.post("/add", async (req, res) => {

  try {

    const { title, description, price, modules } = req.body;

    const course = new Course({
      title,
      description,
      price,
      modules
    });

    await course.save();

    res.json({
      msg: "Course created successfully",
      course
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Error creating course"
    });

  }

});


router.get("/seed", async (req, res) => {

  try {

    const courses = [

      {
        title: "Web Development",

        description: "Complete Web Development Bootcamp",

        price: 799,

        modules: [

          {
            title: "HTML",

            lessons: [

              {
                title: "HTML Introduction",

                videoUrl:
                  "https://www.youtube.com/watch?v=qz0aGYrrlhU"
              },

              {
                title: "HTML Forms",

                videoUrl:
                  "https://www.youtube.com/watch?v=fNcJuPIZ2WE"
              }

            ]
          },

          {
            title: "CSS",

            lessons: [

              {
                title: "CSS Basics",

                videoUrl:
                  "https://www.youtube.com/watch?v=yfoY53QXEnI"
              }

            ]
          }

        ]

      },

      {
        title: "React Basics",

        description: "Learn React from scratch",

        price: 499,

        modules: [

          {
            title: "React Intro",

            lessons: [

              {
                title: "What is React?",

                videoUrl:
                  "https://www.youtube.com/watch?v=bMknfKXIFA8"
              }

            ]
          }

        ]

      },

      {
        title: "Node.js Mastery",

        description: "Backend Development with Node.js",

        price: 699,

        modules: [

          {
            title: "Node Basics",

            lessons: [

              {
                title: "Intro to Node",

                videoUrl:
                  "https://www.youtube.com/watch?v=TlB_eWDSMt4"
              }

            ]
          }

        ]

      },

      {
        title: "Python Programming",

        description: "Python for Beginners",

        price: 599,

        modules: [

          {
            title: "Python Basics",

            lessons: [

              {
                title: "Python Introduction",

                videoUrl:
                  "https://www.youtube.com/watch?v=_uQrJ0TkZlc"
              }

            ]
          }

        ]

      },

      {
        title: "Java Programming",

        description: "Core Java Complete Course",

        price: 649,

        modules: [

          {
            title: "Java Basics",

            lessons: [

              {
                title: "Java Introduction",

                videoUrl:
                  "https://www.youtube.com/watch?v=BGTx91t8q50"
              }

            ]
          }

        ]

      },

      {
        title: "DSA Course",

        description: "Master Data Structures & Algorithms",

        price: 999,

        modules: [

          {
            title: "Arrays",

            lessons: [

              {
                title: "Introduction to Arrays",

                videoUrl:
                  "https://www.youtube.com/watch?v=8hly31xKli0"
              }

            ]
          }

        ]

      },

      {
        title: "MongoDB Course",

        description: "Learn MongoDB Database",

        price: 549,

        modules: [

          {
            title: "MongoDB Basics",

            lessons: [

              {
                title: "MongoDB Intro",

                videoUrl:
                  "https://www.youtube.com/watch?v=ExcRbA7fy_A"
              }

            ]
          }

        ]

      },

      {
        title: "Machine Learning",

        description: "ML for Beginners",

        price: 1299,

        modules: [

          {
            title: "ML Introduction",

            lessons: [

              {
                title: "What is Machine Learning?",

                videoUrl:
                  "https://www.youtube.com/watch?v=GwIo3gDZCVQ"
              }

            ]
          }

        ]

      }

    ];

    await Course.insertMany(courses);

    res.json({
      msg: "All courses added successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Seed failed"
    });

  }

});
// =======================
// GET ALL COURSES
// =======================
router.get("/", async (req, res) => {

  try {

    const courses = await Course.find();

    res.json(courses);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Error fetching courses"
    });

  }

});


// =======================
// GET SINGLE COURSE
// =======================
router.get("/:id", async (req, res) => {

  try {

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        msg: "Course not found"
      });
    }

    res.json(course);

  } catch (err) {

    console.log("COURSE ERROR:", err.message);

    res.status(500).json({
      msg: "Error fetching course"
    });

  }

});


// =======================
// DELETE COURSE
// =======================
router.delete("/:id", async (req, res) => {

  try {

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      msg: "Course deleted"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Delete failed"
    });

  }

});


// =======================
// UPDATE COURSE
// =======================
router.put("/:id", async (req, res) => {

  try {

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Update failed"
    });

  }

});

module.exports = router;