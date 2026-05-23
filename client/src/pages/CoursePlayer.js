import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CoursePlayer() {

  const { id } = useParams();

  const [course, setCourse] = useState(null);

  const [selectedVideo, setSelectedVideo] =
    useState("");

  const [completedLessons, setCompletedLessons] =
    useState([]);

  const [loadingVideo, setLoadingVideo] =
    useState(false);

  // ======================
  // LOAD DATA
  // ======================
  useEffect(() => {

    fetchCourse();
    checkAccess();
    fetchProgress();

  }, []);

  // ======================
  // FETCH COURSE
  // ======================
  const fetchCourse = async () => {

    try {

      const res = await axios.get(
        `http://10.148.101.197:5000/api/courses/${id}`
      );

      const data = res.data;

      setCourse(data);

      const firstVideo =
        data?.modules?.[0]?.lessons?.[0]?.videoUrl;

      if (firstVideo) {

        setSelectedVideo(
          convertUrl(firstVideo)
        );

      }

    } catch (err) {

      console.log(err);

    }

  };

  // ======================
  // FETCH PROGRESS
  // ======================
  const fetchProgress = async () => {

    try {

      const userId =
        localStorage.getItem("userId");

      const res = await axios.get(
        `http://10.148.101.197:5000/api/progress/${userId}/${id}`
      );

      setCompletedLessons(
        res.data.completedLessons || []
      );

    } catch (err) {

      console.log(err);

    }

  };

  // ======================
  // CHECK ACCESS
  // ======================
  const checkAccess = async () => {

    try {

      const userId =
        localStorage.getItem("userId");

      if (!userId || !id) return;

      const res = await axios.get(
        `http://10.148.101.197:5000/api/enroll/check/${userId}/${id}`
      );

      if (!res.data.enrolled) {

        alert(
          "You are not enrolled in this course"
        );

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

      const vid =
        url.split("/embed/")[1];

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

    const videoId =
      match ? match[1] : null;

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
  // MARK COMPLETED
  // ======================
  const markCompleted = async (lesson) => {

    try {

      const token =
        localStorage.getItem("token");

      const userId =
        localStorage.getItem("userId");

      if (
        !userId ||
        !course?._id ||
        !lesson?.title
      ) {
        return;
      }

      await axios.post(
        "http://10.148.101.197:5000/api/progress/complete",
        {
          userId: String(userId),
          courseId: String(course._id),
          lessonTitle: lesson.title,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
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
  // PROGRESS
  // ======================
  const totalLessons =
    course.modules.reduce(
      (total, module) =>
        total + module.lessons.length,
      0
    );

  const completedCount =
    completedLessons.length;

  const progressPercent =
    Math.round(
      (completedCount / totalLessons) * 100
    ) || 0;

  // ======================
  // UI
  // ======================
  return (

    <div style={{ padding: "20px" }}>

      <h1>{course.title}</h1>

      {/* PROGRESS BAR */}
      <div
        style={{
          marginBottom: "25px"
        }}
      >

        <h3>
          Progress: {progressPercent}%
        </h3>

        <div
          style={{
            width: "100%",
            height: "20px",
            background: "#ddd",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >

          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "green",
            }}
          ></div>

        </div>

      </div>

      {/* VIDEO PLAYER */}
      {selectedVideo ? (

        <div
          style={{
            marginBottom: "30px"
          }}
        >

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

        <h3>
          Click a lesson to play video
        </h3>

      )}

      <h2>Modules</h2>

      {/* MODULES */}
      {course.modules?.map(
        (module, index) => (

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
            {module.lessons?.map(
              (lesson, idx) => {

                const isCompleted =
                  completedLessons.includes(
                    lesson.title
                  );

                return (

                  <div
                    key={idx}
                    style={{
                      border:
                        "1px solid #eee",
                      padding: "15px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                    }}
                  >

                    <div>

                      <span
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          fontWeight: "bold",
                        }}
                        onClick={() =>
                          handleVideoClick(
                            lesson
                          )
                        }
                      >
                        ▶ {lesson.title}
                      </span>

                      <br />

                      {isCompleted ? (

                        <span
                          style={{
                            color: "green"
                          }}
                        >
                          ✅ Completed
                        </span>

                      ) : (

                        <span
                          style={{
                            color: "orange"
                          }}
                        >
                          🎥 Watch Lesson
                        </span>

                      )}

                    </div>

                    <button
                      disabled={isCompleted}
                      onClick={() =>
                        markCompleted(
                          lesson
                        )
                      }
                    >
                      {isCompleted
                        ? "Completed"
                        : "Mark Complete"}
                    </button>

                  </div>

                );

              }
            )}

          </div>

        )
      )}

    </div>

  );

}

export default CoursePlayer;