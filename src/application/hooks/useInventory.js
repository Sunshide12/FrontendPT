import { useState, useEffect, useCallback } from "react";
import * as inventoryService from "../../infrastructure/inventoryService";

export function useInventory() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getInventory(page, search);
      setProducts(data.products.data);
      setPagination(data.products);
    } catch (err) {
      console.error("Error al cargar inventario", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const adjust = async (id, stock) => {
    await inventoryService.adjustStock(id, stock);
    fetchInventory();
  };

  return {
    products,
    pagination,
    loading,
    search,
    setSearch,
    page,
    setPage,
    adjust,
  };
}
