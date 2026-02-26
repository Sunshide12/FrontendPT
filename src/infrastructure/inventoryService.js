import api from "./api";

export const getInventory = async (page = 1, search = "") => {
  const params = { page };
  if (search) params.search = search;
  const { data } = await api.get("/inventory", { params });
  return data;
};

export const adjustStock = async (id, stock) => {
  const { data } = await api.patch(`/inventory/${id}`, { stock });
  return data.product;
};
