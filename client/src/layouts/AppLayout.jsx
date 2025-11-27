import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, CheckSquare, User, LogOut } from "lucide-react";

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-100 text-blue-700"
      : "text-gray-600 hover:bg-gray-100";

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-blue-600 flex items-center">
            <LayoutDashboard className="mr-2" /> Agenda Pro
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center p-3 rounded-lg font-medium transition-colors ${isActive(
              "/dashboard"
            )}`}
          >
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </Link>

          <Link
            to="/tasks"
            className={`flex items-center p-3 rounded-lg font-medium transition-colors ${isActive(
              "/tasks"
            )}`}
          >
            <CheckSquare size={20} className="mr-3" /> Minhas Tarefas
          </Link>

          <Link
            to="/profile"
            className={`flex items-center p-3 rounded-lg font-medium transition-colors ${isActive(
              "/profile"
            )}`}
          >
            <User size={20} className="mr-3" /> Meu Perfil
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {userData.name ? userData.name[0].toUpperCase() : "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {userData.name || "Usuário"}
              </p>
              <p className="text-xs text-gray-500 truncate w-32">
                {userData.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={18} className="mr-2" /> Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
