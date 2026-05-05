import api from "./api";

export const sendForgotPasswordOTP = async (payload) => {
  const { data } = await api.post("/otp/forgot-password", payload);
  return data;
};

export const resetPasswordWithOTP = async (payload) => {
  const { data } = await api.post("/otp/reset-password", payload);
  return data;
};

export const sendComplaintTrackingOTP = async (payload) => {
  const { data } = await api.post("/otp/track-complaint/send", payload);
  return data;
};

export const verifyComplaintTrackingOTP = async (payload) => {
  const { data } = await api.post("/otp/track-complaint/verify", payload);
  return data;
};