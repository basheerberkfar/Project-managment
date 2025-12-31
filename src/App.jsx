// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"; // ← استيراد Layout
import Dashboard from "./pages/Dashboard";
import EmployeesPage from "./pages/EmployeeTable";
import "./App.css";

function App() {
  return (
    <div className="h-screen">
      <BrowserRouter>
        <Routes>
          {/* كل الصفحات تستخدم نفس Layout */}
          <Route path="/" element={<Layout />}>
            {" "}
            {/* ← هنا Layout */}
            {/* محتوى الصفحات يظهر مكان {children} في Layout */}
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
