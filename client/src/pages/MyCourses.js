import { useEffect, useState } from "react";
import axios from "axios";

function MyCourses() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    fetchMyCourses();
  }, []);

  // FETCH MY COURSES + PROGRESS
  const fetchMyCourses = async () => {

    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.log("No userId found");
      setLoading(false);
      return;
    }

    try {

      // GET ENROLLED COURSES
      const res = await axios.get(
        `http://localhost:5000/api/mycourses/${userId}`
      );

      console.log("MY COURSES:", res.data);

      setCourses(res.data);

      // GET PROGRESS FOR EACH COURSE
      const progressData = {};

      for (let course of res.data) {

        try {

          const progressRes = await axios.get(
            `http://localhost:5000/api/progress/${userId}/${course._id}`
          );

          progressData[course._id] =
            progressRes.data?.completedLessons?.length || 0;

        } catch (err) {

          progressData[course._id] = 0;

        }

      }

      setProgressMap(progressData);

    } catch (err) {

      console.log("Error fetching my courses:", err);

    }

    setLoading(false);
  };

  // COUNT TOTAL LESSONS
  const getTotalLessons = (course) => {

    let total = 0;

    course.modules.forEach(module => {
      total += module.lessons.length;
    });

    return total;
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (

    <div
      className="form-container"
      style={{ width: "80%" }}
    >

      <h2>My Courses</h2>

      {courses && courses.length > 0 ? (

        courses.map((course) => (

          <div
            key={course._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              margin: "15px 0",
              borderRadius: "10px"
            }}
          >

            <h3>{course.title}</h3>

            <p>{course.description}</p>

            <p>₹ {course.price}</p>

            {/* PROGRESS */}
            <p>
              Progress: {

                (() => {

                  const total =
                    getTotalLessons(course);

                  const completed =
                    progressMap[course._id] || 0;

                  return total === 0
                    ? 0
                    : Math.round(
                        (completed / total) * 100
                      );

                })()

              }%
            </p>

          </div>

        ))

      ) : (

        <p>No enrolled courses yet</p>

      )}

    </div>

  );
}

export default MyCourses;