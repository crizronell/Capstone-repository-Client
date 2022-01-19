import React, { useState } from "react";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];
  const [active, setActive] = useState(false);
  const [prevNum, setPrevNum] = useState();
  console.log(postsPerPage);
  console.log(totalPosts);

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePagination = (e, number) => {
    e.preventDefault();
    paginate(number);
    setActive(true);

    if (!prevNum) {
      setPrevNum(e.target.parentElement);
      e.target.parentElement.classList.add("active");
    } else {
      prevNum.classList.remove("active");
      setPrevNum(e.target.parentElement);
      e.target.parentElement.classList.add("active");
    }
  };

  return (
    <div className="col-lg-3 col-md-5 col-sm-6 container d-flex  justify-content-center">
      <nav class="pagination">
        <ul className="pagination d-flex flex-wrap">
          {pageNumbers.map((number) => (
            <li
              className="page-item pagination d-flex flex-wrap"
              key={number}
              style={{ overFlow: "hidden" }}
            >
              <a
                className="page-link"
                onClick={(e) => handlePagination(e, number)}
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
