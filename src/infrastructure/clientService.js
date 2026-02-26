import api from "./api";

export const getClients = async (page = 1, search = "") => {
  const params = { page };
  if (search) params.search = search;
  const { data } = await api.get("/clients", { params });
  return data;
};

export const getAllClients = async () => {
  const { data } = await api.get("/clients/all");
  return data.clients;
};

export const createClient = async client => {
  const { data } = await api.post("/clients", client);
  return data.client;
};

export const updateClient = async (id, client) => {
  const { data } = await api.put(`/clients/${id}`, client);
  return data.client;
};

export const deleteClient = async id => {
  await api.delete(`/clients/${id}`);
};
