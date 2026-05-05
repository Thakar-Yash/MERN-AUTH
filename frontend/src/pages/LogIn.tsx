import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./LogIn.css";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogIn = ({ setIsLoggedIn }: LoginProps) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = (): boolean => {
    if (!userData.email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userData.email)) {
      setError("Enter valid email address");
      return false;
    }

    if (!userData.password) {
      setError("Password is required");
      return false;
    }

    if (userData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await api.post("/api/auth/login", userData);

      setIsLoggedIn(true);

      if (res.data.user.isAccountVerfied) {
        navigate("/");
      } else {
        navigate("/verify-email");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Login failed");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={userData.email}
          onChange={handleChange}
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>

        <p className="signup-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>

        <p className="forgot-link" onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </p>
      </form>
    </div>
  );
};

export default LogIn;
