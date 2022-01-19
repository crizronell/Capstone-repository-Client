import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import "../custom-css/admin.css";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "../../../Firebase";
function PendingResearch({
  setAuth,
  // pendingResearch,
  // setPendingResearchRefresh,
}) {
  const [progress, setProgress] = useState(0);
  const [isResearchApproving, setIsResearchApproving] = useState(false);
  const [pendingResearch, setPendingResearch] = useState([]);
  const [pendingResearchRefresh, setPendingResearchRefresh] = useState(false);

  const getPendingResearch = async () => {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/pending_research",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      const data = await response.json();

      if (response.status === 200) {
        setPendingResearch(data);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleRejected = async (id) => {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/pending_research/",
        {
          method: "PUT",
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      const data = await response.json();

      if (response.status === 200) {
        setPendingResearchRefresh((prev) => !prev);
        toast.success(data);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleApproved = async (
    id,
    title,
    author,
    year,
    abstract,
    keywords,
    url,
    college,
    program
  ) => {
    try {
      setIsResearchApproving(true);
      const body = {
        title,
        author,
        year,
        abstract,
        keywords,
        url,
        college,
        program,
      };
      const add_response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/research",
        {
          method: "POST",
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const research_data = await add_response.json();
      const research_id = research_data.research_id;

      if (add_response.status === 200) {
        const downloadfile_response = await fetch(url);
        const file = await downloadfile_response.blob();

        // moving the file to another folder
        // fetch the file to get the extact name
        listAll(ref(storage, id)).then(
          (res) => {
            res.items.forEach((itemRef) => {
              const storageRef = ref(storage, `${research_id}/${itemRef.name}`);
              const uploadTask = uploadBytesResumable(storageRef, file);

              uploadTask.on(
                "state_changed",
                (snapshot) =>
                  setProgress(
                    Math.round(
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    )
                  ),
                (err) => console.log(err),
                async () => {
                  // trigger when successful upload

                  // Get the download url of the uploaded file
                  getDownloadURL(storageRef).then(async (dl_url) => {
                    if (dl_url) {
                      console.log(dl_url);
                      // Add download url in a specific research in the database by updating the research url column in the research table in the database
                      const add_research_Url_response = await fetch(
                        "https://capstone-repository-server.herokuapp.com/admin/research_url",
                        {
                          method: "PUT",
                          headers: {
                            token: localStorage.getItem("token"),
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            id: research_id,
                            url: dl_url,
                          }),
                        }
                      );

                      // Get the response of the server regarding the update which is a message
                      const researchUpdateurl_message =
                        await add_research_Url_response.json();

                      if (add_research_Url_response.status === 200) {
                        // clear all inputs, as well as the state
                        setProgress(0);
                        toast.success(researchUpdateurl_message);
                        setPendingResearchRefresh((prev) => !prev);
                        setIsResearchApproving(false);

                        // delete research from the pending research
                      } else if (add_research_Url_response.status !== 200) {
                        toast.error("Error on updating research url");
                      }
                    }
                  });

                  // delete file from previous location or folder
                  const previousFileLocationRef = ref(storage, id);
                  listAll(previousFileLocationRef).then((res) => {
                    res.items.forEach(async (itemRef) => {
                      const deleteFileRef = ref(storage, itemRef.fullPath);
                      await deleteObject(deleteFileRef);
                    });
                  });

                  await fetch(
                    `https://capstone-repository-server.herokuapp.com/research_incharge/research/${id}`,
                    {
                      method: "DELETE",
                      headers: {
                        token: localStorage.getItem("token"),
                      },
                    }
                  );
                }
              );
            });
          },
          (err) => {
            console.error(err.message);
          }
        );
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
      name: "Approve",
      cell: (row) => (
        <button
          className="my-2 btn btn-success"
          onClick={() =>
            handleApproved(
              row.research_id,
              row.research_title,
              row.research_author,
              row.research_year,
              row.research_abstract,
              row.research_keywords,
              row.research_url,
              row.research_college,
              row.research_program
            )
          }
        >
          <i class="fas fa-check"></i>
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: false,
      button: true,
    },
    {
      name: "Reject",
      cell: (row) => (
        <>
          <button
            type="button"
            className="my-2 btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target={`#modal-rejected-${row.research_id}`}
          >
            <i class="fas fa-times"></i>
          </button>

          <div
            className="modal fade"
            id={`modal-rejected-${row.research_id}`}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Confirmation Message
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you're going to reject this research entitled "
                  {row.research_title}"?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={() => handleRejected(row.research_id)}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: false,
      button: true,
    },
  ];
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  useEffect(() => {
    getPendingResearch();
  }, [pendingResearchRefresh]);
  return (
    <>
      <Navbar logout={logout} />
      <Sidebar />
      {/* {!isResearchApproving ? (
        <DataTable
          columns={columns}
          data={pendingResearch}
          highlightOnHover
          pagination
          defaultSortFieldId={1}
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
      )} */}
      <div className="content-wrapper" style={{ backgroundColor: "white" }}>
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Pending Research</h1>
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
                    {!isResearchApproving ? (
                      <DataTable
                        columns={columns}
                        data={pendingResearch}
                        highlightOnHover
                        pagination
                        defaultSortFieldId={1}
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
                    {/* <DataTable
                      columns={columns}
                      data={pendingResearch}
                      highlightOnHover
                      pagination
                      defaultSortFieldId={1}
                    /> */}
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

export default PendingResearch;
