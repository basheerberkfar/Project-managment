import React from "react";
import "./Sidebar.scss";
import { TfiAlignJustify } from "react-icons/tfi";
import { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";

export default function Sidebar() {
  const [show, setShow] = useState(false);
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
            {show ? "" : <a href="">Home</a>}
          </li>
          <li>
            <AiOutlineHome className="icon" />
            {show ? "" : <a href="">Home</a>}
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
