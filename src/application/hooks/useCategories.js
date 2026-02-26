import { useState, useEffect } from "react";
import * as categoryService from "../../infraestructure/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return { categories, loading, error, addCategory, editCategory, removeCategory };
}
