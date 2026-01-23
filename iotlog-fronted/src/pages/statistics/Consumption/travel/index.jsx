import { Button, Card, CardBody, CardHeader, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import moment from "moment";
import { Fetch, TextSpan } from "../../../../components";
import { TABLE, TBODY } from "../../../../components/Table";
import LoadingRows from "../../LoadingRows";
import ModalFilter from "../modal-filter";
import { convertPeriodToDate } from "../Utils";
import ItemRow from "./ItemRow";
import TableHeader from "./TableHeader";
import DownloadCSV from "./DownloadCSV";
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

const ConsumeByTravel = (props) => {
  const [data, setData] = React.useState();
  const [typeFuels, setTypesFuels] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFilterPress, setIsFilterPress] = React.useState(false);
  const [filterShow, setFilterShow] = React.useState({
    dateFilter: "1m",
    unit: "m³",
  });
  const [filter, setFilter] = React.useState({
    dateFilter: "1m",
    unit: "m³",
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
      `unit=${filterParams?.unit || filterShow?.unit}`,
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
        `period=${filterParams?.period || filterShow?.dateFilter}`
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

    Fetch.get(`/travel/statistics/consumptionvoyages?${filtersQuery.join("&")}`)
      .then((response) => {
        if (response.data?.voyages?.length) {
          setData(response.data?.voyages);
        }
        if (response.data?.typeFuels?.length) {
          setTypesFuels(response.data?.typeFuels);
        }
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

  return (
    <>
      <Card>
        <CardHeader>
          <Row between="xs" middle="xs" className="m-0">
            <ColumnFlex>
              <TextSpan apparence="s1">
                {intl.formatMessage({
                  id: "consume.total.travel",
                })}
              </TextSpan>
              <TextSpan apparence="p2">{getInfoData()}</TextSpan>
            </ColumnFlex>
            <Row className="m-0">
              <DownloadCSV
                listData={data}
                typeFuels={typeFuels}
              />
              <Button
                size="Tiny"
                status={isFiltered ? "Info" : "Basic"}
                onClick={() => setIsFilterPress((prevState) => !prevState)}
              >
                <EvaIcon name="funnel-outline" />
              </Button>
            </Row>

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
              <TableHeader typeFuels={typeFuels} unit={filterShow?.unit} />
              <TBODY>
                {data?.map((x, i) => (
                  <ItemRow key={i} item={x} index={i} typeFuels={typeFuels} />
                ))}
                <TableBenchmark itens={data} typeFuels={typeFuels} />
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

export default connect(mapStateToProps, undefined)(ConsumeByTravel);
