import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../assets/uic-logo-small.png";

import "../custom-css/user.css";
const UserLogin = ({ setAuthUser }) => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  //destructure the (username, password)
  const { username, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { username, password };

      if (username && password) {
        //sending request to server
        const response = await fetch(
          "https://capstone-repository-server.herokuapp.com/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        //get the actual data from the response if theres any
        const data = await response.json();

        console.log(data);

        if (response.status === 200) {
          localStorage.setItem("token", data.token);
          setAuthUser(true);
          toast.success("Login Successfuly");
        } else if (response.status !== 200) {
          setAuthUser(false);
          toast.error(data.message);
        }
      } else {
        toast.error("Missing Credentials");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="hold-transition login-page bg-img">
        <div className="container">
          <div
            className="d-flex justify-content-center rounded"
            style={{ marginTop: "5rem" }}
          >
            <div
              className="card rounded position-relative cards"
              style={{ width: "30rem", height: "30rem" }}
            >
              <div className="position-absolute top-0 start-50 translate-middle ">
                <img src={logo} alt="logo" style={{ width: "10rem" }} />
              </div>

              <div className="card-body " style={{ marginTop: "6rem" }}>
                <form onSubmit={onSubmitForm} className="mt-5">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => onChange(e)}
                    />
                    <label for="floatingInput">ID Number</label>
                  </div>
                  <div className="form-floating">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => onChange(e)}
                    />
                    <label for="floatingPassword">Password</label>
                  </div>

                  <div className=" d-flex justify-content-center mt-4">
                    <div className="col-4 ">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                  <div className="col-auto  mt-3">
                    <div className="d-flex justify-content-center">
                      <span>
                        <Link to="/User-Register">Click to Register!</Link>
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
