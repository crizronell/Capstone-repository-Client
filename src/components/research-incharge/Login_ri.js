import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login_ri = ({ setIsAuthenticatedri }) => {
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
          "https://capstone-repository-server.herokuapp.com/auth/ri/login",
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
          setIsAuthenticatedri(true);
          toast.success("Login Successfuly");
        } else if (response.status !== 200) {
          setIsAuthenticatedri(false);
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
        <div className="login-box">
          <div className="card rounder card-outline cards">
            <div className="card-body">
              <h3 className="login-box-msg">Welcome</h3>
              <h4 className="login-box-msg">Research Teacher</h4>
              <form onSubmit={onSubmitForm}>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="ID Number"
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
                      Login
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <Link to="/ri/register">Click to Register!</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login_ri;
