import api from "./api";

export const submitFeedback = async (payload) => {
  const { data } = await api.post("/feedback", payload);
  return data;
};

export const getMyFeedbacks = async () => {
  const { data } = await api.get("/feedback/my");
  return data;
};

export const getAllFeedbacks = async () => {
  const { data } = await api.get("/feedback/all");
  return data;
};