import React, { useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import Search from "./Pages/Search";
import "./custom-css/user.css";
import bg from "../../assets/bg2.jpg";

const Portal = ({ setAuthUser }) => {
  const logout = () => {
    localStorage.removeItem("token");
    setAuthUser(false);
    localStorage.clear();
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url('${bg}')`;
    document.body.style.backgroundPosition = "center center";
  }, []);

  return (
    <>
      <Navbar logout={logout} setAuthUser={setAuthUser} />
      <Search />
    </>
  );
};

export default Portal;
