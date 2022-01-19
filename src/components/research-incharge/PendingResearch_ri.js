import { storage, ref, deleteObject, listAll } from "../../Firebase";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const PendingResearch_ri = ({ researchInchargeInfo }) => {
  const [pendingResearch, setPendingResearch] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const handleDelete = async (research_id) => {
    const response = await fetch(
      `https://capstone-repository-server.herokuapp.com/research_incharge/research/${research_id}`,
      {
        method: "DELETE",
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();

    if (response.status === 200) {
      // delete file from firebase storage
      const storageRef = ref(storage, research_id);
      listAll(storageRef).then((res) => {
        res.items.forEach((itemRef) => {
          const deleteFileRef = ref(storage, itemRef.fullPath);

          deleteObject(deleteFileRef).then(() => {
            toast.success(data);
          });
        });
      });
      setRefresh((prev) => !prev);
    }
  };

  const getPendingResearch = async () => {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/research_incharge/research",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setPendingResearch(data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const columns = [
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
      name: "Status",
      selector: (row) => (
        <span
          className={` badge ${
            row.research_status === "pending" ? "bg-success" : "bg-danger"
          }`}
        >
          {row.research_status}
        </span>
      ),
    },
    {
      name: "Research Incharge",
      selector: (row) => row.ri_name,
    },

    {
      cell: (row) =>
        row.research_status === "rejected" && (
          <button
            className={`btn btn-danger badge`}
            onClick={() => handleDelete(row.research_id)}
          >
            <i className="fa fa-trash"></i>
          </button>
        ),
      ignoreRowClick: true,
      allowOverflow: false,
      button: true,
    },
  ];

  useEffect(() => {
    getPendingResearch();
  }, [refresh]);

  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <DataTable
                    columns={columns}
                    data={
                      pendingResearch &&
                      pendingResearch.filter(
                        (row) => row.ri_id === researchInchargeInfo.ri_id
                      )
                    }
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
      {/* <div className="card">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={
              pendingResearch &&
              pendingResearch.filter(
                (row) => row.ri_id === researchInchargeInfo.ri_id
              )
            }
            highlightOnHover
            pagination
            defaultSortFieldId={1}
          />
        </div>
      </div> */}
    </>
  );
};

export default PendingResearch_ri;
