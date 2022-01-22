import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

function Sidebar() {
  const [pendingResearch, setPendingResearch] = useState([]);
  const [pendingResearchRefresh, setPendingResearchRefresh] = useState(false);
  // fetch pendingResearch and get the count
  const getPendingResearch = async () => {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/pending_research",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const data = await response.json();

      if (response.status === 200) {
        setPendingResearch(data);
        setPendingResearchRefresh(!pendingResearchRefresh);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getPendingResearch();
  }, [pendingResearchRefresh]);
  return (
    <>
      <aside
        className="main-sidebar elevation-4"
        style={{ backgroundColor: "#e65b7a" }}
      >
        <Link to="/Admin-Dashboard" className="brand-link">
          <img
            src="/logo2.png"
            alt="Logo"
            className="ml-3"
            style={{ width: "2.2rem", height: "2.2rem" }}
          />
          <span
            className="brand-text ml-1 font-weight-bold navbar-brand"
            style={{ color: "white" }}
          >
            Dashboard
          </span>
        </Link>
        <div className="sidebar">
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <Link to="/AddStudent" className="nav-link">
                  <i
                    className="nav-icon far fa-user"
                    style={{ color: "white" }}
                  />
                  <p className="font-weight-bold" style={{ color: "white" }}>
                    Manage ID
                  </p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/ViewStudents" className="nav-link">
                  <i
                    className="nav-icon far fa-user"
                    style={{ color: "white" }}
                  />
                  <p className="font-weight-bold" style={{ color: "white" }}>
                    Manage Student
                  </p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/AddCapstone" className="nav-link">
                  <i
                    className="nav-icon fas fa-archive"
                    style={{ color: "white" }}
                  />
                  <p className="font-weight-bold" style={{ color: "white" }}>
                    Add Research
                  </p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/ViewCapstone" className="nav-link">
                  <i
                    className="nav-icon far fa-thumbs-up"
                    style={{ color: "white" }}
                  />
                  <p className="font-weight-bold" style={{ color: "white" }}>
                    Approve Research
                  </p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/ResearchIncharge" className="nav-link">
                  <i
                    className="nav-icon far fa-user"
                    style={{ color: "white" }}
                  />
                  <p className="font-weight-bold" style={{ color: "white" }}>
                    Research Incharge
                  </p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/PendingResearch" className="nav-link">
                  <i
                    className="nav-icon fas fa-file-pdf"
                    style={{ color: "white" }}
                  />
                  <p className="font-weight-bold " style={{ color: "white" }}>
                    Pending Research
                    <span className="position-absolute top-10 start-90 translate-middle badge rounded-pill bg-danger">
                      {pendingResearch.length}
                    </span>
                  </p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
