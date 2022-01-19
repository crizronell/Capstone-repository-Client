import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { toast } from "react-toastify";
function ResearchInchareID({ setAuth }) {
  const [inputs, setInputs] = useState({
    id: "",
  });

  //destructure the (id)
  const { id } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { id };

      //sending request to server
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/research_incharge_id",
        {
          method: "POST",
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      //get the actual data from the response if theres any
      const data = await response.json();
      console.log(data);

      console.log("status = " + response.status);

      if (id) {
        if (response.status === 200) {
          toast.success("Add Successfuly");
          setInputs({
            id: "",
          });
        } else if (response.status !== 200) {
          toast.error("ID is already exist");
        }
      } else if (!id) {
        toast.error("Fill in the field");
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };
  return (
    <>
      <Navbar logout={logout} />
      <Sidebar />
      <div className="content-wrapper" style={{ backgroundColor: "white" }}>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Add Research Incharge ID</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <form onSubmit={onSubmitForm}>
                    <div className="card-body">
                      <div className="form-group">
                        <label>Research Incharge ID</label>
                        <input
                          type="number"
                          name="id"
                          placeholder="Research Incharge ID"
                          className="form-control my-3"
                          onChange={(e) => onChange(e)}
                          value={id}
                        ></input>
                      </div>
                      <div className="col-auto float-right">
                        <button type="submit" class="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ResearchInchareID;
