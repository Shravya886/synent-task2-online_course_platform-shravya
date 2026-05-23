import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [accessMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchCourses();
    fetchEnrolled();

  }, []);

  // REMOVE DUPLICATE COURSES
  const uniqueCourses = Array.from(
    new Map(
      courses.map(c => [c.title, c])
    ).values()
  );

  // FETCH ENROLLED COURSES
  const fetchEnrolled = async () => {

    try {

      const userId = localStorage.getItem("userId");

      const res = await axios.get(
        `http://10.148.101.197:5000/api/mycourses/${userId}`
      );

      setEnrolledCourses(
        res.data.map(c => c._id)
      );

    } catch (err) {

      console.log(err);

    }

  };

  // FETCH COURSES
  const fetchCourses = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "http://10.148.101.197:5000/api/courses"
      );

      setCourses(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  // ENROLL COURSE
  const enrollCourse = async (courseId) => {

    try {

      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      await axios.post(
        "http://10.148.101.197:5000/api/enroll/enroll",
        { userId, courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchEnrolled();

    } catch (err) {

      console.log(err);

    }

  };

  // PAYMENT
  const handlePayment = async (course) => {

    try {

      const res = await axios.post(
        "http://10.148.101.197:5000/api/payment/create-order",
        { amount: course.price }
      );

      const order = res.data;

      const options = {

        key: "rzp_test_SqtJiX2upn8qvY",

        amount: order.amount,

        currency: order.currency,

        name: "Online Course Platform",

        description: course.title,

        order_id: order.id,
handler: async function (response) {
  try {
    await axios.post(
      "http://10.148.101.197:5000/api/payment/verify",
      {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        courseId: course._id,
        userId: localStorage.getItem("userId")
      }
    );

    alert("Payment Verified & Enrolled 🎉");

    fetchEnrolled(); // just refresh UI

  } catch (err) {
    console.log(err);
  }
}
      };

      const rzp = new window.Razorpay(options);

      rzp.open();

    } catch (err) {

      console.log(err);

    }

  };

  // SEARCH FILTER
  const filteredCourses = uniqueCourses.filter(course =>
    course.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (

    <div
      className="form-container"
      style={{
        width: "80%",
        margin: "auto",
        padding: "20px"
      }}
    >

      <h2>Dashboard</h2>

      {/* TOP BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px"
        }}
      >

        <button onClick={() => {

          localStorage.removeItem("token");
          localStorage.removeItem("userId");

          navigate("/login");

        }}>
          Logout
        </button>

        <button onClick={() => navigate("/mycourses")}>
          My Courses
        </button>

      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <h3>Available Courses</h3>

      {/* LOADING */}
      {loading && (
        <p>Loading courses...</p>
      )}

      {/* NO COURSES */}
      {!loading && uniqueCourses.length === 0 && (
        <p>No courses available</p>
      )}

      {/* NO SEARCH RESULTS */}
      {!loading && filteredCourses.length === 0 && (
        <p>No matching courses found</p>
      )}

      {/* COURSES */}
      {!loading && filteredCourses.map(course => {

        const isEnrolled =
          enrolledCourses.includes(course._id);

        return (

          <div
            key={course._id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              margin: "15px 0",
              borderRadius: "12px",
              background: "#f9f9f9"
            }}
          >

            <h4>{course.title}</h4>

            <p>{course.description}</p>

            <p>
              <strong>₹ {course.price}</strong>
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px"
              }}
            >

              <button
                onClick={() => handlePayment(course)}
              >
                Enroll & Pay
              </button>

              {isEnrolled ? (

                <button
                  onClick={() =>
                    navigate(`/course/${course._id}`)
                  }
                >
                  Start Learning
                </button>

              ) : (

                <button
                  disabled
                  style={{ opacity: 0.5 }}
                >
                  🔒 Enroll to Unlock
                </button>

              )}

            </div>

          </div>

        );

      })}

    </div>

  );

}

export default Dashboard;