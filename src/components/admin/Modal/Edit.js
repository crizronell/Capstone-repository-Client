import React, { useState } from "react";
import { toast } from "react-toastify";
function Edit({ row, refresh, setRefresh }) {
  console.log(row);
  const [student_id, setStudent_id] = useState(row.student_id);

  const originalState = () => {
    setStudent_id(row.student_id);
  };
  const updateStudent = async (e) => {
    try {
      if (student_id) {
        const body = { student_id };
        const editstudent = await fetch(
          `https://capstone-repository-server.herokuapp.com/admin/edit_id/${row.id}`,
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
        await editstudent.json();

        console.log("status = " + editstudent.status);

        if (editstudent.status === 200) {
          toast.success("Edit Successfully");
          setRefresh(!refresh);
        } else if (editstudent.status !== 200) {
          toast.error("ID Already Exist");
        }
      } else if (!student_id) {
        toast.error("Fill Out The Field");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      {/* <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${item.id}`}
      >
        Edit
      </button>
     
      <div
        className="modal fade"
        id={`id${item.id}`}
        data-backdrop="static"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Edit Student
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={originalState}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit>
                <div className="card-body">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      value={student_id}
                      type="number"
                      placeholder="Enter New Student ID"
                      className="form-control my-3"
                      onChange={(e) => setStudent_id(e.target.value)}
                    ></input>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={updateStudent}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={originalState}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>  */}
      <div>
        {/* Button trigger modal */}
        <button
          type="button"
          className="btn btn-warning"
          data-bs-toggle="modal"
          data-bs-target={`#id${row.id}`}
        >
          Edit
        </button>
        {/* Modal */}
        <div
          className="modal fade"
          id={`id${row.id}`}
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
                />
              </div>
              <div className="modal-body">
                <form>
                  <div className="card-body">
                    <div className="form-group">
                      <label>ID Number</label>
                      <input
                        value={student_id}
                        type="number"
                        placeholder="Enter New Student ID"
                        className="form-control my-3"
                        onChange={(e) => setStudent_id(e.target.value)}
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
