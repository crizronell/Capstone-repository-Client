import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import EditResearch from "../Modal/EditResearch";
import DataTable from "react-data-table-component";
import "../custom-css/admin.css";
function ViewCapstone({ setAuth }) {
  const [research, setResearch] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isEditingResearch, setIsEditingResearch] = useState(false);

  const columns = useMemo(() => [
    {
      name: "Title",
      selector: (row) => row.research_title,
      sortable: true,
    },

    {
      name: "Author",
      selector: (row) => row.research_author,
      sortable: true,
    },

    {
      name: "Year",
      selector: (row) => row.research_year,
      sortable: true,
    },

    {
      name: "College",
      selector: (row) => row.research_college,
      sortable: true,
    },

    {
      name: "Program",
      selector: (row) => row.research_program,
      sortable: true,
    },

    {
      name: "Document",
      selector: (row) => (
        <div className="col-auto">
          <a href={row.research_url} target="_blank" rel="noreferrer">
            <i
              className="fa fa-file-pdf-o"
              style={{ fontSize: "36px", color: "red" }}
            ></i>
          </a>
        </div>
      ),
    },
    {
      name: "Edit",
      cell: (row) => (
        <EditResearch
          row={row}
          refresh={refresh}
          setRefresh={setRefresh}
          setIsEditingResearch={setIsEditingResearch}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: false,
      button: true,
    },
  ]);
  const customStyles = {
    rows: {
      style: {
        minHeight: "3rem", // override the row height
      },
    },

    cells: {
      style: {
        paddingRight: "-1rem",
      },
    },
  };
  const getResearch = async () => {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/get_research"
      );
      const data = await response.json();
      setResearch(data);
      setRefresh(!refresh);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getResearch();
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
                <h1>Approve Research</h1>
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
                    {!isEditingResearch ? (
                      <DataTable
                        className="scroll"
                        columns={columns}
                        data={research.filter((value) => {
                          if (filterText === "") {
                            return value;
                          } else if (
                            value.research_title
                              .toLowerCase()
                              .includes(filterText.toLowerCase())
                          ) {
                            return value;
                          } else if (
                            value.research_author
                              .toLowerCase()
                              .includes(filterText.toLowerCase())
                          ) {
                            return value;
                          } else if (
                            value.research_year
                              .toLowerCase()
                              .includes(filterText.toLowerCase())
                          ) {
                            return value;
                          }
                        })}
                        highlightOnHover
                        pagination
                        defaultSortFieldId={1}
                        customStyles={customStyles}
                      />
                    ) : (
                      <div className="mt-5 text-center position-relative">
                        <div className="mt-5 position-absolute top-50 start-50 translate-middle">
                          <div className="mt-5 mb-2">Approving research...</div>
                          <div
                            className="my-2 spinner-border text-primary spinner-large"
                            role="status"
                          ></div>
                        </div>
                      </div>
                    )}
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

export default ViewCapstone;
