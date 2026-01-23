import { Button, Card, CardBody, CardHeader, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { Fetch, TextSpan } from "../../../../components";
import { TABLE, TBODY } from "../../../../components/Table";
import LoadingRows from "../../LoadingRows";
import ModalFilter from "../modal-filter";
import { convertPeriodToDate } from "../Utils";
import ItemRow from "./ItemRow";
import TableHeader from "./TableHeader";
import TableBenchmark from "./TableBenchmark";

const ColumnFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardBodyStyled = styled(CardBody)`
  margin-bottom: 0px;
  max-height: calc(100vh - 300px);

  padding: 0px;
`

const ConsumeByMachine = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [typeFuels, setTypesFuels] = React.useState([]);
  const [isFilterPress, setIsFilterPress] = React.useState(false);
  const [filterShow, setFilterShow] = React.useState({
    dateFilter: "1m",
    unit: "m³",
  });
  const [filter, setFilter] = React.useState({
    dateFilter: "1m",
    unit: "m³",
  });
  const [orderColumn, setOrderColumn] = React.useState({
    column: "",
    order: "",
  });

  const intl = useIntl();

  React.useLayoutEffect(() => {
    if (props.isReady)
      getData({
        idEnterprise: props.enterprises?.length
          ? props.enterprises[0]?.id
          : undefined,
      });
  }, [props.enterprises]);

  const getData = (filterParams = undefined) => {
    setIsLoading(true);
    let filtersQuery = [
      `idEnterprise=${filterParams.idEnterprise}`,
      `unit=${filterParams?.unit || filter?.unit}`,
    ];

    if (filterParams?.dateMin || filterParams?.dateMax) {
      if (filterParams?.dateMin)
        filtersQuery.push(`dateMin=${filterParams?.dateMin}`);
      else filtersQuery.push(`dateMin=2021-01-01`);
      if (filterParams?.dateMax)
        filtersQuery.push(`dateMax=${filterParams?.dateMax}`);
      else filtersQuery.push(`dateMax=${moment().format("YYYY-MM-DD")}`);
    } else {
      filtersQuery.push(
        `period=${filterParams?.period || filter?.dateFilter}`
      );
    }

    if (filterParams?.filteredModel?.length) {
      filtersQuery = [
        ...filtersQuery,
        ...filterParams?.filteredModel?.map((x) => `idModel[]=${x}`),
      ];
    }
    if (filterParams?.filteredMachine?.length) {
      filtersQuery = [
        ...filtersQuery,
        ...filterParams?.filteredMachine?.map((x) => `idMachine[]=${x}`),
      ];
    }

    Fetch.get(`/travel/statistics/assetconsumption?${filtersQuery.join("&")}`)
      .then((response) => {
        if (response.data?.assets?.length) setData(response.data.assets);
        if (response.data?.typeFuels?.length) setTypesFuels(response.data.typeFuels);
        setIsLoading(false);
        setFilterShow(
          filterParams?.dateMin || filterParams?.dateMax
            ? {
              dateMin: filterParams?.dateMin,
              dateMax: filterParams?.dateMax,
              filteredModel: filterParams?.filteredModel,
              filteredMachine: filterParams?.filteredMachine,
              unit: filterParams?.unit || filterShow?.unit
            }
            : { dateFilter: filterParams?.period || filterShow?.dateFilter, unit: filterParams?.unit || filterShow?.unit }
        );
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChangeFilter = (prop, value) => {
    setFilter((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const getInfoData = () => {
    if (filterShow?.dateMin || filterShow?.dateMax) {
      return `${moment(filterShow.dateMin ?? "2021-01-01").format(
        intl.formatMessage({ id: "format.date" })
      )} - ${moment(filterShow.dateMax ?? moment().format("YYYY-MM-DD")).format(
        intl.formatMessage({ id: "format.date" })
      )}`;
    }

    return `${intl
      .formatMessage({
        id: filterShow?.dateFilter === "1m" ? "in.month" : "last.months",
      })
      .replace(
        "{0}",
        filterShow?.dateFilter?.replace("m", "")
      )} (${convertPeriodToDate(filterShow?.dateFilter)})`;
  };

  const isFiltered =
    filter?.filteredModel?.length ||
    filter?.filteredMachine?.length ||
    filter?.dateMin ||
    filter?.dateMax;

  const normalizeData = (data) => {
    if (orderColumn?.column) {
      return data?.sort((a, b) =>
        orderColumn.column?.includes('consumption.')
          ? orderColumn.order === "asc"
            ? a?.consumption[orderColumn.column.split('.')[1]] - b?.consumption[orderColumn.column.split('.')[1]]
            : b?.consumption[orderColumn.column.split('.')[1]] - a?.consumption[orderColumn.column.split('.')[1]]
          : orderColumn.order === "asc"
            ? a[orderColumn.column] - b[orderColumn.column]
            : b[orderColumn.column] - a[orderColumn.column]
      );
    }
    return data;
  };

  const itens = normalizeData(data);

  return (
    <>
      <Card>
        <CardHeader>
          <Row between="xs" middle="xs" style={{ margin: 0 }}>
            <ColumnFlex>
              <TextSpan apparence="s1">
                {intl.formatMessage({
                  id: "consume.total.machine",
                })}
              </TextSpan>
              <TextSpan apparence="p2">{getInfoData()}</TextSpan>
            </ColumnFlex>
            <Button
              size="Tiny"
              status={isFiltered ? "Info" : "Basic"}
              onClick={() => setIsFilterPress((prevState) => !prevState)}
            >
              <EvaIcon name="funnel-outline" />
            </Button>
            {isFilterPress && (
              <ModalFilter
                onFilter={getData}
                breakPointItens={{ md: 3 }}
                onClose={() => setIsFilterPress(false)}
                show={isFilterPress}
                onChange={onChangeFilter}
                filterData={filter}
              />
            )}
          </Row>
        </CardHeader>
        <CardBodyStyled>
          {isLoading ? (
            <TABLE>
              <TBODY>
                <LoadingRows />
              </TBODY>
            </TABLE>
          ) : (
            <TABLE>
              <TableHeader
                setOrderColumn={setOrderColumn}
                orderColumn={orderColumn}
                typeFuels={typeFuels}
                unit={filterShow?.unit}
              />
              <TBODY>
                {itens?.map((x, i) => (
                  <ItemRow key={i} item={x} typeFuels={typeFuels} index={i} />
                ))}
                {!!itens?.length && <TableBenchmark itens={itens} typeFuels={typeFuels} />}
              </TBODY>
            </TABLE>
          )}
        </CardBodyStyled>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(ConsumeByMachine);
