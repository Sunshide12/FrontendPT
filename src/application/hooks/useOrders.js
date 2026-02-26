import { useState, useEffect, useCallback } from "react";
import * as orderService from "../../infrastructure/orderSrevice";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders(page, search);
      setOrders(data.orders.data);
      setPagination(data.orders);
    } catch (err) {
      console.error("Error al cargar pedidos", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const addOrder = async order => {
    await orderService.createOrder(order);
    fetchOrders();
  };

  const changeStatus = async (id, status) => {
    await orderService.updateOrderStatus(id, status);
    fetchOrders();
  };

  const removeOrder = async id => {
    await orderService.deleteOrder(id);
    fetchOrders();
  };

  return {
    orders,
    pagination,
    loading,
    search,
    setSearch,
    page,
    setPage,
    addOrder,
    changeStatus,
    removeOrder,
  };
}
