import api from "./api";

export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const getMyProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const updateMyProfile = async (profileData) => {
  const { data } = await api.put("/auth/me", profileData);
  return data;
};

export const changeMyPassword = async (passwordData) => {
  const { data } = await api.put("/auth/change-password", passwordData);
  return data;
};