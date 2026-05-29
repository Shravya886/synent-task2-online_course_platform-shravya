import { useEffect, useState } from "react";
import axios from "axios";

function Courses() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/courses"
      );

      setCourses(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>Available Courses</h1>

      {courses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            style={{
              border: "2.5px solid #7e299d",
              boxShadow: "0 4px 12px rgba(126, 41, 157, 0.3)",
              padding: "20px",
              marginBottom: "10px",
              borderRadius: "35px"
            }}
          >
            <h2>{course.title}</h2>

            <p>{course.description}</p>

            <h4>₹{course.price}</h4>

          </div>
        ))
      )}

    </div>
  );
}

export default Courses;