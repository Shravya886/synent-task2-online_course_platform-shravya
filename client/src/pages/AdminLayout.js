import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminLayout() {
  const navigate = useNavigate();
  const [active, setActive] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: "220px",
          background: "#1e1e2f",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>

          <h2 style={{ marginBottom: "20px" }}>Admin Panel</h2>

          <nav>

            <Link
              to="/admin/dashboard"
              onClick={() => setActive("dashboard")}
              style={{
                display: "block",
                margin: "10px 0",
                color: active === "dashboard" ? "yellow" : "white",
                textDecoration: "none"
              }}
            >
              👤 Dashboard
            </Link>

            <Link
              to="/admin/courses"
              onClick={() => setActive("courses")}
              style={{
                display: "block",
                margin: "10px 0",
                color: active === "courses" ? "yellow" : "white",
                textDecoration: "none"
              }}
            >
              📚 Courses
            </Link>
            

        <Link
          to="/admin/enrollments"
          onClick={() => setActive("enrollments")}
          style={{
            display: "block",
            margin: "10px 0",
            color: active === "enrollments" ? "yellow" : "white",
            textDecoration: "none"
          }}
        >
          👍 Enrollments
        </Link>

          </nav>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "20px", background: "#f4f4f4" }}>

        <h1>Admin Panel</h1>

        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;