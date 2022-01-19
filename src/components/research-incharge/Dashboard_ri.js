import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PendingResearch_ri from "./PendingResearch_ri";
import Research_ri from "./Research_ri";
import { Link } from "react-router-dom";

const Dashboard_ri = ({ setIsAuthenticatedri }) => {
  const [name, setName] = useState("");
  const [researchInchargeInfo, setResearchInchargeInfo] = useState([]);

  const [inputs, setInputs] = useState({
    username: "",
    newName: "",
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });

  const { username, newName, newPassword, confirmPassword, oldPassword } =
    inputs;

  async function getName() {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/user/ri",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setName(data.ri_name);
        setInputs({
          ...inputs,
          username: data.ri_username,
        });

        setResearchInchargeInfo(data);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  // function onchange for form input
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuthenticatedri(false);
    localStorage.clear();
  };

  useEffect(() => {
    getName();
  }, [name]);

  // For Name Edit
  const handleEditName = async (e) => {
    e.preventDefault();

    if (newName) {
      const body = { name: newName };

      const edit_name_response = await fetch(
        "https://capstone-repository-server.herokuapp.com/student/profile_name",
        {
          method: "PUT",
          headers: {
            token: localStorage.token,
            "Content-Type": "application/json",
          },

          body: JSON.stringify(body),
        }
      );

      const data = await edit_name_response.json();

      if (edit_name_response.status === 200) {
        setInputs({ ...inputs, newName: "" });
        setName(newName);
        toast.success(data);
      } else {
        toast.error("Error on updating name");
      }
    }
    if (!newName) {
      toast.error("Fill in the field");
    }
  };

  // For Password Edit
  const handleEditPassword = async (e) => {
    e.preventDefault();

    if (oldPassword && newPassword === confirmPassword) {
      const body = { password: newPassword, oldpassword: oldPassword };

      const edit_pass_response = await fetch(
        "https://capstone-repository-server.herokuapp.com/student/profile_pass",
        {
          method: "PUT",
          headers: {
            token: localStorage.token,
            "Content-Type": "application/json",
          },

          body: JSON.stringify(body),
        }
      );

      const data = await edit_pass_response.json();

      if (edit_pass_response.status === 200) {
        setInputs({
          ...inputs,
          newPassword: "",
          oldPassword: "",
          confirmPassword: "",
        });

        localStorage.removeItem("token");
        setIsAuthenticatedri(false);
        toast.success(data);
      } else {
        toast.error(data);
      }
    } else if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Fill in all fields");
    } else {
      toast.error("Password and confirm password does not match!");
    }
  };

  // For Password Edit
  const clearEditInputs = async () => {
    setInputs({
      ...inputs,
      newName: "",
      newPassword: "",
      oldPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light  "
        style={{ backgroundColor: "#e65b7a" }}
      >
        <div className="container-fluid">
          <Link to="/ri/dashboard" className="brand-link">
            <img
              src="/logo2.png"
              alt="logo"
              style={{ width: "2.2rem", height: "2.2rem" }}
            />

            <span
              className="brand-text ml-1 font-weight-bold navbar-brand"
              style={{ color: "white" }}
            >
              Capstone Repository
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
        <div
          class="collapse navbar-collapse"
          id="navbarNavDarkDropdown"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav  mr-5">
            <li class="nav-item dropdown  mr-5">
              <a
                href="/#"
                class="nav-link dropdown-toggle font-weight-bold"
                id="navbarDarkDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: "white" }}
              >
                {name}
              </a>
              <ul
                class="dropdown-menu"
                aria-labelledby="navbarDarkDropdownMenuLink"
              >
                <li>
                  <a class="dropdown-item" onClick={(e) => logout(e)}>
                    Log Out
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <div className="d-flex align-items-start mt-5 border border-1 p-3 shadow">
          <div
            className="nav flex-column nav-pills me-3 flex-shrink-1"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            <button
              className="nav-link active text-start"
              id="v-pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#Add_Capstone"
              type="button"
              role="tab"
            >
              Add Capstone
            </button>
            <button
              className="nav-link text-start"
              id="v-pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#Pending_Capstone"
              type="button"
              role="tab"
            >
              Pending Capstone
            </button>
          </div>
          <div className="tab-content w-100" id="v-pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="Add_Capstone"
              role="tabpanel"
              aria-labelledby="v-pills-home-tab"
            >
              <Research_ri researchInchargeInfo={researchInchargeInfo} />
            </div>
            <div
              className="tab-pane fade"
              id="Pending_Capstone"
              role="tabpanel"
              aria-labelledby="v-pills-profile-tab"
            >
              <PendingResearch_ri researchInchargeInfo={researchInchargeInfo} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard_ri;
