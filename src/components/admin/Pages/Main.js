import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Main() {
  const [totalstudent, setTotalStudent] = useState([]);
  const [totalcapstone, setTotalCapstone] = useState([]);

  const totalStudent = async () => {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/total_student"
      );
      const data = await response.json();

      setTotalStudent(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const totalCapstone = async () => {
    try {
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/admin/total_capstone"
      );
      const data = await response.json();

      setTotalCapstone(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    totalStudent();
    totalCapstone();
  }, []);
  return (
    <>
      <div className="content-wrapper" style={{ backgroundColor: "white" }}>
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-3 col-6">
                <div className="small-box">
                  <div class="inner">
                    {totalstudent.map((item, index) => {
                      return (
                        <Link to="/ViewStudents" className="nav-link">
                          <h3 key={index} style={{ color: "black" }}>
                            {item.count}
                          </h3>
                        </Link>
                      );
                    })}
                    <h6>Total Student</h6>
                  </div>
                  <div className="icon">
                    <i className="fas fa-user"></i>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="small-box">
                  <div class="inner">
                    {totalcapstone.map((item, index) => {
                      return (
                        <Link to="/ViewCapstone" className="nav-link">
                          <h3 key={index} style={{ color: "black" }}>
                            {item.count}
                          </h3>
                        </Link>
                      );
                    })}
                    <h6>Total Capstone</h6>
                  </div>
                  <div className="icon">
                    <i className="fas fa-archive"></i>
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

export default Main;
