import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FaHome } from "react-icons/fa";
import Logo from "../../images/Logo.png";

const Header = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  return (
    <header className="header">
      <div className="container-fluid">
        {/* Logo on the left */}
        <Link className="header-logo" to="/">
          <img src={Logo} alt="Research Bin" className="header-logo-image" />
        </Link>

        {/* Home Icon on the right */}
        <FaHome className="home-icon" onClick={() => navigate("/")} />
      </div>
    </header>
  );
};

export default Header;
