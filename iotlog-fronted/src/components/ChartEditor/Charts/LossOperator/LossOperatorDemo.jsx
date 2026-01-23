import React from "react";
import { withTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { injectIntl } from "react-intl";
import { ContainerChart } from "../../Utils";

const LossOperatorDemo = (props) => {
  const { height = 200, width = 200 } = props;

  const series = [
    {
      name: props.intl.formatMessage({ id: 'produced' }),
      data: [10, 20, 15],
    }
  ];

  const options = {
    chart: {
      id: "LossOperatorDemo",
      type: "area",
      stacked: true,
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
      foreColor: props.theme.textBasicColor,
      fontFamily: props.theme.fontFamilyPrimary,
    },
    colors: [
      props.theme.colorDanger500,
    ],
    dataLabels: {
      enabled: true,
      formatter: (value) => {
        return `${value}%`
      }
    },
    xaxis: {
      categories: ["John", "Mark", "Julie"],
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
      tickAmount: 2,
      labels: {
        show: true,
        style: {
          foreColor: props.theme.textBasicColor,
          fontFamily: props.theme.fontFamilyPrimary,
        },
      },
    },
    legend: {
      show: true,
      foreColor: props.theme.textBasicColor,
      fontFamily: props.theme.fontFamilyPrimary,
    },
    title: {
      text: props.intl.formatMessage({ id: "loss.operator" }),
      align: "center",
      style: {
        foreColor: props.theme.textBasicColor,
        fontFamily: props.theme.fontFamilyPrimary,
        fontWeight: "600",
      },
    },
  };

  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow">
        <ReactApexCharts
          options={options}
          series={series}
          height={height}
          width={width - 15}
          type="area"
        />
      </ContainerChart>
    </>
  );
};

const LossOperatorDemoIntl = injectIntl(LossOperatorDemo);
export default withTheme(LossOperatorDemoIntl);
