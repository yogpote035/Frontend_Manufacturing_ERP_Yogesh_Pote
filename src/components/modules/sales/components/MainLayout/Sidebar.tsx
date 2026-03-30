import { useNavigate, useLocation, Link } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-64 bg-white h-full lg:h-screen border-r border-[#005d5230] flex flex-col overflow-y-auto">
      {/* Logo - Updated to Pine Green Box */}
      <div className="p-6 py-[21.5px] flex items-center gap-3 border-b border-[#005d5230]">
        <Link to="/sales/dashboard" className="bg-[#005d52] p-2 rounded-xl text-white shadow-md">
          <img src="/icons/SalesDashboard.svg" className="h-5 w-5" alt="Logo" />
        </Link>
        <span className="font-bold text-xl text-gray-800 tracking-tight">Sales</span>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {/* Dashboard */}
        <button
          onClick={() => navigate("/sales/dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-all duration-200 ${
            isActive("/sales/dashboard")
              ? "bg-[#005d52] text-white shadow-md"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <img
            src="/icons/dashboard-monitor.svg"
            className={`h-5 w-5 ${
              isActive("/sales/dashboard") ? "" : "invert opacity-60"
            }`}
            alt=""
          />
          <span className="font-semibold text-sm">Dashboard</span>
        </button>

        {/* Lead */}
        <button
          onClick={() => navigate("/sales/leads")}
          className={`w-full flex items-center gap-3 px-4 cursor-pointer py-3 rounded-xl transition-all duration-200 ${
            isActive("/sales/leads")
              ? "bg-[#005d52] text-white shadow-md"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <img
            src="/icons/lead-management.svg"
            className={`h-5 w-5 ${
              isActive("/sales/leads") ? "brightness-0 invert" : "opacity-60"
            }`}
            alt=""
          />
          <span className="font-semibold text-sm">Lead</span>
        </button>

        {/* Employees */}
        <button
          onClick={() => navigate("/sales/employees")}
          className={`w-full flex items-center gap-3 px-4 cursor-pointer py-3 rounded-xl transition-all duration-200 ${
            isActive("/sales/employees")
              ? "bg-[#005d52] text-white shadow-md"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <img
            src="/icons/users2.svg"
            className={`h-5 w-5 ${
              isActive("/sales/employees") ? "brightness-0 invert" : "opacity-60"
            }`}
            alt=""
          />
          <span className="font-semibold text-sm">Employees</span>
        </button>

        {/* Reports */}
        <button
          onClick={() => navigate("/sales/reports")}
          className={`w-full flex items-center gap-3 px-4 hover:cursor-pointer py-3 rounded-xl transition-all duration-200 ${
            isActive("/sales/reports")
              ? "bg-[#005d52] text-white shadow-md"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <img
            src="/icons/data-report.svg"
            className={`h-5 w-5 ${
              isActive("/sales/reports") ? "brightness-0 invert" : "opacity-60"
            }`}
            alt=""
          />
          <span className="font-semibold text-sm">Reports & Analytics</span>
        </button>
      </nav>

      {/* Logout Section - Fixed at Bottom */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <img
            src="/icons/logout.svg" 
            className="h-5 w-5 opacity-60 group-hover:opacity-100 group-hover:filter-none transition-all"
            alt="Logout"
            style={{ 
              // This inline filter ensures the icon turns red on hover 
              // if your SVG is black by default
              filter: 'grayscale(100%)' 
            }}
          />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;