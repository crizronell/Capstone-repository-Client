import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Navbar from "../Navbar/Navbar";
import bg from "../../../assets/bg2.jpg";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const ResearchDetails = ({ setAuthUser }) => {
  const { id } = useParams();
  const [researchDetails, setResearchDetails] = useState("");
  const [viewResearch, setViewResearch] = useState(false);

  // states for pdf-viewer
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };
  useEffect(() => {
    document.body.style.backgroundImage = `url('${bg}')`;
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";
  }, []);
  useEffect(() => {
    //Disable rightclick on the whole document
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    const loadResearchDetails = async () => {
      const response = await fetch(
        `https://capstone-repository-server.herokuapp.com/student/research/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      console.log(data);
      if (response.status === 200) {
        setResearchDetails(data);
      }
    };
    loadResearchDetails();
  }, []);

  // Disable the PrtScr
  function stopPrntScr() {
    var inpFld = document.createElement("input");
    inpFld.setAttribute("value", ".");
    inpFld.setAttribute("width", "0");
    inpFld.style.height = "0px";
    inpFld.style.width = "0px";
    inpFld.style.border = "0px";
    document.body.appendChild(inpFld);
    inpFld.select();
    document.execCommand("copy");
    inpFld.remove(inpFld);
  }
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location = "/User-Login";
    setAuthUser(false);
  };

  return (
    <>
      <Navbar logout={logout} />
      <div className="container-fluid mt-2">
        <div className="row ">
          <div class="col-sm-5">
            <div className="card">
              <h5 className="card-header">Title</h5>
              <div className="card-body">
                <h5 className="card-title">{researchDetails.research_title}</h5>
              </div>
            </div>

            <div className="card">
              <h5 className="card-header">Author</h5>
              <div className="card-body">
                <h5 className="card-title">
                  {researchDetails.research_author}
                </h5>
              </div>
            </div>
            <div className="card">
              <h5 className="card-header">Year</h5>
              <div className="card-body">
                <h5 className="card-title">{researchDetails.research_year}</h5>
              </div>
            </div>

            <div>
              <div className="card ">
                <h5 className="card-header">
                  Abstract
                  <div className="float-right">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus" />
                    </button>
                  </div>
                </h5>
                <div className="card-body">
                  <p className="text-justify">
                    {researchDetails.research_abstract}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h5 className="card-header">Keywords</h5>
              <div className="card-body">
                <p className="text-justify">
                  {researchDetails.research_keywords}
                </p>
              </div>
            </div>

            <div className="card">
              <h5 className="card-header">College</h5>
              <div className="card-body">
                <p className="text-justify">
                  {researchDetails.research_college}
                </p>
              </div>
            </div>

            <div className="card">
              <h5 className="card-header">Program</h5>
              <div className="card-body">
                <p className="text-justify">
                  {researchDetails.research_program}
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-7">
            <div className="col-auto d-flex justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => setViewResearch(!viewResearch)}
              >
                View Research
              </button>
            </div>
            <div className="pdf-container d-flex justify-content-center">
              {viewResearch && (
                <>
                  <Document
                    className="pdf-container card-header rounded"
                    file={researchDetails.research_url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <Page pageNumber={pageNumber} />
                    <div className=" ">
                      <div className="row d-flex justify-content-center">
                        <div className="col-auto">
                          <button
                            className="btn btn-primary"
                            onClick={() => prevPage()}
                            disabled={pageNumber === 1}
                          >
                            Prev
                          </button>
                        </div>
                        <div className="col-auto">
                          <button
                            className="btn btn-primary"
                            onClick={() => nextPage()}
                            disabled={pageNumber === numPages}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </Document>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchDetails;
