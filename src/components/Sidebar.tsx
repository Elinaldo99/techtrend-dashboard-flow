
import { Home, Package, ShoppingCart, BarChart, Users, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  open: boolean;
}

const Sidebar = ({ open }: SidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Package, label: "Inventário", path: "/inventory" },
    { icon: ShoppingCart, label: "Vendas", path: "/sales" },
    { icon: Users, label: "Clientes", path: "/customers" },
    { icon: BarChart, label: "Relatórios", path: "/reports" },
    { icon: Settings, label: "Configurações", path: "/settings" }
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 z-20 h-[calc(100%-4rem)] bg-white border-r shadow-sm transition-all duration-300 ${
        open ? "w-64" : "w-0 -translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="p-4">
        <div className="flex items-center justify-center mb-8 pt-2">
          <h2 className="text-xl font-bold text-blue-600">TechTrend ERP</h2>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
