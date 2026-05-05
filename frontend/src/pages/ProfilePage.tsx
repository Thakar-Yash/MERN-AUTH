import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { UserProfile } from "../types/profile";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "../services/profileApi";

import "../index.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      setProfile(data);
      setName(data.name);
      setEmail(data.email);

      if (data.profileImage) {
        setPreview(`http://localhost:4000${data.profileImage}`);
      }
    } catch {
      console.log("Profile not created yet");
    }
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData();

    if (image) {
      formData.append("profileImage", image);
    }

    try {
      setLoading(true);

      if (profile) {
        await updateProfile(formData);
        alert("Profile Updated");
      } else {
        await createProfile(formData);
        alert("Profile Created");
      }

      fetchProfile();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-card" onSubmit={handleSubmit}>
        <h2>User Profile</h2>

        <div className="image-section">
          <img
            src={
              preview ||
              "https://via.placeholder.com/120"
            }
            alt="Preview"
            className="profile-image"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <input
          type="text"
          value={name}
          readOnly
        />

        <input
          type="email"
          value={email}
          readOnly
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : profile
            ? "Update Profile"
            : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;