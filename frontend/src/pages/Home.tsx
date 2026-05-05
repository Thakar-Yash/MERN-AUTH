import { useNavigate } from "react-router-dom";
import "./Home.css";
import api from "../api/api";

interface HomeProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Home = ({ isLoggedIn, setIsLoggedIn }: HomeProps) => {
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await api.post("/api/auth/logout");

      setIsLoggedIn(false);

      navigate("/login");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h2 className="logo">MERN Auth App</h2>

        {isLoggedIn ? (
          <>
            <button
              className="profile-btn"
              onClick={() => navigate("/user-profile")}
            >
              👤
            </button>

            <button className="auth-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button
            className="auth-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </header>

      <main className="hero-section">
        <h1>Welcome to MERN Authentication Project</h1>
        <p>
          A secure authentication system built with React, TypeScript,
          Node.js, Express, and MongoDB.
        </p>

        {!isLoggedIn && (
          <button
            className="hero-btn"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        )}
      </main>
    </div>
  );
};

export default Home;