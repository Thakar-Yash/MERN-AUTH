import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./ForgotPassword.css";

interface ForgotPasswordData {
  email: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/api/auth/send-reset-otp", formData);

      setSuccess(res.data.message || "OTP Sent Successfully");

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email: formData.email },
        });
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to send OTP");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <input
          type="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;