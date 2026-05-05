import api from "./api";

export const analyzeComplaint = async (payload) => {
  const { data } = await api.post("/ai/analyze-complaint", payload);
  return data;
};