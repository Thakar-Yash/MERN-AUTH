import api from "../api/api";
import type { UserProfile } from "../types/profile";

const PROFILE_API = "/api/profile";

export const getProfile = async () => {
  const res = await api.get<{
    success: boolean;
    profile: UserProfile;
  }>(`${PROFILE_API}/me`);

  return res.data.profile;
};

export const createProfile = async (
  formData: FormData
) => {
  const res = await api.post(
    `${PROFILE_API}/create`,
    formData
  );

  return res.data;
};

export const updateProfile = async (
  formData: FormData
) => {
  const res = await api.put(
    `${PROFILE_API}/update`,
    formData
  );

  return res.data;
};