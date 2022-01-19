import React from "react";
import Navbar from "../admin/Navbar/Navbar";
import Sidebar from "../admin/Sidebar/Sidebar";
import Main from "./Pages/Main";

const Dashboard = ({ setAuth }) => {
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    localStorage.clear();
  };
  return (
    <>
      <Navbar logout={logout} />
      <Sidebar />
      <Main />
    </>
  );
};

export default Dashboard;
