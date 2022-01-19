import React, { useState } from "react";
import { toast } from "react-toastify";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import "../custom-css/admin.css";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "../../../Firebase";
function EditResearch({ row, refresh, setRefresh, setIsEditingResearch }) {
  // state edit form inputs in modal
  const [inputs, setInputs] = useState({
    title: "",
    author: "",
    year: "",
    abstract: "",
    url: "",
  });
  const [keywords, setKeywords] = useState([]);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);

  //Function onChange for file input
  const handleSelectedFile = (e) => {
    setFiles([...e.target.files]);
  };

  // function onchange for form input
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  //destructure the (research title, research author, research year, research abstract, research keywords, research url )
  const { title, author, year, abstract, url } = inputs;

  // state that stores the id of the research to be edit
  const [researchIdToEdit, setResearchIdToEdit] = useState("");

  // state for college and program select elements
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programs, setPrograms] = useState([]);

  const [colleges, setColleges] = useState([
    {
      name: "College of Accounting and Business Education",
      program: [
        "Bachelor of Science in Accountancy",
        "Bachelor of Science in Management Accounting",
        "Bachelor of Science in Accounting Information System",
        "Bachelor of Science in Business Administration",
      ],
    },
    {
      name: "College of Arts and Humanities",
      program: [
        "Bachelor of Arts in Communication",
        "Bachelor of Arts in English Language Studies",
        "Bachelor of Arts in Psychology",
        "Bachelor of Arts in Philosophy",
      ],
    },
    {
      name: "College of Computer Studies",
      program: [
        "Bachelor of Science in Computer Science",
        "Bachelor of Science in Information Systems",
        "Bachelor of Science in Information Technology",
      ],
    },
    {
      name: "College of Engineering and Architecture",
      program: [
        "Bachelor of Science in Computer Engineering",
        "Bachelor of Science in Electronics Engineering",
        "Bachelor of Science in Civil Engineering",
        "Bachelor of Science in Architecture",
      ],
    },
    {
      name: "College of Human and Environmental Sciences and Food Studies",
      program: [
        "Bachelor of Science in Nutrition and Dietetics",
        "Bachelor of Science in Hotel and Restaurant Management",
        "Bachelor of Science in Tourism Management",
      ],
    },
    {
      name: "College of Medical and Biological Sciences",
      program: ["Bachelor of Science in Medical Technology"],
    },
    {
      name: "College of Music",
      program: [
        "Bachelor of Music Major in Performance",
        "Bachelor of Music Major in Music education",
      ],
    },
    {
      name: "College of Nursing",
      program: ["Bachelor of Science Nursing"],
    },
    {
      name: "College of Pharmacy and Chemistry",
      program: [
        "Bachelor of Science in Pharmacy",
        "Bachelor of Science in Clinical Pharmacy",
      ],
    },
    {
      name: "College of Teacher Education",
      program: [
        "Bachelor of Early Childhood Education",
        "Bachelor of Elementary Education",
        "Bachelor of Special Needs Education",
        "Bachelor of Physical Education",
        "Bachelor of Secondary Education",
      ],
    },
  ]);

  const handleSelectedCollege = (e) => {
    if (e.target.value !== "") {
      setSelectedCollege(e.target.value);
      setSelectedProgram("");
      setPrograms(
        colleges.find((college) => college.name === e.target.value).program
      );
    } else {
      setSelectedCollege("");
      setPrograms([]);
      setSelectedProgram("");
    }
  };

  const handleEditResearch = async (e) => {
    e.preventDefault();

    const limitFileSize = 52428800;
    // const limitFileSize = 7340032;
    if (files.length === 0) {
      try {
        if (
          title &&
          author &&
          year &&
          abstract &&
          keywords.length > 0 &&
          selectedCollege &&
          selectedProgram
        ) {
          const body = {
            id: researchIdToEdit,
            title,
            author,
            year,
            abstract,
            keywords: keywords.map((keyword) => "" + keyword).toString(),
            url,
            college: selectedCollege,
            program: selectedProgram,
          };

          //sending request to server, to update research
          const edit_research_response = await fetch(
            "https://capstone-repository-server.herokuapp.com/admin/research_edit",
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
          const research_update_message = await edit_research_response.json();
          console.log(research_update_message);

          if (edit_research_response.status === 200) {
            setRefresh(!refresh);

            toast.success("Research updated successfully!");
          }
        } else {
          toast.error("Fill in all fields.");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      if (files.length === 1 && files[0].size < limitFileSize) {
        if (
          title &&
          author &&
          year &&
          abstract &&
          keywords.length > 0 &&
          selectedCollege &&
          selectedProgram
        ) {
          setIsEditingResearch(true);
          // edit with file
          const storageRef = ref(storage, researchIdToEdit);

          console.log("trigger..");
          console.log("file length = ", files.length);
          console.log("file size = ", files[0].size);

          // fetch file from the storage
          listAll(storageRef)
            .then((res) => {
              res.items.forEach((itemRef) => {
                const deleteFileRef = ref(storage, itemRef.fullPath);

                // Delete the file
                deleteObject(deleteFileRef)
                  .then(async () => {
                    // trigger when file is deleted is successfully
                    console.log("delete file successfully");

                    try {
                      const body = {
                        id: researchIdToEdit,
                        title,
                        author,
                        year,
                        abstract,
                        keywords: keywords
                          .map((keyword) => "" + keyword)
                          .toString(),
                        url,
                        college: selectedCollege,
                        program: selectedProgram,
                      };

                      //sending request to server
                      const edit_research_response = await fetch(
                        "https://capstone-repository-server.herokuapp.com/admin/research_edit",
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
                      const research_Data = await edit_research_response.json();
                      console.log(research_Data);

                      const id = research_Data.research_id;

                      if (edit_research_response.status === 200) {
                        // Codes on uploading the file below

                        // selected file
                        const file = files[0];

                        // create a storage reference and make make folder name base on id of the research
                        const storageRef = ref(storage, `${id}/${file.name}`);

                        //upload file
                        const uploadTask = uploadBytesResumable(
                          storageRef,
                          file
                        );

                        // update progress by listining to event -> state_changed
                        uploadTask.on(
                          "state_changed",
                          (snapshot) =>
                            setProgress(
                              Math.round(
                                (snapshot.bytesTransferred /
                                  snapshot.totalBytes) *
                                  100
                              )
                            ),
                          (err) => console.error(err),
                          () => {
                            // triggered when the upload is successful

                            // Get the download url of the uploaded file
                            getDownloadURL(storageRef).then(async (url) => {
                              if (url) {
                                // Add download url in a specific research in the database by updating the research url column in the research table in the database
                                const add_research_Url_response = await fetch(
                                  "https://capstone-repository-server.herokuapp.com/admin/research_url",
                                  {
                                    method: "PUT",
                                    headers: {
                                      token: localStorage.getItem("token"),
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ id, url }),
                                  }
                                );

                                // Get the response of the server regarding the update which is a message
                                const researchUpdateurl_message =
                                  await add_research_Url_response.json();

                                if (add_research_Url_response.status === 200) {
                                  // clear progress state
                                  setProgress(0);
                                  setFiles([]);
                                  setIsEditingResearch(false);

                                  document.getElementById(`file-${id}`).value =
                                    "";
                                  toast.success(
                                    "Research updated successfully!"
                                  );
                                } else if (
                                  add_research_Url_response.status !== 200
                                ) {
                                  toast.error("Error on updating research url");
                                }
                              }
                            });
                          }
                        );
                      }
                    } catch (err) {
                      console.error(err.message);
                    }
                  })
                  .catch((error) => {
                    // trigger when theres error
                    console.log("Error occurued when deleting the file");
                  });
              });
            })
            .catch((err) => {
              console.log("Error in fetching file");
            });
        } else {
          toast.error("fill in all fields");
        }
      } else {
        alert("The file size must be no more than 50MB!");
      }
    }
  };
  // set the state of the inputs title, author, year, abstract, keywords, url  based on the research information
  const setInputValue = (individual_research) => {
    setInputs({
      title: individual_research.research_title,
      author: individual_research.research_author,
      year: individual_research.research_year,
      abstract: individual_research.research_abstract,
      keywords: individual_research.research_keywords,
      url: individual_research.research_url,
    });

    setKeywords(individual_research.research_keywords.split(","));

    setSelectedCollege(individual_research.research_college);
    setSelectedProgram(individual_research.research_program);

    setPrograms(
      colleges.find(
        (college) => college.name === individual_research.research_college
      ).program
    );
    document.getElementById(
      `select-college-${individual_research.research_id}`
    ).value = individual_research.research_college;
    document.getElementById(
      `select-program-${individual_research.research_id}`
    ).value = individual_research.research_program;

    setFiles([]);
    document.getElementById(`file-${individual_research.research_id}`).value =
      "";

    setResearchIdToEdit(individual_research.research_id);
  };
  return (
    <>
      <button
        type="button"
        className="btn btn-warning"
        onClick={() => setInputValue(row)}
        data-bs-toggle="modal"
        data-bs-target={`#modal-research1-${row.research_id}`}
        data-bs-dismiss=""
      >
        Edit
      </button>

      {/* modal */}
      <div
        className="modal fade"
        id={`modal-research1-${row.research_id}`}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Research</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* research edit form */}
              <form onSubmit={handleEditResearch}>
                <div className="d-flex">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="form-control my-2"
                    value={title}
                    required
                    onChange={(e) => onChange(e)}
                  ></input>
                </div>

                <div className="d-flex">
                  <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    className="form-control my-2"
                    value={author}
                    required
                    onChange={(e) => onChange(e)}
                  ></input>
                </div>

                <div className="d-flex">
                  <input
                    type="text"
                    name="year"
                    placeholder="Year"
                    className="form-control my-2"
                    value={year}
                    required
                    onChange={(e) => onChange(e)}
                  ></input>
                </div>

                <div className="d-flex">
                  <textarea
                    className="form-control my-2"
                    placeholder="Abstract"
                    rows="5"
                    name="abstract"
                    value={abstract}
                    required
                    onChange={(e) => onChange(e)}
                  ></textarea>
                </div>

                <div className="d-flex">
                  <TagsInput
                    type
                    name="keywords"
                    inputProps={{
                      placeholder: "Keywords",
                    }}
                    value={keywords}
                    onChange={(newTags) => setKeywords(newTags)}
                  />
                </div>

                <div className="d-flex">
                  <select
                    id={`select-college-${row.research_id}`}
                    className="form-select mt-3"
                    onChange={handleSelectedCollege}
                  >
                    <option value="">Select College Department</option>
                    {colleges &&
                      colleges.map((college, index) => (
                        <option key={index} value={college.name}>
                          {college.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="d-flex">
                  <select
                    value={selectedProgram}
                    id={`select-program-${row.research_id}`}
                    className="form-select mt-3"
                    disabled={selectedCollege ? false : true}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                  >
                    <option value="">Select Program</option>
                    {programs &&
                      programs.map((program, index) => (
                        <option key={index} value={program}>
                          {program}
                        </option>
                      ))}
                  </select>
                </div>

                <progress
                  className="progress w-100 my-2"
                  value={progress}
                  max="100"
                ></progress>

                <div className="d-flex justify-content-between">
                  <input
                    type="file"
                    name="file"
                    id={`file-${row.research_id}`}
                    accept=".pdf"
                    onChange={handleSelectedFile}
                  />

                  <button
                    className="btn btn-success"
                    type="submit"
                    data-bs-dismiss="modal"
                  >
                    Edit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditResearch;
