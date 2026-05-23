import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
  try {
    console.log("Sending email:", email);

    const res = await axios.post(
      "http://10.148.101.1977:5000/api/auth/forgot-password",
      { email }
    );

    alert(res.data.msg);

  } catch (err) {
    console.log("ERROR:", err);
    alert(err.response?.data?.msg || "Network Error");
  }
};
  return (
    <div style={{ padding: "20px" }}>
      <h2>Forgot Password</h2>

      <input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Send Reset Link
      </button>
    </div>
  );
}

export default ForgotPassword;