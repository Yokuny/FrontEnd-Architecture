import { CardFooter, CardHeader } from "@paljs/ui/Card";
import { List, ListItem } from "@paljs/ui/List";
import React, { useEffect, useCallback } from "react";
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

const ListPaginated = ({
  data,
  renderItem,
  onPageChanged,
  totalItems = 0,
  startSize = 5,
  contentStyle = {},
  renderHeader = undefined,
  noShowHeader = false,
  disableInput = false,
  isLoading = false,
  children
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReady, setIsReady] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [size, setSize] = React.useState(startSize);
  const search = searchParams.get("search") || "";

  const intl = useIntl();

  const hasMoreThanMinOptions = totalItems > 10;


  useEffect(() => {
    onPageChanged({ currentPage, pageLimit: size, text: search });
  }, [isReady, search, size, currentPage]);

  const changeValue = debounce((value) => {
    updateQueryParam([
      ["search", value]
    ], value === "" ? ["search"] : []);
  }, 600);

  const changeSize = (value) => {
    setCurrentPage(1);
    setSize(value.value);
  }

  const changePage = ({ currentPage }) => {
    setCurrentPage(currentPage ? currentPage : 1);
  };

  const updateQueryParam = (listValues, listDelete = []) => {
    const newSearchParams = new URLSearchParams(searchParams);
    for (const item of listValues || []) {
      newSearchParams.set(item[0], item[1]);
    }
    for (const item of listDelete || []) {
      newSearchParams.delete(item);
    }
    if (listValues.length || listDelete.length) {
      setSearchParams(newSearchParams);
    }
  };

  return (
    <>
      {!noShowHeader &&
        <CardHeader>
          {renderHeader ? renderHeader() : <InputGroup fullWidth>
            <input
              placeholder={intl.formatMessage({ id: "search.placeholder" })}
              disabled={disableInput}
              type="text"
              onChange={(e) => changeValue(e.target.value)}
              defaultValue={search}
              readOnly={isLoading}
            />
            <ContainerIcon onClick={() => { }}>
              <EvaIcon name="search-outline" status="Basic" />
            </ContainerIcon>
          </InputGroup>}
        </CardHeader>
      }

      {children ? children : null}

      <List>
        {data?.map((item, index) => (
          <ListItem style={contentStyle} key={nanoid(5)}>
            {renderItem({ item, index })}
          </ListItem>
        ))}
      </List>

      <CardFooter>
        <Col breakPoint={{ md: 12 }}>
          <Row end="xs">
            {hasMoreThanMinOptions && (
              <ContainerItems>
                <Sizenation
                  total={totalItems}
                  value={Number(size)}
                  onChange={changeSize}
                />
              </ContainerItems>
            )}
            <Pagination
              totalRecords={totalItems}
              pageLimit={Number(size)}
              pageNeighbours={1}
              onPageChanged={changePage}
              currentPage={Number(currentPage)}
            />
          </Row>
        </Col>
      </CardFooter>
    </>
  );
};

export default ListPaginated;
