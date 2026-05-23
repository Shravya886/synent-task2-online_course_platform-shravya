import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const { token } = useParams();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `http://10.148.101.197:5000/api/auth/verify-email/${token}`
        );

        alert(res.data);
      } catch (err) {
        alert(err.response?.data?.msg || "Verification failed");
      }
    };

    verify();
  }, [token]);

  return <h2>Verifying your email...</h2>;
}

export default VerifyEmail;