import { useState } from "react";
import { useOrders } from "../../../application/hooks/useOrders";
import { useClients } from "../../../application/hooks/useClients";
import { useProducts } from "../../../application/hooks/useProducts";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { useToast } from "../../../application/hooks/useToast";

// Colores del badge según el estado del pedido
const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-600 border border-yellow-200" },
  completed: { label: "Completado", color: "bg-green-100 text-green-600 border border-green-200" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-400 border border-red-200" },
};

function OrdersPage() {
  const { orders, pagination, loading, search, setSearch, page, setPage, addOrder, changeStatus, removeOrder } = useOrders();

  // Necesitamos todos los clientes y productos para los dropdowns del formulario
  const { clients = [], allClients = [] } = useClients();
  const { allProducts = [] } = useProducts();
  const { toast, showToast, hideToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [formError, setFormError] = useState("");

  // Calculamos el total en tiempo real sumando precio * cantidad de cada item
  const total = items.reduce((accumulator, item) => {
    const product = allProducts.find(p => p.id === Number(item.productId));
    if (!product || !item.quantity) return accumulator;
    return accumulator + parseFloat(product.price) * Number(item.quantity);
  }, 0);

  const openCreate = () => {
    setClientId("");
    setItems([{ productId: "", quantity: 1 }]);
    setFormError("");
    setShowModal(true);
  };

  const addItem = () => {
    setItems(prev => [...prev, { productId: "", quantity: 1 }]);
  };

  const removeItem = index => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async () => {
    if (!clientId) {
      setFormError("Selecciona un cliente");
      return;
    }
    if (items.some(i => !i.productId || !i.quantity)) {
      setFormError("Completa todos los productos");
      return;
    }

    try {
      await addOrder({
        client_id: clientId,
        products: items.map(i => ({ id: Number(i.productId), quantity: Number(i.quantity) })),
      });
      setShowModal(false);
      showToast("Pedido creado correctamente");
    } catch (err) {
      // El backend devuelve el mensaje de stock insuficiente directamente
      const msg = err.response?.data?.message ?? "Error al crear pedido";
      setFormError(msg);
      showToast(msg, "error");
    }
  };

  const handleDelete = async id => {
    const order = orders.find(order => order.id === id);
    const message = order?.status === "pending" ? "¿Eliminar este pedido? El stock será restaurado." : "¿Eliminar este pedido? Esta acción no se puede deshacer.";

    if (!confirm(message)) return;
    try {
      await removeOrder(id);
      showToast("Pedido eliminado correctamente");
    } catch (err) {
      const msg = err.response?.data?.message ?? "No se pudo eliminar";
      showToast(msg, "error");
    }
  };

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle="Registro y seguimiento"
        action={
          <button onClick={openCreate} className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Nuevo pedido
          </button>
        }
      />

      <SearchBar
        value={search}
        onChange={val => {
          setSearch(val);
          setPage(1);
        }}
        placeholder="Buscar por cliente..."
      />

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Cliente</th>
              <th className="text-left px-4 py-3">Fecha</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3">Productos</th>
              <th className="text-left px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : (
              orders.map(order => {
                const status = statusConfig[order.status] ?? statusConfig.pending;
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-400">{order.id}</td>
                    <td className="px-4 py-3 text-gray-800">{order.client?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{order.date}</td>
                    <td className="px-4 py-3 font-medium">${parseFloat(order.total).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {/* Dropdown de status — el backend valida las transiciones */}
                      <select value={order.status} onChange={e => changeStatus(order.id, e.target.value)} className={`text-xs font-semibold px-2 py-1 rounded cursor-pointer ${status.color}`}>
                        <option value="pending">Pendiente</option>
                        <option value="completed">Completado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {order.order_details?.map(d => (
                        <div key={d.id}>
                          {d.product?.name} x{d.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(order.id)} className="px-3 py-1 text-xs border border-red-300 text-red-400 rounded hover:bg-red-50 transition-colors">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={setPage} />

      {showModal && (
        <Modal title="Nuevo pedido" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase font-semibold">Cliente</label>
              <select className="input mt-1" value={clientId} onChange={e => setClientId(e.target.value)}>
                <option value="">Selecciona un cliente</option>
                {allClients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase font-semibold">Productos</label>
              <div className="flex flex-col gap-2 mt-1">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select className="input flex-1" value={item.productId} onChange={e => updateItem(index, "productId", e.target.value)}>
                      <option value="">Producto</option>
                      {allProducts.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (stock: {p.stock})
                        </option>
                      ))}
                    </select>
                    <input type="number" min="1" className="input w-20" value={item.quantity} onChange={e => updateItem(index, "quantity", e.target.value)} />
                    {items.length > 1 && (
                      <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 text-lg leading-none">
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addItem} className="text-xs text-primary hover:text-primary-hover mt-2 font-medium">
                + Agregar producto
              </button>
            </div>

            {total > 0 && (
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm">
                <span className="text-gray-500">Total estimado: </span>
                <span className="font-bold text-gray-800">${total.toFixed(2)}</span>
              </div>
            )}

            {formError && <p className="text-red-400 text-xs">{formError}</p>}

            <button onClick={handleSubmit} className="bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-medium transition-colors">
              Confirmar pedido
            </button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}

export default OrdersPage;
