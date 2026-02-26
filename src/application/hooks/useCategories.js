import { useState, useEffect } from "react";
import * as categoryService from "../../infrastructure/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [catPage, setCatPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async name => {
    const newCat = await categoryService.createCategory(name);
    setCategories(prev => [...prev, newCat]);
  };

  const editCategory = async (id, name) => {
    const updated = await categoryService.updateCategory(id, name);
    setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
  };

  const removeCategory = async id => {
    await categoryService.deleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Pagino localmente porque el endpoint devuelve todas las categorías
  // y se necesitan completas para el dropdown de productos
  const paginatedCategories = categories.slice((catPage - 1) * itemsPerPage, catPage * itemsPerPage);

  const catPagination = {
    current_page: catPage,
    last_page: Math.ceil(categories.length / itemsPerPage),
  };

  return { categories, paginatedCategories, catPagination, setCatPage, loading, error, addCategory, editCategory, removeCategory };
}
