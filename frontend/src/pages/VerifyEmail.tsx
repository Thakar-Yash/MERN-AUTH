import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./VerifyEmail.css";

interface VerifyOtpData {
  otp: string;
}

const VerifyEmail = () => {
  const navigate = useNavigate();

  const [otpData, setOtpData] = useState<VerifyOtpData>({
    otp: "",
  });

  const [loadingOtp, setLoadingOtp] = useState<boolean>(false);
  const [loadingVerify, setLoadingVerify] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Send OTP
  const handleSendOtp = async (): Promise<void> => {
    try {
      setLoadingOtp(true);
      setError("");
      setSuccess("");

      const res = await api.post("/api/auth/send-verify-otp");

      setSuccess(res.data.message || "OTP sent successfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to send OTP");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoadingOtp(false);
    }
  };

  // OTP Input Change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtpData({
      otp: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  // Verify Email
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!otpData.otp.trim()) {
      setError("OTP is required");
      return;
    }

    if (otpData.otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoadingVerify(true);
      setError("");
      setSuccess("");

      const res = await api.post("/api/auth/verify-account", otpData);

      setSuccess(res.data.message || "Email Verified Successfully");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Verification failed");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="verify-container">
      <form className="verify-form" onSubmit={handleSubmit}>
        <h2>Verify Email</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button
          type="button"
          className="otp-btn"
          onClick={handleSendOtp}
          disabled={loadingOtp}
        >
          {loadingOtp ? "Sending OTP..." : "Send OTP"}
        </button>

        <input
          type="text"
          placeholder="Enter 6 Digit OTP"
          maxLength={6}
          value={otpData.otp}
          onChange={handleChange}
          disabled={loadingVerify}
        />

        <button type="submit" disabled={loadingVerify}>
          {loadingVerify ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;