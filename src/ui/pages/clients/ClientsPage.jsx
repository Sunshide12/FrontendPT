import { useState } from "react";
import { useClients } from "../../../application/hooks/useClients";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";

function ClientsPage() {
  const { clients, pagination, loading, search, setSearch, page, setPage, addClient, editClient, removeClient } = useClients();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [formError, setFormError] = useState("");

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "" });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = client => {
    setEditing(client);
    setForm({ name: client.name, email: client.email, phone: client.phone });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) {
      setFormError("Todos los campos son obligatorios");
      return;
    }
    try {
      if (editing) {
        await editClient(editing.id, form);
      } else {
        await addClient(form);
      }
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message ?? "Error al guardar");
    }
  };

  const handleDelete = async id => {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      await removeClient(id);
    } catch (err) {
      alert(err.response?.data?.message ?? "No se pudo eliminar");
    }
  };

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Base de datos de clientes"
        action={
          <button onClick={openCreate} className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Nuevo cliente
          </button>
        }
      />

      <SearchBar
        value={search}
        onChange={val => {
          setSearch(val);
          setPage(1);
        }}
        placeholder="Buscar cliente..."
      />

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Teléfono</th>
              <th className="text-left px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-400">{client.id}</td>
                  <td className="px-4 py-3 text-gray-800">{client.name}</td>
                  <td className="px-4 py-3 text-gray-500">{client.email}</td>
                  <td className="px-4 py-3 text-gray-500">{client.phone}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(client)} className="px-3 py-1 text-xs border border-primary text-primary rounded hover:bg-primary-light transition-colors">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(client.id)} className="px-3 py-1 text-xs border border-red-300 text-red-400 rounded hover:bg-red-50 transition-colors">
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
        <Modal title={editing ? "Editar cliente" : "Nuevo cliente"} onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-3">
            <input className="input" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="input" placeholder="Teléfono" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            {formError && <p className="text-red-400 text-xs">{formError}</p>}
            <button onClick={handleSubmit} className="bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-medium transition-colors mt-1">
              {editing ? "Guardar cambios" : "Crear cliente"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default ClientsPage;
