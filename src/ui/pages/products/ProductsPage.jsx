import { useState } from "react";
import { useProducts } from "../../../application/hooks/useProducts";
import { useCategories } from "../../../application/hooks/useCategories";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";

import Toast from "../../components/Toast";
import { useToast } from "../../../application/hooks/useToast";

function ProductsPage() {
  const { products, pagination, loading, search, setSearch, setPage, addProduct, editProduct, removeProduct } = useProducts();
  const { categories } = useCategories();
  const { toast, showToast, hideToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = creando, objeto = editando
  const [form, setForm] = useState({ name: "", price: "", stock: "", category_id: "" });
  const [formError, setFormError] = useState("");

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", price: "", stock: "", category_id: "" });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = product => {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock || !form.category_id) {
      setFormError("Todos los campos son obligatorios");
      return;
    }
    try {
      if (editing) {
        await editProduct(editing.id, form);
        showToast("Producto actualizado correctamente");
      } else {
        await addProduct(form);
        showToast("Producto creado correctamente");
      }
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message ?? "Error al guardar");
      showToast(err.response?.data?.message ?? "Error al guardar", "error");
    }
  };

  const handleDelete = async id => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await removeProduct(id);
    } catch (err) {
      alert(err.response?.data?.message ?? "No se pudo eliminar");
    }
  };

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Catálogo y gestión de precios"
        action={
          <button onClick={openCreate} className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Nuevo producto
          </button>
        }
      />

      <SearchBar
        value={search}
        onChange={val => {
          setSearch(val);
          setPage(1);
        }}
        placeholder="Buscar producto..."
      />

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Precio</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-left px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-400">{product.id}</td>
                  <td className="px-4 py-3 text-gray-800">{product.name}</td>
                  <td className="px-4 py-3">${parseFloat(product.price).toFixed(2)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3 text-gray-500">{product.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(product)} className="px-3 py-1 text-xs border border-primary text-primary rounded hover:bg-primary-light transition-colors">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="px-3 py-1 text-xs border border-red-300 text-red-400 rounded hover:bg-red-50 transition-colors">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={setPage} />

      {showModal && (
        <Modal title={editing ? "Editar producto" : "Nuevo producto"} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-3">
            <input className="input" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="input" type="number" placeholder="Precio" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            <select className="input" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Selecciona categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {formError && <p className="text-red-400 text-xs">{formError}</p>}
            <button onClick={handleSubmit} className="bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-medium transition-colors mt-1">
              {editing ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}

export default ProductsPage;
