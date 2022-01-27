import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../../Firebase";
import { useRef } from "react";

import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const Research_ri = ({ researchInchargeInfo }) => {
  const [inputs, setInputs] = useState({
    title: "",
    author: "",
    year: "",
    abstract: "",
    url: "",
  });

  const [keywords, setKeywords] = useState([]);

  // State
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const selectCollegeRef = useRef();
  const selectProgramRef = useRef();
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
      program: ["Bachelor of Medical and Biological Sciences"],
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
  //Function onChange
  const handleSelectedFile = (e) => {
    setFiles([...e.target.files]);
  };

  //destructure the (research title, research author, research year, research abstract, research keywords, research url )
  const { title, author, year, abstract, url } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const limitFileSize = 52428800;
      // const limitFileSize = 7340032;

      if (
        title &&
        author &&
        year &&
        abstract &&
        keywords &&
        selectedCollege &&
        selectedProgram &&
        files.length === 1 &&
        files[0].size < limitFileSize
      ) {
        const body = {
          title,
          author,
          year,
          abstract,
          keywords: keywords.map((keyword) => "" + keyword).toString(),
          url,
          college: selectedCollege,
          program: selectedProgram,
          ri_name: researchInchargeInfo.ri_name,
          ri_id: researchInchargeInfo.ri_id,
        };

        //sending request to server
        const add_pending_research_response = await fetch(
          "https://capstone-repository-server.herokuapp.com/research_incharge/research",
          {
            method: "POST",
            headers: {
              token: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        //get the actual data from the response if theres any
        const research_Data = await add_pending_research_response.json();
        console.log(research_Data);

        const id = research_Data.research_id;

        if (add_pending_research_response.status === 200) {
          // Codes on uploading the file below

          // selected file
          const file = files[0];

          // create a storage reference and make make folder name base on id of the research
          const storageRef = ref(storage, `${id}/${file.name}`);

          //upload file
          const uploadTask = uploadBytesResumable(storageRef, file);

          // update progress by listining to event -> state_changed
          uploadTask.on(
            "state_changed",
            (snapshot) =>
              setProgress(
                Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
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
                    "https://capstone-repository-server.herokuapp.com/research_incharge/research_url",
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
                    // clear all inputs, as well as the state
                    setProgress(0);
                    setFiles([]);
                    fileInputRef.current.value = "";
                    setInputs({
                      title: "",
                      author: "",
                      year: "",
                      abstract: "",
                      url: "",
                    });

                    setSelectedCollege("");
                    setSelectedProgram("");
                    selectCollegeRef.current.value = "";
                    selectProgramRef.current.value = "";

                    setKeywords([]);

                    toast.success(researchUpdateurl_message);
                  } else if (add_research_Url_response.status !== 200) {
                    toast.error("Error on updating research url");
                  }
                }
              });
            }
          );
        } else {
          toast.error("Research title already exist");
        }
      } else {
        if (
          files.length === 0 ||
          !title ||
          !author ||
          !year ||
          !abstract ||
          !selectedCollege ||
          !selectedProgram ||
          keywords.length === 0
        ) {
          toast.error("Fill In All Fields");
        }
        if (files[0].size > limitFileSize) {
          alert("The file Size Must Be No More Than 50MB!");
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <form onSubmit={onSubmitForm}>
        <div className="card">
          <div className="card-body">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Title"
                  value={title}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  className="form-control"
                  placeholder="Author"
                  value={author}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Year</label>
                <input
                  type="text"
                  name="year"
                  className="form-control"
                  id="inputEmail4"
                  placeholder="Year"
                  value={year}
                  onChange={onChange}
                  required
                />

                <div>
                  <label className="mt-4">Keywords</label>
                  <TagsInput
                    inputProps={{
                      placeholder: "Keywords",
                    }}
                    value={keywords}
                    onChange={(newTags) => setKeywords(newTags)}
                    required
                  />
                </div>
              </div>
              <div className="form-group col-md-6">
                <label>Abstract</label>
                <textarea
                  name="abstract"
                  className="form-control text-justify"
                  value={abstract}
                  onChange={onChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <div className="form-group col-md-6">
                <label>College Department</label>
                <select
                  className="form-select"
                  ref={selectCollegeRef}
                  onChange={handleSelectedCollege}
                >
                  <option value={selectedProgram}>
                    Select College Department
                  </option>
                  {colleges &&
                    colleges.map((college, index) => (
                      <option key={index} value={college.name}>
                        {college.name}
                      </option>
                    ))}
                </select>

                <div>
                  <label className="mt-4">Program</label>
                  <select
                    className="form-select"
                    ref={selectProgramRef}
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
              </div>

              <div className="col-md-6 mt-3">
                <progress
                  className="progress w-100 my-3"
                  value={progress}
                  max="100"
                ></progress>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  id="file"
                  onChange={handleSelectedFile}
                  required
                />

                <div className="mt-2">
                  <button type="submit" className="btn btn-primary mt-4">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Research_ri;
