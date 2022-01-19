import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import DataTable from "react-data-table-component";
import EditStudent from "../Modal/EditStudent";
function ViewStudent2({ setAuth, refresh, setRefresh }) {
  const columns = useMemo(
    () => [
      {
        name: "Name",
        selector: (row) => row.stu_name,
        sortable: true,
        grow: 2,
      },

      {
        name: "Username",
        selector: (row) => row.stu_username,
        sortable: true,
        grow: 2,
      },

      {
        name: "Edit",
        cell: (row) => <EditStudent row={row} />,
      },
    ],
    []
  );
  const [filterText, setFilterText] = useState("");
  const [student, setStudent] = useState([]);
  const getStudent = async () => {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/get_allstudent"
      );
      const data = await response.json();
      setStudent(data);
      setRefresh(!refresh);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getStudent();
  }, []);

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
                <h1>List of Students</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="mb-3  col-sm-12 ">
                      <input
                        type="text"
                        className="form-control col-lg-3 float-right"
                        placeholder="Search"
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                    </div>

                    <DataTable
                      columns={columns}
                      data={student.filter((value) => {
                        if (filterText === "") {
                          return value;
                        } else if (
                          value.stu_name
                            .toLowerCase()
                            .includes(filterText.toLowerCase())
                        ) {
                          return value;
                        } else if (
                          value.stu_username
                            .toLowerCase()
                            .includes(filterText.toLowerCase())
                        ) {
                          return value;
                        }
                      })}
                      highlightOnHover
                      pagination
                      defaultSortFieldId={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ViewStudent2;
