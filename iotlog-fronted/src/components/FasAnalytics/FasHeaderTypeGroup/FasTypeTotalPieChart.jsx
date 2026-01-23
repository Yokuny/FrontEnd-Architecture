import * as React from "react";
import Col from "@paljs/ui/Col";
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { SkeletonThemed } from "../../Skeleton";
import {
  getBaseOptions,
  getDonutChartOptions,
} from "../Utils/FasKpiBaseOptions";
import { Fetch } from "../..";

const FasTypeTotalPieChart = ({ filterOptions }) => {
  const theme = useTheme();
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
    Fetch.get(`/fas/analytics/fas-type-count${queryString}`)
      .then((response) => {
        setDataSeries(response?.data?.map((metric) => metric.count));

        setOptionsPieChart({
          ...getBaseOptions({
            theme,
            colors: [
              theme.colorPrimary500,
              theme.colorDanger600,
              theme.colorWarning500,
              theme.colorInfo500,
            ],
            dataLabelFormatter: (val, opts) =>
              opts.w.config.series[opts.seriesIndex],
          }),
          ...getDonutChartOptions({
            theme,
            colors: [
              theme.colorPrimary500,
              theme.colorDanger600,
              theme.colorWarning500,
              theme.colorInfo500,
            ],
            labels: response?.data?.map((metric) => metric._id),
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

export default FasTypeTotalPieChart;
