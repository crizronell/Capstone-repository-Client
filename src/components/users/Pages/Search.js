import React, { useState, useEffect, useRef } from "react";
import Pagination from "./Pagination";
import Research from "./Research";
import "../custom-css/user.css";
import YearPicker from "react-year-picker";
import "react-year-picker/lib/components/YearInput";

const Search = () => {
  const [loading, setLoading] = useState(false);

  // fetch the research
  const [research, setResearch] = useState([]);

  // search tearm by the user
  const [searchTerm, setSearchTerm] = useState("");

  // filtered  result of the search
  const [searchResults, setSearchResult] = useState([]);

  // display error message "Not found !" if the user already search something with no result
  const [wasSearch, setWasSearch] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [researchPerPage] = useState(2);

  // if the user search again it focus on the first page of the pagination
  const [isSearchAgain, setIsSearchAgain] = useState(false);

  // filter the year of research or capstone
  const [yearToFilter, setYearToFilter] = useState("");

  // Bases if the user will filtered again the search result that have been not filtered by year
  const [yearToFilterAgain, setYearToFilterAgain] = useState(false);

  // result of the search and not filtered by year
  const [searchResultNotFilteredByYear, setSearchResultNotFilteredByYear] =
    useState([]);

  // search input ref
  const searchInputRef = useRef(null);

  // state for reloading
  const [reloadSearch, setReloadSearch] = useState(false);
  const [reloadfilterYear, setReloadFilterYear] = useState(false);

  // if the user click search button or searching it will display the filter by year funtion
  const [showFilterYearPicker, setshowFilterYearPicker] = useState(false);

  const onChange = (date) => {
    console.log(date);
    setYearToFilter(date);
  };

  useEffect(() => {
    const loadResearch = async () => {
      setLoading(true);
      const response = await fetch(
        "https://capstone-repository-server.herokuapp.com/student/research",
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.status === 200) {
        setResearch(data);
        setLoading(false);

        if (localStorage.getItem("searchTerm")) {
          setSearchTerm(localStorage.getItem("searchTerm"));
          setReloadSearch((prev) => !prev);
          if (localStorage.getItem("yearToFilter")) {
            setYearToFilter(localStorage.getItem("yearToFilter"));
            setReloadFilterYear((prev) => !prev);
          }
        }
      }
    };
    loadResearch();
  }, []);

  // reload search useEffect
  useEffect(() => {
    // do search filter based from localstorage searchterm
    searchInputRef.current.value = localStorage.getItem("searchTerm");
    if (localStorage.getItem("searchTerm")) {
      const result = research.filter((value) => {
        if (localStorage.getItem("searchTerm") === "") return value;
        else if (
          value.research_title
            .toLowerCase()
            .includes(localStorage.getItem("searchTerm").toLowerCase()) ||
          value.research_keywords
            .toLowerCase()
            .includes(localStorage.getItem("searchTerm").toLowerCase()) ||
          value.research_abstract
            .toLowerCase()
            .includes(localStorage.getItem("searchTerm").toLowerCase()) ||
          value.research_author
            .toLowerCase()
            .includes(localStorage.getItem("searchTerm").toLowerCase()) ||
          value.research_program
            .toLowerCase()
            .includes(localStorage.getItem("searchTerm").toLowerCase()) ||
          value.research_college
            .toLowerCase()
            .includes(localStorage.getItem("searchTerm").toLowerCase())
        ) {
          return value;
        }
      });

      if (result) {
        setSearchResult(result);
        setSearchResultNotFilteredByYear(result);
        setIsSearchAgain(!isSearchAgain);
        setCurrentPage(1);
        setshowFilterYearPicker(true);

        if (searchTerm === "") {
          setSearchResult([]);
          setshowFilterYearPicker(false);
        }
      }

      // do filter year again
      let filterResults = [];
      console.log(yearToFilter);
      console.log(localStorage.getItem("yearToFilter"));
      if (!yearToFilterAgain) {
        filterResults = searchResults.filter((value) => {
          if (yearToFilter === "") return value;
          else if (value.research_year.toString() === yearToFilter.toString()) {
            return value;
          }
        });
      } else if (yearToFilterAgain) {
        filterResults = searchResultNotFilteredByYear.filter((value) => {
          if (yearToFilter === "") return value;
          else if (value.research_year.toString() === yearToFilter.toString()) {
            return value;
          }
        });
      }

      if (filterResults) {
        setSearchResult(filterResults);
        setYearToFilterAgain(true);
        setIsSearchAgain(!isSearchAgain);
        setCurrentPage(1);
      }
    }
  }, [reloadSearch, reloadfilterYear, research]);

  const onSubmitSearch = (e) => {
    e.preventDefault();

    localStorage.setItem("searchTerm", searchTerm);

    if (!loading) {
      const result = research.filter((value) => {
        if (searchTerm === "") return value;
        else if (
          value.research_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          value.research_keywords
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          value.research_abstract
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          value.research_college
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          value.research_program
            .toLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) ||
          value.research_author
            .toLowerCase()
            .includes(searchTerm.toLocaleLowerCase())
        ) {
          return value;
        }
      });

      if (result) {
        setSearchResult(result);
        setSearchResultNotFilteredByYear(result);
        setWasSearch(true);
        setIsSearchAgain(!isSearchAgain);
        setCurrentPage(1);
        setshowFilterYearPicker(true);

        if (searchTerm === "") {
          setSearchResult([]);
          setshowFilterYearPicker(false);
        }
      }
    }
  };

  const filterYear = (e) => {
    e.preventDefault();
    localStorage.setItem("yearToFilter", yearToFilter);

    if (!loading) {
      console.log(currentResearch);
      let result = [];
      console.log(yearToFilter);
      if (!yearToFilterAgain) {
        result = searchResults.filter((value) => {
          if (yearToFilter === "") return value;
          else if (value.research_year.toString() === yearToFilter.toString()) {
            return value;
          }
        });
      } else if (yearToFilterAgain) {
        result = searchResultNotFilteredByYear.filter((value) => {
          if (yearToFilter === "") return value;
          else if (value.research_year.toString() === yearToFilter.toString()) {
            return value;
          }
        });
      }

      if (result) {
        setSearchResult(result);
        setYearToFilterAgain(true);
        setIsSearchAgain(!isSearchAgain);
        setCurrentPage(1);
      }
    }
  };

  // get current research
  const indexOfLastResearch = currentPage * researchPerPage;
  const indexOfFirstResearch = indexOfLastResearch - researchPerPage;
  const currentResearch = searchResults.slice(
    indexOfFirstResearch,
    indexOfLastResearch
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="wrapper">
        <div className="container-fluid mt-5 ">
          <form
            onSubmit={onSubmitSearch}
            className="d-flex justify-content-center"
          >
            <div className="form-group col-md-5 d-flex">
              <input
                type="text"
                class="form-control"
                placeholder="Search Term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={searchInputRef}
              />
              <div className="col-auto">
                <button className="btn btn-primary" type="submit">
                  <i class="fa fa-search"></i>
                </button>
              </div>
            </div>
          </form>
          <div className="d-flex justify-content-center">
            <div className="form-group col-md-5 yr">
              {showFilterYearPicker && currentResearch && (
                <div className="d-flex justify-content-center ">
                  <YearPicker onChange={onChange} style={{ width: "10rem" }} />
                  <div className="col-auto">
                    <button
                      onClick={() => filterYear()}
                      className="btn btn-success ml-2"
                    >
                      Filter by Year
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {searchResults &&
            currentResearch.map((item) => (
              <Research
                title={item.research_title}
                year={item.research_year}
                item={item}
              />
            ))}
          {searchResults.length === 0 && wasSearch && (
            <>
              <div className="row d-flex justify-content-center pt-3">
                <div className="col-lg-3 col-md-5 col-sm-6">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="text-danger text-center">
                        No Result Found
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {searchResults.length > 0 && (
            <>
              <div className="container-fluid">
                <div className="d-flex justify-content-center pt-3">
                  <Pagination
                    postsPerPage={researchPerPage}
                    totalPosts={searchResults.length}
                    paginate={paginate}
                    isSearchAgain={isSearchAgain && isSearchAgain}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
