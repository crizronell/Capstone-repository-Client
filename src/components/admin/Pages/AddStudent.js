import React, { useState, useEffect } from "react";
import ViewID2 from "./ViewID2.js";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { toast } from "react-toastify";
const AddStudent = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    student_id: "",
  });

  const [refresh, setRefresh] = useState(false);

  //destructure the (id)
  const { student_id } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (student_id) {
        const body = { student_id };
        //sending request to server
        const response = await fetch(
          "https://capstone-repository-server.herokuapp.com/admin/student_id",
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
        await response.json();
        console.log("status = " + response.status);
        if (response.status === 200) {
          setRefresh(!refresh);
          toast.success("Add Successfuly");
          setInputs({
            student_id: "",
          });
        } else if (response.status !== 200) {
          toast.error("ID Already Exist");
        }
      } else if (!student_id) {
        toast.error("Fill Out The Field");
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const [total_id, setTotal_ID] = useState([]);
  const totalID = async () => {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/total_id"
      );
      const data = await response.json();
      setTotal_ID(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    totalID();
  }, [refresh]);

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
                <h1>Add Student ID</h1>
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
                        <label>Student ID</label>
                        <input
                          type="number"
                          name="student_id"
                          placeholder="Student ID"
                          className="form-control my-3"
                          value={student_id}
                          onChange={onChange}
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

              <div className="col-12 col-md-4 ">
                <div className="small-box">
                  <div class="inner">
                    {total_id.map((item, index) => {
                      return (
                        <h3 key={index} style={{ color: "black" }}>
                          {item.count}
                        </h3>
                      );
                    })}
                    <h6>Total ID</h6>
                  </div>
                  <div className="icon">
                    <i className="fas fa-user"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ViewID2 refresh={refresh} setRefresh={setRefresh} />
      </div>
    </>
  );
};

export default AddStudent;
