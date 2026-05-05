import api from "./api";

export const createComplaint = async (complaintData) => {
  const { data } = await api.post("/complaints", complaintData);
  return data;
};

export const getMyComplaints = async () => {
  const { data } = await api.get("/complaints/my");
  return data;
};

export const getComplaintById = async (id) => {
  const { data } = await api.get(`/complaints/${id}`);
  return data;
};

export const getAllComplaints = async () => {
  const { data } = await api.get("/complaints/all");
  return data;
};

export const updateComplaintStatus = async (id, statusData) => {
  const { data } = await api.put(`/complaints/${id}/status`, statusData);
  return data;
};

export const getComplaintByComplaintId = async (complaintId) => {
  const { data } = await api.get(`/complaints/track/${complaintId}`);
  return data;
};