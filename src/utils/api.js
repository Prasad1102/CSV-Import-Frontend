import axiosInstance from "./axios";

export const getUsers = (page) => {
  return axiosInstance.get("/employees", { params: { page: page } });
};

export const uploadFile = (formData) => {
  return axiosInstance.post("imports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const checkFileStatus = (id) => {
  return axiosInstance.get(`/imports/${id}`);
};
