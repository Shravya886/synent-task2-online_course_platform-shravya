import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CoursePlayer() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loadingVideo, setLoadingVideo] = useState(false);

  // ======================
  // LOAD COURSE + ACCESS
  // ======================
  useEffect(() => {
    fetchCourse();
    checkAccess();
  }, []);

  // ======================
  // FETCH COURSE
  // ======================
  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/courses/${id}`
      );

      const data = res.data;

      setCourse(data);

      // Auto play first video
      const firstVideo =
        data?.modules?.[0]?.lessons?.[0]?.videoUrl;

      if (firstVideo) {
        setSelectedVideo(convertUrl(firstVideo));
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // CHECK ENROLLMENT ACCESS
  // ======================
  const checkAccess = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId || !id) return;

      const res = await axios.get(
        `http://localhost:5000/api/enroll/check/${userId}/${id}`
      );

      if (!res.data.enrolled) {
        alert("You are not enrolled in this course");
        window.location.href = "/";
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ======================
  // FIX YOUTUBE URL
  // ======================
  const convertUrl = (url) => {
    if (!url) return "";

    if (url.includes("embed")) {
      const vid = url.split("/embed/")[1];
      return `https://www.youtube.com/watch?v=${vid}`;
    }

    return url;
  };

  // ======================
  // PLAY VIDEO
  // ======================
  const handleVideoClick = (lesson) => {
    if (!lesson?.videoUrl) return;

    const match = lesson.videoUrl.match(
      /(?:embed\/|v=|youtu\.be\/)([^&?/]+)/
    );

    const videoId = match ? match[1] : null;

    const finalUrl = videoId
      ? `https://www.youtube.com/watch?v=${videoId}`
      : lesson.videoUrl;

    setLoadingVideo(true);

    setTimeout(() => {
      setSelectedVideo(finalUrl);
      setLoadingVideo(false);
    }, 500);
  };

  // ======================
  // MARK LESSON COMPLETED
  // ======================
  const markCompleted = async (lesson) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId || !course?._id || !lesson?.title) {
        console.log("Missing data");
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

      setCompletedLessons((prev) => [
        ...prev,
        lesson.title,
      ]);

      alert("Lesson Completed ✔");

    } catch (err) {
      console.log(
        "PROGRESS ERROR:",
        err.response?.data || err.message
      );
    }
  };

  // ======================
  // LOADING
  // ======================
  if (!course) {
    return <h2>Loading...</h2>;
  }

  // ======================
  // UI
  // ======================
  return (
    <div style={{ padding: "20px" }}>

      <h1>{course.title}</h1>

      {/* VIDEO PLAYER */}
      {selectedVideo ? (
        <div style={{ marginBottom: "30px" }}>

          {loadingVideo ? (
            <h3>Loading Video...</h3>
          ) : (
            <iframe
              width="100%"
              height="500px"
              src={selectedVideo.replace(
                "watch?v=",
                "embed/"
              )}
              title="Course Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}

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
            padding: "15px",
            marginTop: "20px",
            borderRadius: "10px",
          }}
        >

          <h3>{module.title}</h3>

          {/* LESSONS */}
          {module.lessons?.map((lesson, idx) => {

            const isCompleted =
              completedLessons.includes(lesson.title);

            return (

              <div
                key={idx}
                style={{
                  border: "1px solid #eee",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >

                {/* LESSON TITLE */}
                <div>

                  <span
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      fontWeight: "bold",
                    }}
                    onClick={() =>
                      handleVideoClick(lesson)
                    }
                  >
                    ▶ {lesson.title}
                  </span>

                  <br />

                  {isCompleted ? (

                    <span style={{ color: "green" }}>
                      ✅ Completed
                    </span>

                  ) : (

                    <span style={{ color: "orange" }}>
                      🎥 Watch Lesson
                    </span>

                  )}

                </div>

                {/* COMPLETE BUTTON */}
                <button
                  disabled={isCompleted}
                  onClick={() =>
                    markCompleted(lesson)
                  }
                >
                  {isCompleted
                    ? "Completed"
                    : "Mark Complete"}
                </button>

              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default CoursePlayer;