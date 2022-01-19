import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const Navbar = ({ logout }) => {
  const [name, setName] = useState("");

  const [inputs, setInputs] = useState({
    username: "",
    newName: "",
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });

  const { username, newName, newPassword, confirmPassword, oldPassword } =
    inputs;

  // function onchange for form input
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  async function getName() {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/user",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setName(data.stu_name);
        setInputs({
          ...inputs,
          username: data.stu_username,
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  }
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
      toast.error("Fill Out The Field");
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
        logout();

        toast.success(data);
      } else {
        toast.error(data);
      }
    } else if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Fill Out All Fields");
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
          <Link to="/Portal" className="brand-link">
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
                  <a
                    href="/#"
                    class="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target={`#modal-edit-profile`}
                  >
                    Edit Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/#"
                    class="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target={`#modal-edit-password`}
                  >
                    Edit Password
                  </a>
                </li>
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

      {/* Modal for edit profile */}
      <div
        className="modal fade"
        id="modal-edit-profile"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Edit Profile
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => clearEditInputs()}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditName}>
                <div className="m-2 d-flex">
                  <input
                    type="text"
                    name="username"
                    disabled
                    placeholder={username}
                    className="form-control my-2"
                  ></input>
                </div>

                <div className="m-2 d-flex align-items-center">
                  <input
                    type="text"
                    name="newName"
                    placeholder="New Name"
                    className="form-control my-2"
                    value={newName}
                    onChange={(e) => onChange(e)}
                  ></input>
                </div>
                <div className="m-2 d-flex justify-content-end">
                  <button
                    className="btn btn-success"
                    type="submit"
                    data-bs-dismiss="modal"
                  >
                    Edit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for change password */}
      <div
        className="modal fade"
        id="modal-edit-password"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Edit Password
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => clearEditInputs()}
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditPassword}>
                <div className="m-2 d-flex align-items-center">
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="Old Password"
                    className="form-control my-2"
                    value={oldPassword}
                    onChange={(e) => onChange(e)}
                  ></input>
                </div>

                <div className="m-2 d-flex align-items-center">
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    className="form-control my-2"
                    value={newPassword}
                    onChange={(e) => onChange(e)}
                  ></input>
                </div>

                <div className="m-2 d-flex align-items-center">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="form-control my-2"
                    value={confirmPassword}
                    onChange={(e) => onChange(e)}
                  ></input>
                </div>

                <div className="m-2 d-flex justify-content-end">
                  <button
                    className="btn btn-success"
                    type="submit"
                    data-bs-dismiss="modal"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
