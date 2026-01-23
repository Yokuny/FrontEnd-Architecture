import { Card, CardBody, CardHeader } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { Fetch, TextSpan } from "../../../components";
import { TABLE, TBODY } from "../../../components/Table";
import { ListStatusOrderedered } from "../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import ContentHeader from "./ContentHeader";
import LoadingRows from "../../statistics/LoadingRows";
import HeaderStatistic from "./TableList/HeaderStatistic";
import ItemRowStatistic from "./TableList/ItemRowStatistic";
import Benchmark from "./TableList/Benchmark";

const CardBodyStyled = styled(CardBody)`
  margin-bottom: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  max-height: calc(100vh - 290px);
`

const ConsumptionTimeOperation = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState();
  const [orderColumn, setOrderColumn] = React.useState({
    column: "",
    order: ""
  });

  const intl = useIntl();

  React.useLayoutEffect(() => {
    setIsReady(true)
  }, []);

  React.useLayoutEffect(() => {
    if (props.isReady && isReady)
      getData({
        dateMin: `${moment().subtract(8, `days`).format('YYYY-MM-DD')}T00:00:00${moment().format("Z")}`,
        dateMax: `${moment().subtract(1, `days`).format('YYYY-MM-DD')}T23:59:59${moment().format("Z")}`,
        isShowDisabled: false,
        unit: "m³"
      });
  }, [isReady, props.enterprises]);

  const getData = (filters) => {
    if (!filters?.dateMax || !filters?.dateMin) {
      toast.warning(intl.formatMessage({ id: "date.required" }));
      return;
    }

    if (moment(filters?.dateMax).isBefore(moment(filters?.dateMin))) {
      toast.warning(intl.formatMessage({ id: "date.end.is.before.date.start" }));
      return;
    }

    if (!moment(filters?.dateMax).isBefore(new Date())) {
      toast.warning(intl.formatMessage({ id: "date.end.need.before.yesterday" }));
      return;

    }

    setIsLoading(true);
    const idEnterprise = props.enterprises?.length
      ? props.enterprises[0]?.id
      : undefined;

    const queryIdEnterprise = idEnterprise
      ? `idEnterprise=${idEnterprise}`
      : "";


    const queryMachine = filters?.filteredMachine
      ?.map((x, i) => `idMachine[]=${x.value}`)
      ?.join("&");

    const queryDateMin = filters?.dateMin ? `min=${filters?.dateMin}` : "";
    const queryDateMax = filters?.dateMax ? `max=${filters?.dateMax}` : "";

    const queryFilter = [
      queryIdEnterprise,
      queryMachine,
      queryDateMax,
      queryDateMin,
      `isShowDisabled=${!!filters?.isShowDisabled}`,
      `unit=${filters?.unit || "m³"}`
    ]
      .filter((x) => !!x)
      .join("&");

    Fetch.get(`/machineevent/dailyevents?${queryFilter}`)
      .then((response) => {
        setData(response.data ? response.data : undefined);
        setDateFilter(filters);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const statusInData = [
    ...new Set(
      data?.dataReturn?.flatMap((x) =>
        x.listTimeStatus?.map((y) => y.status?.toLowerCase())
      )
    ),
  ];
  const listStatusAllow = ListStatusOrderedered?.filter((x) =>
    statusInData?.includes(x)
  );

  const normalizeData = (data, listStatus) => {
    const dataNormalized = data?.dataReturn?.map((x) => {
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
            showUnit={true}
          >
            <TextSpan apparence="s1">
              <FormattedMessage id={"consumption.time.operation"} />
            </TextSpan>
            {dateFilter && <TextSpan apparence="p2" hint>
              {moment(dateFilter?.dateMin).format("DD MMM, YYYY")} - {moment(dateFilter?.dateMax).format("DD MMM, YYYY")}
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
                setOrderColumn={setOrderColumn}
                orderColumn={orderColumn}
                idEnterprise={props.enterprises?.length ? props.enterprises[0]?.id : undefined}
              />

              <TBODY>
                {!!listStatusAllow?.length && itens?.map((x, i) => (
                  <ItemRowStatistic
                    item={x}
                    index={i}
                    unit={dateFilter?.unit}
                    key={`${i + 1}_${x?.machine?.id}`}
                  />
                ))}
                {!!itens?.length && (
                  <Benchmark
                    unit={dateFilter?.unit}
                    itens={itens} />
                )}
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
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(ConsumptionTimeOperation);
