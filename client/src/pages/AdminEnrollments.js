import { useEffect, useState } from "react";
import axios from "axios";

function AdminEnrollments() {

  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {

      const res = await axios.get(
        "http://10.148.101.197:5000/api/admin/enrollments"
      );

      setEnrollments(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Enrollments</h1>

      {enrollments.map((e) => (
        <div
          key={e._id}
          style={{
            border: "1px solid gray",
            marginBottom: "10px",
            padding: "10px"
          }}
        >
          <h3>{e.userId?.name}</h3>

          <p>{e.userId?.email}</p>

          <p>
            Course:
            {" "}
            {e.courseId?.title}
          </p>

          <p>
           <p>
  Payment ID: {e.paymentId ? e.paymentId : "N/A"}
</p>
          </p>

        </div>
      ))}
    </div>
  );
}

export default AdminEnrollments;