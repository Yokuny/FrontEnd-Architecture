import * as React from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { FormattedMessage, useIntl } from "react-intl";
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { SkeletonThemed } from "../Skeleton";
import Select from "@paljs/ui/Select";
import {
  getBaseOptions,
  getBarChartOptions,
  formatDependantAxisCategories,
} from "./Utils/FasKpiBaseOptions";
import { Fetch, TextSpan, LabelIcon } from "../";
import { useThemeSelected } from "../Hooks/Theme";

const RealizedOrdersChart = ({ filterOptions }) => {
  const intl = useIntl();
  const theme = useTheme();

  const ORDER_DEPENDANT_AXIS_OPTIONS = [
    { value: "month", label: intl.formatMessage({ id: "month" }) },
    { value: "vessel", label: intl.formatMessage({ id: "vessel" }) },
  ];

  const [completedDataSeries, setCompletedDataSeries] = React.useState([]);
  const [dependantAxis, setDependantAxis] = React.useState(
    ORDER_DEPENDANT_AXIS_OPTIONS[0]
  );
  const [optionsCompletedChart, setOptionsCompletedChart] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const dataRef = React.useRef([]);

  const { isDark } = useThemeSelected();

  React.useEffect(() => {
    getData();
  }, [filterOptions, dependantAxis]);

  const getData = () => {
    // Parse filters
    let queryString = `?dependantAxis=${dependantAxis?.value}&`;
    if (filterOptions) {
      Object.entries(filterOptions).forEach(([key, value]) => {
        queryString += `${key}=${value}&`;
      });
    }

    setIsLoading(true);
    Fetch.get(`/fas/analytics/realized-os${queryString}`).then((response) => {
      dataRef.current = response.data || [];
      setCompletedDataSeries([
        {
          name: "OS realizadas",
          data: response.data.map((monthData) => monthData.completedCount),
        },
        {
          name: "OS não realizadas",
          data: response.data.map((monthData) => monthData.notCompletedCount),
        },
      ]);

      setOptionsCompletedChart({
      ...getBaseOptions({
        theme,
        colors: [theme.colorPrimary500, theme.colorDanger500],
      }),
      ...getBarChartOptions({
        theme,
        categories: formatDependantAxisCategories(
          dataRef.current,
          dependantAxis.value
        ),
      }),
      theme: {
        mode: isDark ? "dark" : "light",
      },
    });
    
      setIsLoading(false);
    });
  };

  return (
    <>
      <Row>
        <Col className="mb-4" breakPoint={{ md: 4 }}>
          <LabelIcon
            title={<FormattedMessage id="fas.chart.dependantAxis" />}
          />
          <Select
            value={dependantAxis}
            onChange={setDependantAxis}
            options={ORDER_DEPENDANT_AXIS_OPTIONS}
            size="Tiny"
            placeholder={intl.formatMessage({ id: "fas.chart.dependantAxis" })}
          />
        </Col>
        <TextSpan
          apparence="c2"
          style={{ width: `100%` }}
          className={"ml-4 mb-2"}
        >
          <FormattedMessage id="fas.completed.chart" />
        </TextSpan>
      </Row>
      <Row>
        <Col breakpoint={{ md: 12 }}>
          {isLoading ? (
            <SkeletonThemed width="100%" height="500px" />
          ) : (
            optionsCompletedChart &&
            completedDataSeries && (
              <ReactApexCharts
                type="bar"
                options={optionsCompletedChart}
                series={completedDataSeries}
                width="100%"
                height="500px"
              />
            )
          )}
        </Col>
      </Row>
    </>
  );
};

export default RealizedOrdersChart;
