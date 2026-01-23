import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import { connect } from "react-redux";
import React from "react";
import moment from "moment";
import styled from "styled-components";
import { Button, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { Fetch, TextSpan } from "../../../components";
import Filter from "./Filter";
import ChartPie from "./ChartPie";
import ChartDaily from "./ChartDaily";
import Loading from "./Loading";
import ChartMonthly from "./ChartMonthly";
import { brokenByDay } from "./services/UtilsService";
import ChartRevenue from "./ChartRevenue";
import ChartTypes from "./ChartTypes";
import MiniDashboards from "./MiniDashboards";
import DownloadPerformanceCSV from "./DownloadCSV";
import { OPERATIONAL } from "../../../components/Select/SelectView";

const DivSeparator = styled.div`
  margin-top: 2rem;
`;

const ViewFinancialButton = styled(Button)`
 margin: 1rem;
`;

function Inoperability(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [viewFinancial, setViewFinancial] = React.useState(true);
  const [view, setView] = React.useState(OPERATIONAL);

  const idMachine = React.useRef();
  const dataListRef = React.useRef([]);

  const hasPermissionViewFinancial = props.items?.some((x) => x === "/view-inoperability-profit-loss") || false;

  const idEnterprise = props.enterprises?.length ? props.enterprises[0].id : "";

  const onFilter = (filter) => {
    let querys = [];
    if (filter?.dateStart) {
      querys.push(
        `initialDate=${moment(filter?.dateStart).format(
          "YYYY-MM-DD"
        )}T00:00:00.000${moment().format("Z")}`
      );
    }
    if (filter?.dateEnd) {
      querys.push(
        `finalDate=${moment(filter?.dateEnd).format(
          "YYYY-MM-DD"
        )}T23:59:59.999${moment().format("Z")}`
      );
    }
    if (filter?.idMachine) {
      querys.push(`idMachine=${filter?.idMachine}`);
      idMachine.current = filter?.idMachine;
    }
    if (filter?.idEnterprise) {
      querys.push(`idEnterprise=${filter?.idEnterprise}`);
    }
    querys.push(`timezone=${moment().format("Z")}`);
    setIsLoading(true);
    Fetch.get(`/assetstatus/chartdata?${querys.join("&")}`)
      .then((response) => {
        if (response.data?.length) {
          dataListRef.current = response.data;
          setData(brokenByDay(response.data, filter?.dateEnd));
        } else {
          dataListRef.current = [];
          setData([]);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <Card>
      <CardHeader>
        <TextSpan apparence="s1">
          <FormattedMessage id="performance.asset.operational" />
        </TextSpan>
      </CardHeader>
      <CardBody
        style={{
          overflowX: "hidden",
        }}
      >
        <Filter
          key={idEnterprise}
          idEnterprise={idEnterprise}
          onFilter={onFilter}
          isLoading={isLoading}
          view={view}
          setView={setView}
        />


        {isLoading ? (
          <>
            <Loading />
          </>
        ) : (
          <>
            {(hasPermissionViewFinancial &&
              !!data?.statusList?.length) ? (
              <Row start="xs" middle="xs">
                <ViewFinancialButton
                  status="Basic"
                  size="Tiny"
                  appearance="ghost"
                  className="flex-between"
                  onClick={() => setViewFinancial(!viewFinancial)}
                >
                  <EvaIcon
                    className="mr-1"
                    name={viewFinancial ? "eye-off-outline" : "eye-outline"}
                  />
                  <FormattedMessage id={!viewFinancial ? "view.financial" : "hide.financial"} />
                </ViewFinancialButton>
                <DownloadPerformanceCSV
                  data={dataListRef.current}
                  hasPermissionViewFinancial={hasPermissionViewFinancial}
                />
              </Row>
            ) : <DivSeparator />}
            {!!data?.statusList?.length && (
              <Row middle="xs">
                <MiniDashboards
                  data={data.statusList}
                  typesEvents={data.typesEvents}
                  totalLoss={data.totalLoss}
                  totalRevenue={data.totalRevenue}
                  idMachine={idMachine.current}
                  viewLoss={viewFinancial}
                />
                <ChartPie
                  data={data?.statusList}
                  typesEvents={data.typesEvents}
                  view={view}
                />
              </Row>
            )}

            <DivSeparator />
            {!!data?.statusList?.length && (
              <ChartMonthly
              view={view}
              data={data.statusList} />
            )}

            <DivSeparator />
            {!!data?.dailyList?.length && (
              <ChartDaily
                data={data?.dailyList?.map((x) => [
                  x.date,
                  (x.hoursOperation * 100) / 24,
                  x.hoursOperation,
                ])}
              />
            )}

            <DivSeparator />
            {!!data?.statusList?.length && (
              <ChartRevenue data={data.statusList} />
            )}

            <DivSeparator />
            {!!data?.typesEvents?.length && (
              <ChartTypes data={data.typesEvents} />
            )}
          </>
        )}
      </CardBody>
      {!isLoading &&
      !!data?.statusList?.length &&
      <CardFooter>
        <DownloadPerformanceCSV
          data={dataListRef.current}
          hasPermissionViewFinancial={hasPermissionViewFinancial}
        />
      </CardFooter>}
    </Card>
  );
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(Inoperability);
