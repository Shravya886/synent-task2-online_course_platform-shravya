import { useState } from "react";
import axios from "axios";
import "../App.css";

function Login() {

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

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);

  
  localStorage.setItem("userId", res.data.user._id);


        window.location.href = "/dashboard";
        alert("Login Successful");
      } else {
        alert("Token not received");
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

      </form>

    </div>
  );
}

export default Login;