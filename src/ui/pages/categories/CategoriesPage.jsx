import { useState } from "react";
import { useCategories } from "../../../application/hooks/useCategories";
import PageHeader from "../../components/PageHeader";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";

function CategoriesPage() {
  const { categories, paginatedCategories, catPagination, setCatPage, loading, addCategory, editCategory, removeCategory } = useCategories();

  const [newName, setNewName] = useState("");
  const [createError, setCreateError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editError, setEditError] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await addCategory(newName.trim());
      setNewName("");
      setCreateError("");
    } catch (err) {
      setCreateError(err.response?.data?.message ?? "Error al crear categoría");
    }
  };

  const openEdit = category => {
    setEditingCategory(category);
    setEditingName(category.name);
    setEditError("");
    setShowModal(true);
  };

  const handleEdit = async () => {
    if (!editingName.trim()) return;
    try {
      await editCategory(editingCategory.id, editingName.trim());
      setShowModal(false);
    } catch (err) {
      setEditError(err.response?.data?.message ?? "Error al editar categoría");
    }
  };

  const handleDelete = async id => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await removeCategory(id);
    } catch (err) {
      alert(err.response?.data?.message ?? "No se pudo eliminar");
    }
  };

  return (
    <div>
      <PageHeader title="Categorías" subtitle="Organización de productos" />

      {/* Formulario inline para crear — una sola línea no justifica abrir modal */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Nueva categoría</p>
        <div className="flex gap-2">
          <input className="input flex-1" placeholder="Nombre de la categoría" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} />
          <button onClick={handleCreate} className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
            Crear
          </button>
        </div>
        {createError && <p className="text-red-400 text-xs mt-2">{createError}</p>}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : (
              paginatedCategories.map(category => (
                <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-400">{category.id}</td>
                  <td className="px-4 py-3 text-gray-800">{category.name}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(category)} className="px-3 py-1 text-xs border border-primary text-primary rounded hover:bg-primary-light transition-colors">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="px-3 py-1 text-xs border border-red-300 text-red-400 rounded hover:bg-red-50 transition-colors">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={catPagination} onPageChange={setCatPage} />

      {showModal && (
        <Modal title="Editar categoría" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-3">
            <input className="input" placeholder="Nombre" value={editingName} onChange={e => setEditingName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleEdit()} autoFocus />
            {editError && <p className="text-red-400 text-xs">{editError}</p>}
            <button onClick={handleEdit} className="bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-medium transition-colors mt-1">
              Guardar cambios
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CategoriesPage;
