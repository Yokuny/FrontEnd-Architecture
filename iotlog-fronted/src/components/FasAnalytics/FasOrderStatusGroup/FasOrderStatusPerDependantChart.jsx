import * as React from "react";
import Col from "@paljs/ui/Col";
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { SkeletonThemed } from "../../Skeleton";
import { STATUS_COLORS } from "../../../pages/forms/fas/StatusFas";
import {
  getBaseOptions,
  getBarChartOptions,
  formatDependantAxisCategories,
} from "../Utils/FasKpiBaseOptions";
import { buildDataSeriesFromGroupedData } from "../Utils/FasKpi";
import { Fetch } from "../..";
import { useIntl } from "react-intl";

const FasOrderStatusPerDependantChart = ({ filterOptions, dependantAxis }) => {
  const intl = useIntl();
  const theme = useTheme();

  const [optionsStackedBarChart, setOptionsStackedBarChart] = React.useState(
    {}
  );
  const [dataSeries, setDataSeries] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    getData();
  }, [filterOptions, dependantAxis]);

  const getData = () => {
    // Parse filters
    let queryString = `?dependantAxis=${dependantAxis}&`; // change this to other valid axis values to change it to other axis
    if (filterOptions) {
      Object.entries(filterOptions).forEach(([key, value]) => {
        queryString += `${key}=${value}&`;
      });
    }
    setIsLoading(true);
    Fetch.get(`/fas/analytics/order-status-grouped-count${queryString}`)
      .then((response) => {
        const [dataSeriesBuilder, labelColors] = buildDataSeriesFromGroupedData(
          response?.data,
          "status",
          STATUS_COLORS,
          intl
        );
        setDataSeries(dataSeriesBuilder);
        setOptionsStackedBarChart({
          ...getBaseOptions({
            theme,
            colors: labelColors,
          }),
          ...getBarChartOptions({
            theme,
            categories: formatDependantAxisCategories(
              response?.data,
              dependantAxis
            ),
          }),
        });
        setIsLoading(false);
        return;
      })
      .catch(() => {
        setIsLoading(false);
        return;
      });
  };

  return (
    <>
      <Col breakPoint={{ lg: 6, xs: 6 }}>
        {isLoading ? (
          <SkeletonThemed width="100%" height="500px" />
        ) : (
          optionsStackedBarChart &&
          dataSeries && (
            <ReactApexCharts
              type="bar"
              options={optionsStackedBarChart}
              series={dataSeries}
              width="100%"
              height="500px"
            />
          )
        )}
      </Col>
    </>
  );
};

export default FasOrderStatusPerDependantChart;
