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
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://10.148.101.197:5000/api/mycourses/${userId}`
      );

      const coursesData = res.data || [];
      setCourses(coursesData);

      // OPTIMIZED: parallel requests
      const progressPromises = coursesData.map(async (course) => {
        try {
          const progressRes = await axios.get(
            `http://10.148.101.197:5000/api/progress/${userId}/${course._id}`
          );

          return {
            courseId: course._id,
            count: progressRes.data?.completedLessons?.length || 0
          };
        } catch (err) {
          return {
            courseId: course._id,
            count: 0
          };
        }
      });

      const results = await Promise.all(progressPromises);

      const progressData = {};
      results.forEach((p) => {
        progressData[p.courseId] = p.count;
      });

      setProgressMap(progressData);

    } catch (err) {
      console.log("Error fetching my courses:", err);
    }

    setLoading(false);
  };

  // SAFE TOTAL LESSONS
  const getTotalLessons = (course) => {
    if (!course?.modules) return 0;

    let total = 0;

    course.modules.forEach((module) => {
      total += module?.lessons?.length || 0;
    });

    return total;
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="form-container" style={{ width: "80%" }}>
      <h2>My Courses</h2>

      {courses.length > 0 ? (
        courses.map((course) => {
          const total = getTotalLessons(course);
          const completed = progressMap[course._id] || 0;

          const progress =
            total === 0 ? 0 : Math.round((completed / total) * 100);

          return (
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

              <p>
                Progress: {progress}%
              </p>
            </div>
          );
        })
      ) : (
        <p>No enrolled courses yet</p>
      )}
    </div>
  );
}

export default MyCourses;