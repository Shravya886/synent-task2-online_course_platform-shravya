import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPanel() {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/admin-login");
    }
  }, []);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [modules, setModules] = useState([]);
  const [moduleTitle, setModuleTitle] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const fetchUsers = async () => {
  try {
    const res = await axios.get(
      "http://10.148.101.197:5000/api/auth/users"
    );
    setUsers(res.data);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  fetchCourses();
  fetchUsers();
}, []);
  useEffect(() => {
    fetchCourses();
  }, []);

  

  /* ================= FETCH ================= */
  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "http://10.148.101.197:5000/api/courses"
      );
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= SAVE COURSE ================= */
  const saveCourse = async () => {
    try {
      if (editId) {
        await axios.put(
          `http://10.148.101.197:5000/api/courses/${editId}`,
          { title, description, price }
        );
        alert("Course Updated");
      } else {
        await axios.post(
          "http://10.148.101.197:5000/api/courses/add",
          {
            title,
            description,
            price,
            modules: []
          }
        );
        alert("Course Added");
      }

      setTitle("");
      setDescription("");
      setPrice("");
      setEditId(null);
      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= DELETE ================= */
  const deleteCourse = async (id) => {
    try {
      await axios.delete(
        `http://10.148.101.197:5000/api/courses/${id}`
      );
      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= ADD MODULE (FIXED) ================= */
  const addModule = async () => {
    try {
      if (!selectedCourseId) {
        alert("Select a course first");
        return;
      }

      await axios.put(
        `http://10.148.101.197:5000/api/courses/${selectedCourseId}`,
        {
          $push: {
            modules: {
              title: moduleTitle,
              lessons: []
            }
          }
        }
      );

      setModuleTitle("");
      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= ADD LESSON ================= */
  const addLesson = async (moduleIndex) => {
    try {
      const course = courses.find(
        (c) => c._id === selectedCourseId
      );

      if (!course) return;

      const updatedModules = [...course.modules];

      updatedModules[moduleIndex].lessons.push({
        title: lessonTitle,
        videoUrl: videoUrl
      });

      await axios.put(
        `http://10.148.101.197:5000/api/courses/${selectedCourseId}`,
        { modules: updatedModules }
      );

      setLessonTitle("");
      setVideoUrl("");
      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      <h1>Admin Panel</h1>

      <h2>All Users</h2>

<div style={{ marginBottom: "30px" }}>
  {users.map((user) => (
    <div
      key={user._id}
      style={{
        border: "1px solid gray",
        padding: "10px",
        margin: "10px 0"
      }}
    >
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
    </div>
  ))}
</div>

      {/* COURSE FORM */}
      <div style={{ border: "1px solid #ccc", padding: 20 }}>
        <h2>Add Course</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button onClick={saveCourse}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* SELECT COURSE */}
      <h2>Select Course for Modules</h2>

      <select
        onChange={(e) => setSelectedCourseId(e.target.value)}
      >
        <option value="">Select</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>

      {/* MODULE */}
      <h3>Add Module</h3>

      <input
        placeholder="Module Title"
        value={moduleTitle}
        onChange={(e) => setModuleTitle(e.target.value)}
      />

      <button onClick={addModule}>Add Module</button>

      {/* LESSON */}
      <h3>Add Lesson</h3>

      <input
        placeholder="Lesson Title"
        value={lessonTitle}
        onChange={(e) => setLessonTitle(e.target.value)}
      />

      <input
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      {/* SHOW MODULES */}
      {selectedCourseId &&
        courses
          .find((c) => c._id === selectedCourseId)
          ?.modules?.map((m, i) => (
            <div key={i} style={{ border: "1px solid gray", margin: 10 }}>
              <h4>{m.title}</h4>

              <button onClick={() => addLesson(i)}>
                Add Lesson
              </button>

              {m.lessons?.map((l, j) => (
                <p key={j}>▶ {l.title}</p>
              ))}
            </div>
          ))}

      {/* COURSE LIST */}
      <h2>All Courses</h2>

      {courses.map((course) => (
        <div key={course._id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>

          <button onClick={() => deleteCourse(course._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;