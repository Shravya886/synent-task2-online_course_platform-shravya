import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MyCourses from "./pages/MyCourses";
import CoursePlayer from "./pages/CoursePlayer";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import VerifyEmail from "./pages/VerifyEmail";
import AdminEnrollments from "./pages/AdminEnrollments";
import Courses from "./pages/Courses";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        <Route
          path="/mycourses"
          element={<ProtectedRoute><MyCourses /></ProtectedRoute>}
        />

        <Route
          path="/course/:id"
          element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>}
        />

  <Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="courses" element={<AdminCourses />} />
  <Route path="enrollments" element={<AdminEnrollments />} />
</Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
<Route path="/verify-email/:token" element={<VerifyEmail />} />

 <Route
  path="/admin/courses"
  element={
    <ProtectedRoute roleRequired="admin">
      <AdminCourses />
    </ProtectedRoute>
  }
/>
  <Route
  path="/admin/courses"
  element={
    <ProtectedRoute roleRequired="admin">
      <AdminCourses />
    </ProtectedRoute>
  }
/>

      </Routes>

    
    </BrowserRouter>
  );
}

export default App;