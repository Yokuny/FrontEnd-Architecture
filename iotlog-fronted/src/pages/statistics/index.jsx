import { Card, CardBody, CardHeader } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Fetch } from "../../components";
import { TABLE, TBODY } from "../../components/Table";
import { ListStatusOrderedered } from "../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import ContentHeader from "./ContentHeader";
import LoadingRows from "./LoadingRows";
import ModalOperation from "./ModalOperation";
import Benchmark from "./TableList/Benchmark";
import HeaderStatistic from "./TableList/HeaderStatistic";
import ItemRowStatistic from "./TableList/ItemRowStatistic";

const CardBodyStyled = styled(CardBody)`
  margin-bottom: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  max-height: calc(100vh - 290px);
`

const Statistics = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [itemSelected, setItemSelected] = React.useState();
  const [showFastFilter, setShowFastFilter] = React.useState(true);
  const [dateFilter, setDateFilter] = React.useState();
  const [orderColumn, setOrderColumn] = React.useState({
    column: "",
    order: ""
  });

  React.useLayoutEffect(() => {
    setIsReady(true)
  }, []);

  React.useLayoutEffect(() => {
    if (props.isReady && isReady)
      getData({
        dateMin: `${moment().startOf('month').format('YYYY-MM-DD')}T00:00:00${moment().format("Z")}`,
        isShowDisabled: false
      });
  }, [isReady, props.enterprises]);

  const getData = (filters) => {
    setIsLoading(true);
    const idEnterprise = props.enterprises?.length
      ? props.enterprises[0]?.id
      : undefined;

    const queryIdEnterprise = idEnterprise
      ? `idEnterprise=${idEnterprise}`
      : "";

    const queryModels = filters?.filteredModel
      ?.map((x, i) => `idModel[]=${x}`)
      ?.join("&");
    const queryMachine = filters?.filteredMachine
      ?.map((x, i) => `idMachine[]=${x}`)
      ?.join("&");

    const queryDateMin = filters?.dateMin ? `min=${filters?.dateMin}` : "";
    const queryDateMax = filters?.dateMax ? `max=${filters?.dateMax}` : "";

    const queryFilter = [
      queryIdEnterprise,
      queryModels,
      queryMachine,
      queryDateMax,
      queryDateMin,
      `isShowDisabled=${!!filters?.isShowDisabled}`
    ]
      .filter((x) => !!x)
      .join("&");

    Fetch.get(`/machineevent/statustime?${queryFilter}`)
      .then((response) => {
        setData(response.data?.length ? response.data : []);
        setDateFilter(filters);
        setIsLoading(false);
        if (filters?.isFilterByAdvanced)
          setShowFastFilter(false)
        else if (filters?.isClearing)
          setShowFastFilter(true)
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const statusInData = [
    ...new Set(
      data?.flatMap((x) =>
        x.listTimeStatus?.map((y) => y.status?.toLowerCase())
      )
    ),
  ];
  const listStatusAllow = ListStatusOrderedered?.filter((x) =>
    statusInData?.includes(x)
  );

  const normalizeData = (data, listStatus) => {
    const dataNormalized = data?.map((x) => {
      const totalAllStatusInMinutes = x?.listTimeStatus?.reduce(
        (a, b) => a + b.minutes || 0,
        0
      );

      const percentuals = listStatus
        ?.map((y) => {
          const statusItem = x.listTimeStatus?.find(
            (z) => z.status?.toLowerCase() === y
          );
          return {
            propname: `${y}`,
            percentual:
              !totalAllStatusInMinutes || !statusItem
                ? 0
                : (statusItem?.minutes / totalAllStatusInMinutes) * 100,
          };
        })
        .reduce((a, b) => ({ ...a, [b.propname]: b.percentual }), {});

      return {
        ...x,
        ...percentuals,
      };
    });
    if (orderColumn?.column) {
      return dataNormalized?.sort((a, b) =>
        orderColumn.order === "asc"
          ? a[orderColumn.column] - b[orderColumn.column]
          : b[orderColumn.column] - a[orderColumn.column]
      );
    }
    return dataNormalized;
  };

  const itens = normalizeData(data, listStatusAllow);

  const hasPermissionDetails = props.items?.some((x) => x === "/details-statistics-status");

  return (
    <>
      <Card>
        <CardHeader>
          <ContentHeader
            onFilter={getData}
            titleId="statistics.time.operation"
            showFastFilter={showFastFilter}
          />
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
              <HeaderStatistic
                listStatusAllow={listStatusAllow}
                setOrderColumn={setOrderColumn}
                orderColumn={orderColumn}
              />

              <TBODY>
                {!!listStatusAllow?.length && itens?.map((x, i) => (
                  <ItemRowStatistic
                    item={x}
                    index={i}
                    key={`${i + 1}_${x?.machine?.id}`}
                    listStatusAllow={listStatusAllow}
                    onClick={hasPermissionDetails ? (item) => setItemSelected({ dateFilter, machineEvent: x }) : undefined}
                  />
                ))}
                {!!itens?.length && (
                  <Benchmark listStatusAllow={listStatusAllow} itens={itens} />
                )}
              </TBODY>
            </TABLE>
          )}
        </CardBodyStyled>
      </Card>
      <ModalOperation
        onClose={() => setItemSelected(false)}
        item={itemSelected}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(Statistics);
