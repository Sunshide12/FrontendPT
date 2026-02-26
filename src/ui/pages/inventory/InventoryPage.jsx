import { useState } from "react";
import { useInventory } from "../../../application/hooks/useInventory";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { useToast } from "../../../application/hooks/useToast";

function InventoryPage() {
  const { products, pagination, loading, search, setSearch, page, setPage, adjust } = useInventory();
  const { toast, showToast, hideToast } = useToast();

  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [tempStock, setTempStock] = useState("");

  const handleAdjust = async () => {
    if (tempStock === "" || isNaN(tempStock) || Number(tempStock) < 0) return;
    try {
      await adjust(adjustingProduct.id, Number(tempStock));
      setAdjustingProduct(null);
      setTempStock("");
      showToast("Stock actualizado correctamente");
    } catch (err) {
      const msg = err.response?.data?.message ?? "Error al ajustar stock";
      showToast(msg, "error");
    }
  };

  return (
    <div>
      <PageHeader title="Inventario" subtitle="Control de stock por producto" />

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
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-left px-4 py-3">Stock actual</th>
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
              products.map(product => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-400">{product.id}</td>
                  <td className="px-4 py-3 text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-gray-500">{product.category?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="bg-primary-light text-primary text-xs font-semibold px-2 py-1 rounded">{product.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setAdjustingProduct(product);
                        setTempStock(product.stock);
                      }}
                      className="px-3 py-1 text-xs border border-primary text-primary rounded hover:bg-primary-light transition-colors">
                      Ajustar stock
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={setPage} />

      {adjustingProduct && (
        <Modal title={`Ajustar stock — ${adjustingProduct.name}`} onClose={() => setAdjustingProduct(null)}>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-500">
              Stock actual: <span className="font-semibold text-primary">{adjustingProduct.stock}</span>
            </p>
            <input type="number" min="0" className="input" placeholder="Nuevo stock" value={tempStock} onChange={e => setTempStock(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdjust()} autoFocus />
            <button onClick={handleAdjust} className="bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-medium transition-colors mt-1">
              Guardar
            </button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}

export default InventoryPage;
