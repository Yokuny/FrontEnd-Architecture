import { Card, CardBody, CardHeader } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { Fetch, TextSpan } from "../../../components";
import { TABLE, TBODY } from "../../../components/Table";
import { ListStatusOrderedered } from "../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import LoadingRows from "./../LoadingRows";
import ModalOperation from "./../ModalOperation";
import Benchmark from "./../TableList/Benchmark";
import HeaderStatistic from "./../TableList/HeaderStatistic";
import ItemRowStatistic from "./../TableList/ItemRowStatistic";
import ContentHeader from "../../consumption/TimeOperation/ContentHeader";
import { useSearchParams } from "react-router-dom";

const CardBodyStyled = styled(CardBody)`
  margin-bottom: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  max-height: calc(100vh - 290px);
`

const StatisticsTimeOperation = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [itemSelected, setItemSelected] = React.useState();
  const [showFastFilter, setShowFastFilter] = React.useState(true);
  const [dateFilter, setDateFilter] = React.useState();
  const [orderColumn, setOrderColumn] = React.useState({
    column: "",
    order: ""
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const dateStart = searchParams.get("dateStart");
  const dateEnd = searchParams.get("dateEnd");
  const filteredMachine = searchParams.get("filteredMachine");
  const filteredModel = searchParams.get("filteredModel");

  React.useEffect(() => {
    if (dateStart && dateEnd) {
      getData();
    } else {
      updateQueryParam([
        ["dateStart", `${moment().subtract(7, `days`).format('YYYY-MM-DD')}T00:00:00.000${moment().format("Z")}`],
        ["dateEnd", `${moment().subtract(1, `day`).format('YYYY-MM-DD')}T23:59:59.999${moment().format("Z")}`],
      ]);
    }
  }, [searchParams]);

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

  const getData = (filters) => {
    setIsLoading(true);
    const idEnterprise = props.enterprises?.length
      ? props.enterprises[0]?.id
      : localStorage.getItem("id_enterprise_filter");

    const queryIdEnterprise = idEnterprise
      ? `idEnterprise=${idEnterprise}`
      : "";

    const queryModels = filteredModel
      ?.split(",")
      ?.map((x, i) => `idModel[]=${x}`)
      ?.join("&");
    const queryMachine = filteredMachine
      ?.split(",")
      ?.map((x, i) => `idMachine[]=${x}`)
      ?.join("&");


    const queryDateMin = dateStart ? `min=${dateStart}` : "";
    const queryDateMax = dateEnd
      ? `max=${dateEnd}`
      : `max=${moment().subtract(1, 'day').format('YYYY-MM-DD')}T23:59:59.999${moment().format("Z")}`;

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
        setData(preData(response.data?.length ? response.data : []));
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

  const preData = (data) => {
    return data?.map((x) => {
      const listTimeStatusTransit = x?.listTimeStatus?.filter((y) =>
        y.status?.toLowerCase() === "transit"
      );

      const listTimeStatusUnderway = x?.listTimeStatus?.filter((y) =>
        y.status?.toLowerCase() === "underway using engine"
      );

      return {
        ...x,
        listTimeStatus: [
          ...x?.listTimeStatus?.filter((y) =>
            !["underway using engine", "transit"].includes(y.status?.toLowerCase())
          ),
          {
            status: "UNDERWAY USING ENGINE",
            minutes: listTimeStatusTransit?.reduce((a, b) => a + b.minutes, 0)
              + listTimeStatusUnderway?.reduce((a, b) => a + b.minutes, 0),
            distance: listTimeStatusTransit?.reduce((a, b) => a + b.distance, 0) +
              listTimeStatusUnderway?.reduce((a, b) => a + b.distance, 0)
          }
        ]
      }
    });
  }

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
          <ContentHeader>
            <TextSpan apparence="s1">
              <FormattedMessage id={"time.operation"} />
            </TextSpan>
            {dateStart && dateEnd && <TextSpan apparence="p2" hint>
              {moment(dateStart).format("DD MMM, YYYY")} - {moment(dateEnd).format("DD MMM, YYYY")}
            </TextSpan>}
          </ContentHeader>
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
        filter={
          {
            dateStart: dateStart,
            dateEnd: dateEnd
          }
        }
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(StatisticsTimeOperation);
