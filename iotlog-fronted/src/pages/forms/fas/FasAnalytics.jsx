import * as React from "react";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { EvaIcon } from "@paljs/ui/Icon";
import Select from "@paljs/ui/Select";

import { connect } from "react-redux";
import {
  TextSpan,
  LabelIcon
} from "../../../components";

import RealizedOrdersChart from "../../../components/FasAnalytics/RealizedOrdersChart";
import FasHeaderTypesGroup from "../../../components/FasAnalytics/FasHeaderTypeGroup/FasHeaderTypesGroup";
import FasOrderStatusGroup from "../../../components/FasAnalytics/FasOrderStatusGroup/FasOrderStatusGroup";
import FasAnalyiticsFilter from "../../../components/FasAnalytics/FasAnalyiticsFilter";
import FasValueCountChart from "../../../components/FasAnalytics/FasValueCountChart";
import OrderValueCountChart from "../../../components/FasAnalytics/OrderValueCountChart";


const CHART_GROUPS = [
  {
    value: "realized.orders",
    label: <FormattedMessage id={"fas.completed.chart"} />,
    orderFilter: true
  },
  {
    value: "header.types",
    label: <FormattedMessage id={"fas.types.chart"} />,
    orderFilter: false
  },
  {
    value: "order.status",
    label: <FormattedMessage id={"fas.status.chart"} />,
    orderFilter: true
  },
  {
    value: "fas.bms.value.chart",
    label: <FormattedMessage id={"fas.bms.value.chart"} />,
    orderFilter: false
  },
  {
    value: "order.bms.value.chart",
    label: <FormattedMessage id={"order.bms.value.chart"} />,
    orderFilter: true
  },
];


const FasAnalytics = (props) => {
  const [filterValue, setFilterValue] = React.useState();
  const [selectedChartGroup, setSelectedChartGroup] = React.useState(
    CHART_GROUPS[0]
  );

  const changeFilterValue = (value) => {
    setFilterValue(value);
  }

  const changeChartGroup = (e) => {
    setSelectedChartGroup(e);
  }
  const refreshCharts = () => {
    // This will refresh the charts components
    setFilterValue({ ...filterValue });
  };

  const renderActiveChart = () => {
    if (selectedChartGroup) {
      switch (selectedChartGroup.value) {
        case "realized.orders":
          return <RealizedOrdersChart
            key={"realized.orders"}
            filterOptions={filterValue} />;
        case "header.types":
          return <FasHeaderTypesGroup
            key={"header.types"}
            filterOptions={filterValue} />;
        case "order.status":
          return <FasOrderStatusGroup
            key={"order.status"}
            filterOptions={filterValue} />;
        case "fas.bms.value.chart":
          return <FasValueCountChart
            key={"fas.bms.value.chart"}
            filterOptions={filterValue} />;
        case "order.bms.value.chart":
          return <OrderValueCountChart
            key={"order.bms.value.chart"}
            filterOptions={filterValue} />;
        default:
          return null;
      }
    }
  }

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <Row between="xs" middle="xs" className="m-0" style={{ flexWrap: `nowrap` }}>
            <Button
              className="mr-2"
              appearance="ghost"
              size="Tiny"
              onClick={refreshCharts}
            >
              <EvaIcon name="refresh-outline" />
            </Button>
            <TextSpan apparence="s1" style={{ width: `100%` }}>
              <FormattedMessage id="fas.analytics" />
            </TextSpan>
          </Row>
        </CardHeader>
        <CardBody style={{ overflowX: `hidden` }}>
          <Row className="mb-4">
            <Col breakPoint={{ md: 12 }}>
              <LabelIcon
                title={<FormattedMessage id="chart.group" />} />
              <Select
                size="Small"
                width="100%"
                placeholder={<FormattedMessage id="select.chart.group" />}
                value={selectedChartGroup}
                onChange={changeChartGroup}
                options={CHART_GROUPS}
              />
            </Col>
          </Row>
          <FasAnalyiticsFilter
            onSearch={changeFilterValue}
            useOrderFilters={selectedChartGroup?.orderFilter}
          />
          {renderActiveChart()}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(FasAnalytics);

