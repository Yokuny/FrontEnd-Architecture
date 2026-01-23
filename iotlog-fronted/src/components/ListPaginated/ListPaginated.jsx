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
import { useSearchParams } from "react-router-dom";
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
  children,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReady, setIsReady] = React.useState(false);

  const size = Number(searchParams.get("size") || startSize);
  const currentPage = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  const intl = useIntl();

  const hasMoreThanMinOptions = totalItems > 10;

  useEffect(() => {
    const size = searchParams.get("size");
    const currentPage = searchParams.get("page");

    if (!size && !currentPage) {
      setSearchParams((searchParams) => {
        searchParams.set("size", 5);
        searchParams.set("page", 1);

        return searchParams;
      });
    }
    setIsReady(true);

    return () => {
      setIsReady(false);
    };
  }, [searchParams]);

  useEffect(() => {
    if (isReady) onPageChanged({ currentPage, pageLimit: size, text: search });
  }, [isReady, search, size, currentPage]);

  const changeValue = debounce((value) => {
    updateQueryParam(
      [
        ["page", 1],
        ["search", value],
      ],
      value === "" ? ["search"] : []
    );
  }, 600);

  const changeSize = (value) => {
    updateQueryParam([
      ["page", 1],
      ["size", value?.value],
    ]);
  };

  const changePage = ({ currentPage }) => {
    updateQueryParam([["page", currentPage]]);
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
      {!noShowHeader && (
        <CardHeader>
          {renderHeader ? (
            renderHeader()
          ) : (
            <InputGroup fullWidth>
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
            </InputGroup>
          )}
        </CardHeader>
      )}

      {children ? children : null}

      <List>
        {data?.map((item, index) => (
          <ListItem style={contentStyle} key={nanoid(5)}>
            {renderItem({ item, index })}
          </ListItem>
        ))}
      </List>

      <CardFooter style={{ minHeight: "4rem" }}>
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
