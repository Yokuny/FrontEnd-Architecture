import * as React from "react";
import Col from "@paljs/ui/Col";
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { SkeletonThemed } from "../../Skeleton";
import {
  getBaseOptions,
  getBarChartOptions,
  formatDependantAxisCategories,
} from "../Utils/FasKpiBaseOptions";
import { buildDataSeriesFromGroupedData } from "../Utils/FasKpi";
import { Fetch } from "../..";
import { useThemeSelected } from "../../Hooks/Theme";

const FasTypePerDependantChart = ({ filterOptions, dependantAxis }) => {
  const theme = useTheme();
  const [dataSeries, setDataSeries] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [optionsStackedBarChart, setOptionsStackedBarChart] = React.useState();
  const dataRef = React.useRef([]);
  const { isDark } = useThemeSelected();

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
    Fetch.get(`/fas/analytics/fas-type-grouped-count${queryString}`)
      .then((response) => {
        dataRef.current = response.data || [];
        const [dataSeriesBuilder, colorLabels] = buildDataSeriesFromGroupedData(
          response?.data,
          "type",
          {}
        );
        setDataSeries(dataSeriesBuilder);

        setOptionsStackedBarChart({
          ...getBaseOptions({
            theme,
            colors: [
              theme.colorPrimary500,
              theme.colorDanger600,
              theme.colorWarning500,
              theme.colorInfo500,
            ],
          }),
          ...getBarChartOptions({
            theme,
            categories: formatDependantAxisCategories(dataRef.current, dependantAxis),
          }),
          theme: {
            mode: isDark ? "dark" : "light",
          },
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

export default FasTypePerDependantChart;
