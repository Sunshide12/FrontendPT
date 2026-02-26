import api from "./api";

export const getProducts = async (page = 1, search = "", category_id = "") => {
  const params = { page, search };

  // Solo mandamos category_id si tiene valor real
  if (category_id !== "") params.category_id = category_id;

  const { data } = await api.get("/products", { params });
  return data;
};

export const getAllProducts = async () => {
  const { data } = await api.get("/products/all");
  return data.products;
};

export const createProduct = async product => {
  const { data } = await api.post("/products", product);
  return data.product;
};

export const updateProduct = async (id, product) => {
  const { data } = await api.put(`/products/${id}`, product);
  return data.product;
};

export const deleteProduct = async id => {
  await api.delete(`/products/${id}`);
};
