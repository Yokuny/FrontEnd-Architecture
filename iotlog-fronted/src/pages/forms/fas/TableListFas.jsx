import React from "react";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import Spinner from "@paljs/ui/Spinner";
import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { EvaIcon } from "@paljs/ui/Icon";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";

import {
  Fetch
} from "../../../components";
import Pagination from "../../../components/ListPaginated/Pagination";
import Sizenation from "../../../components/ListPaginated/Sizenation";
import { TableList } from "./TableList";
import TableFilter from "./TableList/TableFilter";
import ModalExport from "./components/ModalExport";


const ContainerItems = styled.div`
  min-width: 120px;
  margin-right: 30px;
`;


const TableListFas = (props) => {

  const [searchParams, setSearchParams] = useSearchParams();

  const [isExporting, setIsExporting] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const processedQueryRef = React.useRef([]);

  const navigate = useNavigate();
  const intl = useIntl();

  const size = searchParams.get("size");
  const currentPage = searchParams.get("page");
  const search = searchParams.get("search") || "";
  const dateStart = searchParams.get("dateStart");
  const dateEnd = searchParams.get("dateEnd") || "";
  const idVessel = searchParams.get("idVessel") || "";
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const planner = searchParams.get("planner") || "";
  const idEnterprise = props.enterprises?.length ? props.enterprises[0]?.id : null;

  React.useEffect(() => {
    if (size && currentPage && idEnterprise) {
      getData(size,
        currentPage,
        search,
        dateStart,
        dateEnd,
        idVessel,
        idEnterprise,
        status,
        planner,
        type
      );
    } else {
      updateQueryParam([
        ["page", 1],
        ["size", 5],
      ]);
    }
  }, [searchParams, idEnterprise]);

  const getData = (size,
    currentPage,
    search,
    dateStart,
    dateEnd,
    idVessel,
    idEnterprise,
    status,
    planner,
    type
  ) => {
    const query = []
    if (search) query.push(`search=${search}`);
    if (dateStart) query.push(`dateStart=${dateStart}`);
    if (dateEnd) query.push(`dateEnd=${dateEnd}`);

    if (dateStart && dateEnd &&
      new Date(dateStart) > new Date(dateEnd)) {
      toast.info(intl.formatMessage({ id: "date.end.is.before.date.start" }));
      return;
    }

    if (planner) query.push(`planner=${planner}`)
    if (idVessel) {
      idVessel.split(',').forEach(x => {
        query.push(`idVessel=${x}`)
      })
    };
    if (status) {
      status.split(',').forEach(x => {
        query.push(`status=${x}`);
      })
    }
    if (type) {
      type.split(',').forEach(x => {
        query.push(`type=${x}`);
      })
    }

    query.push(`page=${currentPage - 1}`);
    query.push(`size=${size}`);
    query.push(`idEnterprise=${idEnterprise}`);

    processedQueryRef.current = query;

    setIsLoading(true);
    Fetch.get(`/fas/list/filter-os?${query.join('&')}`)
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

  const exportFas = async (dateStart, dateEnd) => {
    setIsExporting(true);
    try {
      const formattedDateStart = moment(dateStart).format('YYYY-MM-DDT00:00:00.000Z');
      const formattedDateEnd = moment(dateEnd).format('YYYY-MM-DDT23:59:59.999Z');

      const response = await fetch(`${process.env.REACT_APP_URI_BASE}/fas/export-fas-csv?idEnterprise=${idEnterprise}&dateStart=${formattedDateStart}&dateEnd=${formattedDateEnd}`, {
        method: 'GET',
        headers: {
          token: localStorage.getItem('token'),
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });

      if (!response.ok) {
        setIsExporting(false);
        toast.error(intl.formatMessage({ id: "error.export" }));
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    catch (e) {

    } finally {
      setIsExporting(false);
    }
  }

  const onHandleFilter = (filter) => {
    const itensFilter = []
    const itensDelete = []
    if (filter?.search) {
      itensFilter.push(["search", filter.search]);
    } else {
      itensDelete.push("search");
    }
    if (filter?.dateStart) {
      itensFilter.push(["dateStart", moment(filter.dateStart).format('YYYY-MM-DDT00:00:00.000Z')]);
    } else {
      itensDelete.push("dateStart");
    }

    if (filter?.dateEnd) {
      itensFilter.push(["dateEnd", moment(filter.dateEnd).format('YYYY-MM-DDT23:59:59.999Z')]);
    } else {
      itensDelete.push("dateEnd");
    }
    if (filter?.idVessels?.length) {
      itensFilter.push(["idVessel", filter.idVessels]);
    } else {
      itensDelete.push("idVessel");
    }
    if (filter?.status?.length) {
      itensFilter.push(["status", filter.status]);
    } else {
      itensDelete.push("status");
    }
    if (filter?.type?.length) {
      itensFilter.push(["type", filter.type]);
    } else {
      itensDelete.push("type");
    }
    if (filter?.planner) {
      itensFilter.push(["planner", filter.planner.join(",")])
    } else {
      itensDelete.push("planner")
    }
    itensFilter.push(["page", 1]);

    updateQueryParam(itensFilter, itensDelete);
  }

  const totalItems = data?.pageInfo?.length ? (data?.pageInfo[0]?.count || 0) : 0;
  const hasMoreThanMinOptions = totalItems > 10;

  return (
    <>

      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader className="flex-between">
              <FormattedMessage id="service.management" />
              <Row key={nanoid(4)}>
                {isExporting
                  ? <div style={{ position: "relative", height: 30, width: 50 }}>
                    <Spinner style={{ backgroundColor: "transparent" }} />
                  </div>
                  : <Button size="Tiny"
                    appearance="ghost"
                    disabled={isExporting}
                    status="Basic"
                    className="flex-between mr-4"
                    onClick={() => setIsModalOpen(true)}>
                    <EvaIcon className="mr-1" name="download-outline" />
                    <FormattedMessage id="export" />
                  </Button>}
                <Button size="Tiny" className="flex-between mr-2" onClick={() => navigate(`/new-fas`)}>
                  <EvaIcon className="mr-1" name="file-add-outline" />
                  <FormattedMessage id="new.fas" />
                </Button>
              </Row>
            </CardHeader>
            <CardBody style={{ marginBottom: -17 }}>
              <TableFilter
                idEnterprise={idEnterprise}
                onHandleFilter={onHandleFilter}
              />

              <Row>
                <TableList
                  data={data}
                  isLoading={isLoading}
                  search={search}
                  query={processedQueryRef.current}
                />
              </Row>
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
        <ModalExport
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onExport={exportFas}
        />
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(TableListFas);

