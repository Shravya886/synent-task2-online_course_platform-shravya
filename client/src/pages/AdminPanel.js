import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {

  const [courses, setCourses] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [modules, setModules] = useState([]);
const [moduleTitle, setModuleTitle] = useState("");
const [lessonTitle, setLessonTitle] = useState("");
const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  // FETCH COURSES
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

 const saveCourse = async () => {

  try {

    if (editId) {

      await axios.put(
        `http://localhost:5000/api/courses/${editId}`,
        { title, description, price }
      );

      alert("Course Updated");

    } else {

     await axios.post(
  "http://localhost:5000/api/courses/add",
  {
    title,
    description,
    price,
    modules
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
  // DELETE COURSE
  const deleteCourse = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/courses/${id}`
      );

      alert("Course Deleted");

      fetchCourses();

    } catch (err) {

      console.log(err);

    }

  };
const addModule = () => {

  setModules([
    ...modules,
    {
      title: moduleTitle,
      lessons: []
    }
  ]);

  setModuleTitle("");

};
const addLesson = (moduleIndex) => {

  const updatedModules = [...modules];

  updatedModules[moduleIndex].lessons.push({
    title: lessonTitle,
    videoUrl: videoUrl
  });

  setModules(updatedModules);

  setLessonTitle("");
  setVideoUrl("");

};
  return (

    <div
      style={{
        width: "80%",
        margin: "auto",
        padding: "20px"
      }}
    >

      <h1>Admin Panel</h1>

      {/* ADD COURSE FORM */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "30px",
          borderRadius: "10px"
        }}
      >

        <h2>Add Course</h2>

        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <button onClick={saveCourse}>
  {editId ? "Update Course" : "Add Course"}
</button>
{modules.map((module, index) => (

  <div
    key={index}
    style={{
      border: "1px solid gray",
      padding: "10px",
      marginTop: "10px"
    }}
  >

    <h3>{module.title}</h3>

    <input
      type="text"
      placeholder="Lesson Title"
      value={lessonTitle}
      onChange={(e) => setLessonTitle(e.target.value)}
    />

    <input
      type="text"
      placeholder="Video URL"
      value={videoUrl}
      onChange={(e) => setVideoUrl(e.target.value)}
    />

    <button onClick={() => addLesson(index)}>
      Add Lesson
    </button>

    {/* SHOW LESSONS */}
    {module.lessons.map((lesson, i) => (
      <p key={i}>
        ▶ {lesson.title}
      </p>
    ))}

  </div>

))}

      </div>

      {/* COURSE LIST */}
      <h2>All Courses</h2>

      {courses.map((course) => (

        <div
          key={course._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px"
          }}
        >

          <h3>{course.title}</h3>

          <p>{course.description}</p>

          <p>₹ {course.price}</p>

          <button
            onClick={() =>
              deleteCourse(course._id)
            }
          >
            Delete
          </button>
<button
  onClick={() => {

    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setEditId(course._id);

  }}
>
  Edit
</button>
<h2>Modules</h2>

<input
  type="text"
  placeholder="Module Title"
  value={moduleTitle}
  onChange={(e) => setModuleTitle(e.target.value)}
/>

<button onClick={addModule}>
  Add Module
</button>
        </div>
        

      ))}

    </div>

  );
}

export default AdminPanel;
