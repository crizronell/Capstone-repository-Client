import React, { useState } from "react";
import { toast } from "react-toastify";
function Edit({ row }) {
  const [stu_name, setStuname] = useState(row.stu_name);
  const [stu_username, setStuusername] = useState(row.stu_username);
  const [stu_password, setStupassword] = useState("");

  const originalState = () => {
    setStupassword("");
  };
  const updateStudent = async (e) => {
    e.preventDefault();
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
          data-bs-target={`#student_id${row.stu_id}`}
        >
          Edit
        </button>
        {/* Modal */}
        <div
          className="modal fade"
          id={`student_id${row.stu_id}`}
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit ID
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
                <form onSubmit>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        value={stu_username}
                        type="text"
                        readOnly
                        placeholder="Enter New ID"
                        className="form-control my-3"
                        onChange={(e) => setStuusername(e.target.value)}
                      ></input>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        value={stu_name}
                        type="text"
                        readOnly
                        placeholder="Enter New Name"
                        className="form-control my-3"
                        onChange={(e) => setStuname(e.target.value)}
                      ></input>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        value={stu_password}
                        type="password"
                        placeholder="Enter New Password"
                        className="form-control my-3"
                        onChange={(e) => setStupassword(e.target.value)}
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
                  className="btn btn-primary"
                  onClick={() => updateStudent()}
                  data-bs-dismiss="modal"
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

export default Edit;
