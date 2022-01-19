import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function AdminRegister({ setAuth }) {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  //destructure the (id, username, password)
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
          "https://capstone-repository-server.herokuapp.com/auth/admin-register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        //get the actual data from the response if theres any
        const data = await response.json();

        if (response.status === 200) {
          localStorage.setItem("token", data.token);

          setAuth(true);

          toast.success(data.message);
        } else if (response.status !== 200) {
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
      <div className="hold-transition login-page">
        <div className="login-box">
          <div className="card card-outline">
            <div className="card-header text-center"></div>
            <div className="card-body">
              <h3 className="login-box-msg">Welcome Admin</h3>
              <form onSubmit={onSubmitForm}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => onChange(e)}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user" />
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => onChange(e)}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign up
                    </button>
                  </div>
                </div>
                <Link to="/Admin-Login">Click to Login!</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminRegister;
