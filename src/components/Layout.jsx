// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./SideBar/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {" "}
        {/* ← هون */}
        <Sidebar />
        <main className="flex-1">
          {" "}
          {/* ← وهون */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
