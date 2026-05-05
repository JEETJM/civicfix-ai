import api from "./api";

export const getAdminComplaints = async (params = {}) => {
  const { data } = await api.get("/admin-panel/complaints", { params });
  return data;
};

export const getAdminComplaintDetails = async (id) => {
  const { data } = await api.get(`/admin-panel/complaints/${id}`);
  return data;
};

export const updateAdminComplaint = async (id, payload) => {
  const { data } = await api.put(`/admin-panel/complaints/${id}`, payload);
  return data;
};

export const getAdminDepartments = async () => {
  const { data } = await api.get("/admin-panel/departments");
  return data;
};