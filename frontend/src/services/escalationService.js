import api from "./api";

export const getEscalations = async () => {
  const { data } = await api.get("/escalations");
  return data;
};

export const runAutoEscalationCheck = async () => {
  const { data } = await api.post("/escalations/run-check");
  return data;
};

export const manualEscalateComplaint = async (id, payload) => {
  const { data } = await api.post(`/escalations/complaints/${id}/manual`, payload);
  return data;
};

export const updateEscalationStatus = async (id, payload) => {
  const { data } = await api.put(`/escalations/${id}`, payload);
  return data;
};