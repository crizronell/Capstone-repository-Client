import React from "react";

const Navbar = ({ logout }) => {
  return (
    <>
      <nav
        className="main-header navbar navbar-expand"
        style={{ backgroundColor: "#e65b7a" }}
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <i
              className="fas fa-bars mt-3"
              style={{ color: "white" }}
              data-widget="pushmenu"
              role="button"
            />
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <button className="btn btn-dark me-auto" onClick={logout}>
            Logout
          </button>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
