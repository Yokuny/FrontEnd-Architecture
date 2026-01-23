import { CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import React, { useEffect } from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import styled from "styled-components";
import { InputGroup } from "@paljs/ui/Input";
import { EvaIcon } from "@paljs/ui/Icon";
import { debounce } from "underscore";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import Sizenation from "../../components/ListPaginated/Sizenation";
import Pagination from "../../components/ListPaginated/Pagination";


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

const ListPaginatedNotifications = ({
  data,
  renderItem,
  onPageChanged,
  children,
  totalItems = 0,
  startSize = 5,
  renderFooter = () => { },
  renderHeader = undefined,
  noShowHeader = false,
  disableInput = false,
  isLoading = false
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
    }
  }, [searchParams]);

  useEffect(() => {
    if (isReady)
      onPageChanged({ currentPage, pageLimit: size, text: search });
  }, [isReady, search, size, currentPage]);

  const changeValue = debounce((value) => {
    updateQueryParam([
      ["page", 1],
      ["search", value]
    ], value === "" ? ["search"] : []);
  }, 600);

  const changeSize = (value) => {
    updateQueryParam([
      ["page", 1],
      ["size", value?.value]
    ]);
  }

  const changePage = ({ currentPage }) => {
    updateQueryParam([
      ["page", currentPage],
    ]);
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

      <CardBody>
        {children}
        {data?.map((item, index) => (
          <Col breakPoint={{ xs: 12 }} key={index}>
            {renderItem({ item, index })}
          </Col>
        ))}
      </CardBody>


      <CardFooter style={{ minHeight: '4rem' }}>
        <Col breakPoint={{ md: 12 }}>
          <Row between="xs">
            {renderFooter()}
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
          </Row>
        </Col>
      </CardFooter>
    </>
  );
};

export default ListPaginatedNotifications;
