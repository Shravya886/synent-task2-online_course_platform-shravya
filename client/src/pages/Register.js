import { useState } from "react";
import axios from "axios";
import "../App.css";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
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

  if (!formData.name || !formData.email || !formData.password) {
    alert("All fields are required");
    return;
  }

  try {
    const res = await axios.post(
      "http://10.148.101.197:5000/api/auth/register",
      formData
    );

    alert(res.data.msg);

  } catch (err) {
    console.log(err);
    alert(err.response?.data?.msg || "Registration Failed");
  }
};

  return (

    <div className="form-container">

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          onChange={handleChange}
        />

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
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;