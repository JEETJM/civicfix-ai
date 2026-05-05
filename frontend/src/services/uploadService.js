import api from "./api";

export const uploadComplaintImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await api.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await api.post("/upload/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const removeProfileImage = async () => {
  const { data } = await api.delete("/upload/profile-image");
  return data;
};