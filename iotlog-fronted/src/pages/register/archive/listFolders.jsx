import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { EvaIcon } from "@paljs/ui/Icon";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";
import {
  Fetch,
  SpinnerFull
} from "../../../components";
import Pagination from "../../../components/ListPaginated/Pagination";
import Sizenation from "../../../components/ListPaginated/Sizenation";
import { ListTable } from "../../../components/Archive/ListTable";
import ModalCreateFolder from "../../../components/Archive/ModalCreateFolder";
import ModalViewQrCode from "../../../components/Archive/ModalVIewQrCode";


const ContainerItems = styled.div`
  min-width: 120px;
  margin-right: 30px;
`;


const ListFolders = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const size = searchParams.get("size");
  const currentPage = searchParams.get("page");
  const search = searchParams.get("search");

  const processedQueryRef = React.useRef();
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const [dataQrCode, setDataQrCode] = React.useState();

  const idEnterprise = props.enterprises?.length ? props.enterprises[0]?.id : localStorage.getItem('id_enterprise_filter');
  const [showCreateFolderModal, setCreateFolderModal] = React.useState(false);

  React.useEffect(() => {
    if (size && currentPage && idEnterprise) {
      getData(size, currentPage);
    } else {
      updateQueryParam([
        ["page", 1],
        ["size", 5]
      ]);
    }
  }, [searchParams, idEnterprise]);

  const getData = (size, currentPage) => {
    const query = []
    if (search) query.push(`search=${search}`);
    query.push(`page=${currentPage - 1}`);
    query.push(`size=${size}`);
    query.push(`idEnterprise=${idEnterprise}`);

    processedQueryRef.current = query;

    setIsLoading(true);
    Fetch.get(`/folder/list?${query.join('&')}`)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

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

  const onHandleFilter = (filter) => {
    const itensFilter = [];
    const itensDelete = [];
    if (filter?.search) {
      itensFilter.push(["search", filter.search]);
    } else {
      itensDelete.push("search");
    }

    itensFilter.push(["page", 1]);

    updateQueryParam(itensFilter, itensDelete);
  }

  const onCloseFolderModal = () => {
    setCreateFolderModal(false);
    getData(size, currentPage);
  }

  const totalItems = data?.pageInfo?.length ? (data?.pageInfo[0]?.count || 0) : 0;
  const hasMoreThanMinOptions = totalItems > 10;

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader className="flex-between">
              <FormattedMessage id="documents" />
              <Row>
                <Button size="Tiny" className="flex-between mr-2" onClick={() => setCreateFolderModal(true)}>
                  <EvaIcon className="mr-1" name="folder-add-outline" />
                  <FormattedMessage id="new.folder" />
                </Button>
              </Row>
            </CardHeader>
            <CardBody style={{ marginBottom: -17 }}>
              <Row>
                <ListTable
                  data={data}
                  isLoading={isLoading}
                  search={search}
                  query={processedQueryRef.current}
                  onOpenQRCode={(item) => setDataQrCode(item)}
                />
              </Row>

              <ModalCreateFolder
                show={showCreateFolderModal}
                setIsLoading={setIsLoading}
                onClose={() => onCloseFolderModal()}
              />
              {dataQrCode && <ModalViewQrCode
                show={true}
                folder={dataQrCode}
                onClose={() => setDataQrCode(undefined)} />}
              <SpinnerFull isLoading={isLoading} />
            </CardBody>
            <CardFooter>
              <Col breakPoint={{ md: 12 }}>
                <Row end="xs">
                  {hasMoreThanMinOptions && !!size && (
                    <ContainerItems>
                      <Sizenation
                        key={nanoid(4)}
                        total={totalItems}
                        value={Number(size)}
                        onChange={changeSize}
                      />
                    </ContainerItems>
                  )}
                  {!!size && !!totalItems && <Pagination
                    key={nanoid(4)}
                    totalRecords={totalItems}
                    pageLimit={Number(size)}
                    pageNeighbours={1}
                    onPageChanged={changePage}
                    currentPage={Number(currentPage)}
                  />}
                </Row>
              </Col>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(ListFolders);

