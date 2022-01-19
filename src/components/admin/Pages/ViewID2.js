import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import Edit from "../Modal/Edit";

function ViewID2({ refresh, setRefresh }) {
  const columns = useMemo(
    () => [
      {
        name: "ID",
        selector: (row) => row.student_id,
        sortable: true,
        grow: 2,
      },

      {
        name: "Edit",
        cell: (row) => (
          <Edit row={row} refresh={refresh} setRefresh={setRefresh} />
        ),
      },
    ],
    []
  );
  const [id, setID] = useState([]);
  const [filterText, setFilterText] = useState("");

  const getID = async () => {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/get_allID"
      );
      const data = await response.json();
      setID(data);
      setRefresh(!refresh);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getID();
  }, [refresh]);

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>List of ID</h1>
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
                    data={id.filter((value) => {
                      if (filterText === "") {
                        return value;
                      } else if (
                        value.student_id
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
    </>
  );
}

export default ViewID2;
