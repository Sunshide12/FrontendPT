import api from "./api";

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data.categories;
};

export const createCategory = async name => {
  const { data } = await api.post("/categories", { name });
  return data.category;
};

export const updateCategory = async (id, name) => {
  const { data } = await api.put(`/categories/${id}`, { name });
  return data.category;
};

export const deleteCategory = async id => {
  await api.delete(`/categories/${id}`);
};
