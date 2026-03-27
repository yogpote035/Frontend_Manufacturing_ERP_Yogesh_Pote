import React from "react";
import { Search, Bell, LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-100 hover:border hover:border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-200 outline-none text-gray-600"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={24} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-gray-800 border-2 border-white rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 leading-none">Rahul Jagtap</p>
            <p className="text-xs text-gray-500 mt-1">Sales Manager</p>
          </div>
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm tracking-tighter">
            SM
          </div>
        </div>
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;