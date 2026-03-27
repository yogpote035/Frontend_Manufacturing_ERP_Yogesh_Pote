import React from "react";
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  BarChart3,
  Percent,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/sales/dashboard",
    },
    {
      name: "Lead",
      icon: <Users size={20} />,
      path: "/sales/new-lead",
    },
    {
      name: "Employees",
      icon: <UserSquare2 size={20} />,
      path: "/sales/employees",
    },
    {
      name: "Reports & Analytics",
      icon: <BarChart3 size={20} />,
      path: "/sales/reports",
    },
  ];

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="bg-black p-2 rounded-lg text-white">
          <Percent size={20} />
        </div>
        <span className="font-bold text-xl text-gray-800">Sales</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-black text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;