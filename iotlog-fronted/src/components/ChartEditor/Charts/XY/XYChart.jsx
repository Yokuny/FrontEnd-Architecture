import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from "moment";
import { ContentChartWrapped } from "../../Utils";
import {
  convertValue,
  normalizeSizeDecimals,
} from "../../OptionsBase/SensorValueUse";

const XYChart = (props) => {
  const { title, data } = props;

  const theme = useTheme();

  const series = [
    {
      data: [],
    },
  ];

  const typeChart = data?.typeChart?.value || "line";

  const options = {
    chart: {
      id: `realtime_${props.id}`,
      type: typeChart,
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    colors: [data.color || theme.colorPrimary500],
    dataLabels: {
      enabled: !!data?.showDataLabel,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
      labels: {
        formatter: (value) => {
          return moment(value).format("HH:mm:ss");
        },
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
        },
      },
    },
    tooltip: {
      enabled: false,
      intersect: true,
      shared: false,
    },
    yaxis: {
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
        },
      },
      title: {
        text: props.description,
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "500",
          fontSize: 11,
        },
      },
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    title: {
      text: title,
      align: "center",
      style: {
        foreColor: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
        fontSize: "13px",
      },
    },
  };

  !!data?.stepline &&
    (options.stroke = {
      curve: "stepline",
    });

  return (
    <ContentChartWrapped>
      <React.StrictMode>
        <ReactApexCharts
          key={`xy_${props.id}`}
          options={options}
          series={series}
          height="100%"
          width="100%"
          type={typeChart}
        />
      </React.StrictMode>
    </ContentChartWrapped>
  );
};

export default XYChart;
