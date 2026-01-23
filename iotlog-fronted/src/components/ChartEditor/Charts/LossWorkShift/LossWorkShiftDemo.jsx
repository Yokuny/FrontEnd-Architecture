import React from "react";
import styled, { withTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { injectIntl } from "react-intl";
import { ContainerChart } from "../../Utils";

const LossWorkShiftDemo = (props) => {
  const { height = 200, width = 200 } = props;

  const series = [
    {
      name: props.intl.formatMessage({ id: 'loss' }),
      data: [10, 20, 15],
    }
  ];

  const options = {
    chart: {
      id: "LossWorkShiftDemo",
      type: "bar",
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
      props.theme.colorDanger500
    ],
    dataLabels: {
      enabled: true,
      formatter: (value) => {
        return `${value}%`
      }
    },
    xaxis: {
      categories: ["Turn. 1", "Turn. 2", "Turn. 3"],
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
      show: false,
      foreColor: props.theme.textBasicColor,
      fontFamily: props.theme.fontFamilyPrimary,
    },
    title: {
      text: props.intl.formatMessage({ id: "loss.work.shift" }),
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
          type="bar"
        />
      </ContainerChart>
    </>
  );
};

const LossWorkShiftDemoIntl = injectIntl(LossWorkShiftDemo);
export default withTheme(LossWorkShiftDemoIntl);
