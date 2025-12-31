import React, { useState, useEffect } from "react";
import { TfiAlignJustify } from "react-icons/tfi";
import "./Navbar.scss";
function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const toggleNav = () => {
    setToggleMenu(!toggleMenu);
  };
  useEffect(() => {
    const changeWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", changeWidth);
    return () => {
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  return (
    <nav className={toggleMenu ? "nav1" : "nav"}>
      {(toggleMenu || screenWidth > 500) && (
        <ul className="list">
          <li className="items">Home</li>
          <li className="items">Sevices</li>
          <li className="items">Contact</li>
        </ul>
      )}

      <span onClick={toggleNav} className="btn">
        <TfiAlignJustify className="icon" />
      </span>
    </nav>
  );
}
export default Navbar;
