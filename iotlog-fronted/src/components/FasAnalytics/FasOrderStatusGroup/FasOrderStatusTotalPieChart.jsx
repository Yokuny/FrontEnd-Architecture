import * as React from "react";
import Col from "@paljs/ui/Col";
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { SkeletonThemed } from "../../Skeleton";
import { useIntl } from "react-intl";
import {
  getBaseOptions,
  getDonutChartOptions,
} from "../Utils/FasKpiBaseOptions";
import { Fetch } from "../..";
import { STATUS_COLORS } from "../../../pages/forms/fas/StatusFas";

const FasOrderStatusTotalPieChart = ({ filterOptions }) => {
  const theme = useTheme();
  const intl = useIntl();
  const [optionsPieChart, setOptionsPieChart] = React.useState({});
  const [dataSeries, setDataSeries] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    getData();
  }, [filterOptions]);

  const getData = async () => {
    // Parse filters
    let queryString = "?";
    if (filterOptions) {
      Object.entries(filterOptions).forEach(([key, value]) => {
        queryString += `${key}=${value}&`;
      });
    }
    setIsLoading(true);
    Fetch.get(`/fas/analytics/order-status-count${queryString}`)
      .then((response) => {
        setDataSeries(response?.data?.map((metric) => metric.count));
        const labelColors = [];
        response.data.forEach((metric) =>
          labelColors.push(STATUS_COLORS[metric._id.replaceAll(".", "-")])
        );
        setOptionsPieChart({
          ...getBaseOptions({
            theme,
            colors: labelColors,
            dataLabelFormatter: (val, opts) =>
              opts.w.config.series[opts.seriesIndex],
          }),
          ...getDonutChartOptions({
            theme,
            labels: response?.data?.map((metric) =>
              intl.formatMessage({ id: metric._id })
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
          optionsPieChart &&
          dataSeries && (
            <ReactApexCharts
              type="donut"
              options={optionsPieChart}
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

export default FasOrderStatusTotalPieChart;
