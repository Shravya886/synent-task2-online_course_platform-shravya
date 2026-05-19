import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";

function CoursePlayer() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState("");
const [loadingVideo, setLoadingVideo] = useState(false);


  useEffect(() => {
    fetchCourse();
  }, []);

  // GET COURSE
  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses/${id}`
      );

      const data = res.data;
      setCourse(data);

      // first video auto-play
      const firstVideo =
        data?.modules?.[0]?.lessons?.[0]?.videoUrl;

      if (firstVideo) {
        setSelectedVideo(convertUrl(firstVideo));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // FIX YOUTUBE URL (IMPORTANT)
  const convertUrl = (url) => {
    if (!url) return "";

    // embed → watch
    if (url.includes("embed")) {
      const id = url.split("/embed/")[1];
      return `https://www.youtube.com/watch?v=${id}`;
    }

    return url;
  };

  // PLAY VIDEO
const handleVideoClick = (lesson) => {
  console.log("VIDEO CLICKED:", lesson);

  const getVideoUrl = (url) => {
    if (!url) return "";

    // extract video ID from embed link
    const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^&?/]+)/);
    const videoId = match ? match[1] : null;

    return videoId
      ? `https://www.youtube.com/watch?v=${videoId}`
      : url;
  };

  setSelectedVideo(getVideoUrl(lesson.videoUrl));
};
useEffect(() => {
  const checkAccess = async () => {
    const userId = localStorage.getItem("userId");

    const res = await axios.get(
      `http://localhost:5000/api/enroll/check/${userId}/${id}`
    );

    if (!res.data.enrolled) {
      alert("You are not enrolled in this course");
      window.location.href = "/";
    }
  };

  checkAccess();
}, []);

  // MARK COMPLETED
  const markCompleted = async (lesson) => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!userId || !course?._id || !lesson?.title) {
      console.log("Missing data:", { userId, course, lesson });
      return;
    }

    await axios.post(
      "http://localhost:5000/api/progress/complete",
      {
        userId: String(userId),
        courseId: String(course._id),
        lessonTitle: lesson.title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Lesson Completed ✔");
  } catch (err) {
    console.log("PROGRESS ERROR:", err.response?.data || err.message);
  }
};
  if (!course) return <h2>Loading...</h2>;
  const checkEnrollment = async () => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId || !id) return;

    const res = await axios.get(
      `http://localhost:5000/api/enroll/check/${userId}/${id}`
    );

    console.log("ENROLL STATUS:", res.data);

  } catch (err) {
    console.log("Enroll check failed:", err.response?.data || err.message);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>{course.title}</h1>

      {/* VIDEO PLAYER */}
     {selectedVideo ? (
  <div style={{ border: "2px solid red" }}>
    <iframe
      width="100%"
      height="500px"
      src={selectedVideo.replace("watch?v=", "embed/")}
      title="Course Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>

        </div>
      ) : (
        <h3>Click a lesson to play video</h3>
      )}

      <h2>Modules</h2>

      {/* MODULES */}
      {course.modules?.map((module, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          <h3>{module.title}</h3>

          {/* LESSONS */}
          {module.lessons?.map((lesson, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "10px 0",
                padding: "5px",
              }}
            >
              {/* PLAY VIDEO */}
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => handleVideoClick(lesson)}
              >
                ▶ {lesson.title}
              </span>



              {/* COMPLETE */}
              <button onClick={() => markCompleted(lesson)}>
                Mark Completed
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default CoursePlayer;