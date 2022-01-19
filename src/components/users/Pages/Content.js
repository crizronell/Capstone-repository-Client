import React, { useEffect, useState } from "react";
import Research from "./Research";
function Content() {
  const [researchs, setResearchs] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("dassad");

  const getResearch = async () => {
    const response = await fetch(
      `https://capstone-repository-server.herokuapp.com/admin/get_research`
    );
    const data = await response.json();
    setResearchs(data);
    setSearch("");
  };

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setQuery(search);
  };
  useEffect(() => {
    getResearch();
  }, [query]);
  return (
    <>
      <div className="container-fluid mt-5 ">
        <form
          className="row d-flex justify-content-center g-3"
          onSubmit={onSubmit}
        >
          <div className="col-auto">
            <input
              className="form-control"
              type="text"
              placeholder="Search Capstone"
              value={search}
              onChange={updateSearch}
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-primary" type="submit">
              Search
            </button>
          </div>
        </form>
        {researchs
          .filter((value) => {
            if (query === "") {
              return value;
            } else if (
              value.research_title.toLowerCase().includes(query.toLowerCase())
            ) {
              return value;
            } else if (search.length === 0) {
              <h4>Not found !</h4>;
            }
          })
          .map((index) => (
            <Research
              key={index.research_id}
              title={index.research_title}
              author={index.research_author}
            />
          ))}
      </div>
    </>
  );
}

export default Content;
