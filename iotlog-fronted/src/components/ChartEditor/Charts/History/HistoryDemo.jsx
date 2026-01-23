import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { ContainerChart } from "../../Utils";

const HistoryDemo = (props) => {
  const { height = 200, width = 200 } = props;

  const theme = useTheme()
  const intl = useIntl()

  const series = [
    {
      name: "Máq. 1",
      data: [55, 60, 45],
    },
    {
      name: "Máq. 2",
      data: [30, 13, 10],
    },
  ];

  const options = {
    chart: {
      id: "HistoryDemo",
      type: "line",
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
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: ["22/10", "23/10", "24/10"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
      intersect: true,
      shared: false,
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
        },
      },
    },
    legend: {
      show: false,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    title: {
      text: intl.formatMessage({ id: "history" }),
      align: "center",
      style: {
        fontSize: "13px",
        foreColor: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
      },
    },
  };

  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow pt-2">
        <ReactApexCharts
          options={options}
          series={series}
          height={height - 10}
          width={width - 15}
          type="line"
        />
      </ContainerChart>
    </>
  );
};

export default HistoryDemo;
