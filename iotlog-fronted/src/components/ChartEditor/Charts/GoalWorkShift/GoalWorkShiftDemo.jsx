import React from "react";
import { withTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { injectIntl } from "react-intl";
import { ContainerChart } from "../../Utils";

const GoalWorkShiftDemo = (props) => {
  const { height = 200, width = 200 } = props;

  const series = [
    {
      name: props.intl.formatMessage({ id: 'produced' }),
      data: [100, 200, 150],
    },
    {
      name: props.intl.formatMessage({ id: 'goal' }),
      data: [50, 150, 90],
    }
  ];

  const options = {
    chart: {
      id: "GoalWorkShiftDemo",
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
      props.theme.colorSuccess500,
      props.theme.colorWarning500,
    ],
    dataLabels: {
      enabled: true,
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
      show: true,
      foreColor: props.theme.textBasicColor,
      fontFamily: props.theme.fontFamilyPrimary,
    },
    title: {
      text: props.intl.formatMessage({ id: "goal.work.shift" }),
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

const GoalWorkShiftDemoIntl = injectIntl(GoalWorkShiftDemo);
export default withTheme(GoalWorkShiftDemoIntl);
