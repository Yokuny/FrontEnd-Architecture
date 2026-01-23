import { CardFooter, CardHeader } from "@paljs/ui/Card";
import { List, ListItem } from "@paljs/ui/List";
import React, { useEffect } from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import styled from "styled-components";
import { InputGroup } from "@paljs/ui/Input";
import { EvaIcon } from "@paljs/ui/Icon";
import { debounce } from "underscore";
import { nanoid } from "nanoid";
import { useIntl } from "react-intl";
import { createSearchParams, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import Sizenation from "./Sizenation";

const ContainerItems = styled.div`
  min-width: 120px;
  margin-right: 30px;
`;

const ContainerIcon = styled.a`
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
`;

const ListAdvancedFilterPaginated = ({
  data,
  renderItem,
  onPageChanged,
  filterOptions,
  totalItems = 0,
  startSize = 5,
  contentStyle = {},
  renderHeader = undefined,
  noShowHeader = false,
  disableInput = false,
}) => {
  const refSearch = React.useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const [size, setSize] = React.useState(
    searchParams.get("size") ? parseInt(searchParams.get("size")) : startSize
  );
  const [currentPage, setCurrentPage] = React.useState(
    searchParams.get("page") ? parseInt(searchParams.get("page")) : 1
  );
  const [text, setText] = React.useState(searchParams.get("search"));

  const intl = useIntl();

  const hasMoreThanMinOptions = totalItems > 10;

  useEffect(() => {
    refSearch.current.value = text;
    onPageChanged({ currentPage: currentPage, pageLimit: size, text });
  }, [text]);

  React.useEffect(() => {
    if (!disableInput) refSearch.current.focus();
  }, [disableInput]);

  const changeValue = debounce((value) => {
    setSearchParams(
      createSearchParams({ search: value, page: 1, size }).toString()
    );
    setCurrentPage(1);
    setText(value);
    refSearch.current.value = value;
  }, 600);

  const changePage = ({ currentPage }) => {
    setCurrentPage(currentPage);
    setSearchParams(
      createSearchParams({
        search: text || "",
        page: currentPage,
        size,
      }).toString()
    );
    onPageChanged({ currentPage, pageLimit: size, text });
  };

  const changeSize = (value) => {
    onPageChanged({
      currentPage: 1,
      pageLimit: value?.value,
      text,
    });
    setSize(value?.value);
    setCurrentPage(1);
    setSearchParams(
      createSearchParams({
        search: text || "",
        page: 1,
        size: value?.value,
      }).toString()
    );
  };

  return (
    <>
      {!noShowHeader && (
        <CardHeader>
          {renderHeader ? (
            renderHeader()
          ) : (
            <InputGroup fullWidth>
              <input
                ref={refSearch}
                placeholder={intl.formatMessage({ id: "search.placeholder" })}
                disabled={disableInput}
                type="text"
                onChange={(e) => changeValue(e.target.value)}
              />
              <ContainerIcon onClick={() => { }}>
                <EvaIcon name="search-outline" status="Basic" />
              </ContainerIcon>
            </InputGroup>
          )}
        </CardHeader>
      )}

      <List>
        {data?.map((item, index) => (
          <ListItem style={contentStyle} key={nanoid(5)}>
            {renderItem({ item, index })}
          </ListItem>
        ))}
      </List>

      <CardFooter>
        <Col breakPoint={{ md: 12 }}>
          <Row end>
            {hasMoreThanMinOptions && (
              <ContainerItems>
                <Sizenation
                  total={totalItems}
                  value={size}
                  onChange={changeSize}
                />
              </ContainerItems>
            )}
            <Pagination
              totalRecords={totalItems}
              pageLimit={size}
              pageNeighbours={1}
              onPageChanged={changePage}
              currentPage={currentPage}
            />
          </Row>
        </Col>
      </CardFooter>
    </>
  );
};

export default ListAdvancedFilterPaginated;
