import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./ui/components/Sidebar";

import ProductsPage from "./ui/pages/products/ProductsPage";
import CategoriesPage from "./ui/pages/categories/CategoriesPage";
import ClientsPage from "./ui/pages/clients/ClientsPage";
import InventoryPage from "./ui/pages/inventory/InventoryPage";
import OrdersPage from "./ui/pages/orders/OrdersPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/products" />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
