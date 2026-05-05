import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./ResetPassword.css";

interface ResetPasswordData {
  otp: string;
  newPassword: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [formData, setFormData] = useState<ResetPasswordData>({
    otp: "",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/api/auth/reset-password", {
        email,
        ...formData,
      });

      setSuccess(res.data.message || "Password Reset Successful");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Reset Failed");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={formData.otp}
          onChange={handleChange}
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;