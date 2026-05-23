import { useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("LOGIN DATA SENT:", formData);

    try {
      const res = await axios.post(
        "http://10.148.101.197:5000/api/auth/login",
        formData
      );

      console.log("LOGIN RESPONSE:", res.data);

      const { token, user } = res.data;

      if (!token) {
        alert("Login failed");
        return;
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("userId", user._id || "");
        localStorage.setItem("role", user.role || "user");
      } else {
        localStorage.setItem("role", "user");
      }

      alert("Login Successful");

      const role = user?.role || "user";

      if (role === "admin") {
        navigate("/admin/courses");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <div className="form-container">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>

        
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </button>

      </form>

    </div>
  );
}

export default Login;