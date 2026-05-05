import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import api from "./api/api";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.post("/api/auth/is-auth");

        setIsLoggedIn(res.data.success);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      />

      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/user-profile"
        element={
          isLoggedIn ? (
            <ProfilePage />
          ) : (
            <LogIn setIsLoggedIn={setIsLoggedIn} />
          )
        }
      />
    </Routes>
  );
};

export default App;