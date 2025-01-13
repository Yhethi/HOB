import axios from "axios";

const API_URL = "/api/productos";

export const productService = {
  getAll: async (id) => {
    const response = await axios.get(API_URL, {
      params: { userId: id },
    });
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(API_URL, id);
    return response.data;
  },
  create: async (product) => {
    const response = await axios.post(API_URL, product);
    return response.data;
  },
  update: async (id, product) => {
    const response = await axios.put(`${API_URL}/${id}`, product);
    return response.data;
  },
  remove: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
