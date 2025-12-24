import React from "react";
import Sidebar from "./components/SideBar/sidebar";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Navbar />
    </div>
  );
}

export default App;
