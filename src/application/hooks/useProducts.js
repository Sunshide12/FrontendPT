import { useState, useEffect, useCallback } from "react";
import * as productService from "../../infraestructure/productService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts(page, search);
      setProducts(data.products.data);
      setPagination(data.products);
      setError(null); //Si la llamada fué correcta, limpiamos
    } catch (err) {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async product => {
    await productService.createProduct(product);
    fetchProducts();
  };

  const editProduct = async (id, product) => {
    await productService.updateProduct(id, product);
    fetchProducts();
  };

  const removeProduct = async id => {
    await productService.deleteProduct(id);
    fetchProducts();
  };

  return {
    products,
    pagination,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    addProduct,
    editProduct,
    removeProduct,
  };
}
