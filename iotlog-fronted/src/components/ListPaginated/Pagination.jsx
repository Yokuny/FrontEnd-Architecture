import React from "react";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import TextSpan from "../Text/TextSpan";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

const Pagination = (props) => {
  let {
    totalRecords = null,
    pageLimit = 30,
    pageNeighbours = 0,
    currentPage = 1,
  } = props;

  const totalTruncated = Math.trunc(totalRecords / pageLimit);
  const divided = totalRecords / pageLimit;

  const diffTruncated = divided - totalTruncated;

  let totalPages = diffTruncated > 0
    ? totalTruncated + 1
    : totalTruncated;

  const gotoPage = (page) => {
    const { onPageChanged = (f) => f } = props;

    const currentPageFinded = Math.max(0, Math.min(page, totalPages));

    // const paginationData = {
    //   currentPage,
    //   totalPages,
    //   pageLimit,
    //   totalRecords,
    // };
    onPageChanged({ currentPage: currentPageFinded });
  };

  const handleClick = (page) => {
    gotoPage(page);
  };

  const handleMoveLeft = () => {
    gotoPage(currentPage - pageNeighbours * 2 - 1);
  };

  const handleMoveRight = () => {
    gotoPage(currentPage + pageNeighbours * 2 + 1);
  };

  const fetchPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = currentPage - pageNeighbours;
      const rightBound = currentPage + pageNeighbours;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  if (!totalRecords) return null;

  if (totalPages === 1) return null;

  const pages = fetchPageNumbers();
  return (
    <>
      {pages.map((page, index) => {
        if (page === LEFT_PAGE)
          return (
            <Button
              onClick={handleMoveLeft}
              status="Basic"
              size="Tiny"
              key={index}
              className="ml-2"
            >
              <EvaIcon status="Basic" name="arrowhead-left-outline" />
            </Button>
          );

        if (page === RIGHT_PAGE)
          return (
            <Button
              onClick={handleMoveRight}
              status="Basic"
              size="Tiny"
              key={index}
              className="ml-2"
            >
              <EvaIcon status="Basic" name="arrowhead-right-outline" />
            </Button>
          );

        return (
          <Button
            key={index}
            status={currentPage === page ? "Primary" : "Basic"}
            size="Tiny"
            className="ml-2"
            onClick={() => handleClick(page)}
          >
            <TextSpan apparence="s2">{page}</TextSpan>
          </Button>
        );
      })}
    </>
  );
};

export default Pagination;
