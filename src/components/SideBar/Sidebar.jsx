import React from "react";
import "./Sidebar.scss";
import { TfiAlignJustify } from "react-icons/tfi";
import { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [show, setShow] = useState(false);
  const location = useLocation();

  // دالة لتحديد إذا الرابط نشط
  const isActive = (path) => location.pathname === path;

  return (
    <aside>
      <div className={show ? "sidebar1" : "sidebar"}>
        <div
          className="main"
          onClick={() => {
            console.log("sidebar1");
            setShow(!show);
            console.log("sidebar1");
          }}
        >
          <TfiAlignJustify className="icons" />
        </div>
        <ul>
          <li>
            <AiOutlineHome className="icon" />
            {show ? (
              ""
            ) : (
              <Link
                to="/"
                className={`block p-3 rounded-lg ${
                  isActive("/") ? "" : "hover:bg-cyan-100"
                }`}
              >
                Dashboard
              </Link>
            )}
          </li>
          <li>
            <AiOutlineHome className="icon" />
            {show ? (
              ""
            ) : (
              <Link
                to="/employees"
                className={`block p-3 rounded-lg ${
                  isActive("/employees") ? "" : "hover:bg-cyan-100"
                }`}
              >
                Employees
              </Link>
            )}
          </li>
          <li>
            <AiOutlineHome className="icon" />
            {show ? "" : <a href="">Home</a>}
          </li>
          <li>
            <AiOutlineHome className="icon" />
            {show ? "" : <a href="">Home</a>}
          </li>
        </ul>
      </div>
    </aside>
  );
}
