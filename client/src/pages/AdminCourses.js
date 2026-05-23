import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // ⭐ ADD THIS (MISSING IN YOUR CODE)
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourses();
  }, []);

  /* =========================
     FETCH COURSES
  ========================= */
  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "http://10.148.101.197:5000/api/courses"
      );
      setCourses(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  /* =========================
     START EDIT
  ========================= */
  const startEdit = (course) => {
    setEditId(course._id);
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
  };

  /* =========================
     SAVE (CREATE / UPDATE)
  ========================= */
  const saveCourse = async () => {
    try {
      if (editId) {
        await axios.put(
          `http://10.148.101.197:5000/api/courses/${editId}`,
          { title, description, price },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.post(
          "http://10.148.101.197:5000/api/courses/add",
          { title, description, price, modules: [] },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      setTitle("");
      setDescription("");
      setPrice("");
      setEditId(null);
      fetchCourses();
    } catch (err) {
      console.log("SAVE ERROR:", err);
    }
  };

  /* =========================
     DELETE COURSE
  ========================= */
  const deleteCourse = async (id) => {
    try {
      await axios.delete(
        `http://10.148.101.197:5000/api/courses/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchCourses();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  /* =========================
     ADD MODULE
  ========================= */
  const addModule = async () => {
    try {
      await axios.put(
        `http://10.148.101.197:5000/api/courses/module/${selectedCourseId}`,
        { title: moduleTitle },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setModuleTitle("");
      fetchCourses();
    } catch (err) {
      console.log("MODULE ERROR:", err);
    }
  };

  /* =========================
     ADD LESSON
  ========================= */
  const addLesson = async (moduleIndex) => {
    try {
      await axios.put(
        `http://10.148.101.197:5000/api/courses/lesson/${selectedCourseId}/${moduleIndex}`,
        { title: lessonTitle, videoUrl },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setLessonTitle("");
      setVideoUrl("");
      fetchCourses();
    } catch (err) {
      console.log("LESSON ERROR:", err.response?.data || err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* CREATE / UPDATE COURSE */}
      <div style={{ border: "1px solid gray", padding: "15px" }}>
        <h2>{editId ? "Update Course" : "Add Course"}</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />

        <button onClick={saveCourse}>
          {editId ? "Update Course" : "Add Course"}
        </button>
      </div>

      {/* SELECT COURSE */}
      <div style={{ marginTop: "20px" }}>
        <h2>Select Course</h2>

        <select onChange={(e) => setSelectedCourseId(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* MODULE */}
      {selectedCourseId && (
        <div style={{ marginTop: "20px" }}>
          <h2>Add Module</h2>

          <input
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            placeholder="Module Title"
          />

          <button onClick={addModule}>Add Module</button>
        </div>
      )}

      {/* LESSON */}
      {selectedCourseId && (
        <div style={{ marginTop: "20px" }}>
          <h2>Add Lesson</h2>

          <input
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            placeholder="Lesson Title"
          />

          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Video URL"
          />

          {courses
            .find((c) => c._id === selectedCourseId)
            ?.modules?.map((m, i) => (
              <div key={i}>
                <b>{m.title}</b>
                <button onClick={() => addLesson(i)}>Add Lesson</button>
              </div>
            ))}
        </div>
      )}

      {/* COURSE LIST */}
      <h2>All Courses</h2>

      {courses.map((course) => (
        <div
          key={course._id}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <h3>{course.title}</h3>
          <p>{course.description}</p>

          <button onClick={() => startEdit(course)}>Edit</button>

          <button onClick={() => deleteCourse(course._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;