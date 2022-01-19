import React from "react";
import { Link } from "react-router-dom";
import "../custom-css/user.css";
const Research = ({ item }) => {
  return (
    <>
      <div className="d-flex justify-content-center pt-3 w-100">
        <div className="col-md-8">
          <div className="col-auto">
            <div className="card card_research">
              <div className="card-header">
                <p
                  className="card-text font-weight-bold"
                  style={{ color: "#0d6efd" }}
                >
                  {item.research_title}
                </p>
              </div>
              <div className="card-body">
                <p className="abstract-container p-1 text-justify">
                  {item.research_abstract}
                </p>
                <div className="text-wrap p-1">
                  Keywords:
                  <span className="font-weight-bold">
                    <span className="ml-1" style={{ color: "#0d6efd" }}>
                      {item.research_keywords
                        .split(",")
                        .map((keyword) => " " + keyword)
                        .toString()}
                    </span>
                  </span>
                </div>
                <div className="text-wrap p-1">
                  College:
                  <span className="font-weight-bold">
                    <span className="ml-1" style={{ color: "#0d6efd" }}>
                      {item.research_college}
                    </span>
                  </span>
                </div>
                <div className="text-wrap p-1">
                  Program:
                  <span className="font-weight-bold">
                    <span className="ml-1" style={{ color: "#0d6efd" }}>
                      {item.research_program}
                    </span>
                  </span>
                </div>
                <div className="col-auto float-right">
                  <Link
                    to={`/student/research/${item.research_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    View Research
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Research;
