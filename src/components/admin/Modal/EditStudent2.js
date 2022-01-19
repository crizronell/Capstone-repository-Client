import React, { useState } from "react";
import { toast } from "react-toastify";
function EditStudent2({ row }) {
  const [inputs, setInputs] = useState({
    stu_name: "",
    stu_username: "",
    stu_password: "",
  });

  const { stu_name, stu_username, stu_password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const setInputValue = (row) => {
    setInputs({
      stu_name: row.stu_name,
      stu_username: row.stu_username,
    });
  };

  const originalState = () => {
    setInputs({
      stu_password: "",
    });
  };

  const updateStudent = async (e) => {
    try {
      if (stu_password) {
        const body = { stu_password };
        const editstudent = await fetch(
          `https://capstone-repository-server.herokuapp.com/admin/edit_students/${row.stu_id}`,
          {
            method: "PUT",
            headers: {
              token: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );
        //get the actual data from the response if theres any
        const data = await editstudent.json();
        console.log("status = " + editstudent.status);
        toast.success(data);
      } else if (!stu_password) {
        toast.error("Fill Out The Field");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div>
        {/* Button trigger modal */}
        <button
          type="button"
          className="btn btn-warning"
          data-bs-toggle="modal"
          onClick={() => setInputValue(row)}
          data-bs-target={`#modal-student1-${row.stu_id}`}
        >
          Edit
        </button>
        {/* Modal */}
        <div
          className="modal fade"
          id={`modal-student1-${row.stu_id}`}
          tabIndex={-1}
          data-bs-backdrop="static"
          data-bs-keyboard="false"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit Student
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => originalState()}
                />
              </div>
              <div className="modal-body">
                <form>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        value={stu_name}
                        name="stu_name"
                        type="text"
                        className="form-control my-3"
                        readOnly
                      ></input>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        value={stu_username}
                        name="stu_username"
                        type="text"
                        className="form-control my-3"
                        readOnly
                      ></input>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        value={stu_password}
                        name="stu_password"
                        type="password"
                        className="form-control my-3"
                        placeholder="Enter New Password"
                        onChange={(e) => onChange(e)}
                      ></input>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => originalState()}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  data-bs-dismiss="modal"
                  onClick={() => updateStudent()}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditStudent2;
