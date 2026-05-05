import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./SignUp.css";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}


const SignUp = () => {
  
  const navigate = useNavigate();
  const [userData, setUserData] = useState<SignUpData>({
    name: "",
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
    if (!userData.name.trim()) {
      setError("Full Name is required");
      return false;
    }

    if (!userData.email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userData.email)) {
      setError("Enter a valid email address");
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

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await api.post("/api/auth/register", userData);

      setSuccess(res.data.message || "Registration Successful");

      setUserData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "Registration failed"
        );
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={userData.name}
          onChange={handleChange}
          disabled={loading}
        />

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
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;