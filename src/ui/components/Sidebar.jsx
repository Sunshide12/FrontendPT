import { NavLink } from "react-router-dom";

const links = [
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/clients", label: "Clients" },
  { to: "/inventory", label: "Inventory" },
  { to: "/orders", label: "Orders" },
];

function Sidebar() {
  return (
    <aside className="w-52 bg-white border-r border-gray-100 px-6 py-8 shrink-0">
      <p className="text-xs font-bold text-gray-400 tracking-widest mb-6">MENU</p>
      <nav className="flex flex-col gap-1">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `text-sm py-1.5 px-2 rounded transition-colors ${isActive ? "text-primary font-semibold" : "text-gray-600 hover:text-gray-900"}`}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
