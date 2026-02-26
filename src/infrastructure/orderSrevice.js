import api from "./api";

export const getOrders = async (page = 1, search = "") => {
  const params = { page };
  if (search) params.search = search;
  const { data } = await api.get("/orders", { params });
  return data;
};

export const createOrder = async order => {
  const { data } = await api.post("/orders", order);
  return data.order;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}`, { status });
  return data.order;
};

export const deleteOrder = async id => {
  await api.delete(`/orders/${id}`);
};
