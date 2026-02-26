import { useState, useEffect, useCallback } from "react";
import * as clientService from "../../infrastructure/clientService";

export function useClients() {
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [allClients, setAllClients] = useState([]);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients(page, search);
      setClients(data.clients.data);
      setPagination(data.clients);
    } catch (err) {
      setError("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    clientService.getAllClients().then(setAllClients);
  }, []);

  const addClient = async client => {
    await clientService.createClient(client);
    fetchClients();
  };

  const editClient = async (id, client) => {
    await clientService.updateClient(id, client);
    fetchClients();
  };

  const removeClient = async id => {
    await clientService.deleteClient(id);
    fetchClients();
  };

  return {
    clients,
    allClients,
    pagination,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    addClient,
    editClient,
    removeClient,
  };
}
