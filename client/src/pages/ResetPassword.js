import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleReset = async () => {

    try {
    console.log("PASSWORD:", password); // 👈 ADD HERE

      setLoading(true);

      const res =  await axios.post(
  `http://10.148.101.197:5000/api/auth/reset-password/${token}`,
  { password }
);
      alert(res.data.msg);

      navigate("/login");

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.msg ||
        "Password reset failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div
      style={{
        width: "400px",
        margin: "50px auto",
        padding: "30px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center"
      }}
    >

      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={handleReset}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
          border: "none",
          borderRadius: "8px",
          background: "black",
          color: "white",
          cursor: "pointer"
        }}
      >

        {loading
          ? "Updating..."
          : "Update Password"}

      </button>

    </div>
  );
}

export default ResetPassword;