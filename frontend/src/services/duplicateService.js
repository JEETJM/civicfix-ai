import api from "./api";

export const checkDuplicateComplaint = async (payload) => {
  const { data } = await api.post("/duplicates/check", payload);
  return data;
};