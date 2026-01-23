import React from "react";
import { withTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { injectIntl } from "react-intl";
import { ContainerChart } from "../../Utils";

const GoalOperatorByMachineDemo = (props) => {
  const { height = 200, width = 200 } = props;

  const series = [{
    data: [44, 55, 41]
  }];

  const options = {
    chart: {
      id: "GoalOperatorByMachineDemo",
      type: "bar",
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
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
    },
    xaxis: {
      categories: ["João", "Marcos", "José"],
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
    },
    title: {
      text: props.intl.formatMessage({ id: "operator.goal" }),
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

const GoalOperatorByMachineDemoIntl = injectIntl(GoalOperatorByMachineDemo);
export default withTheme(GoalOperatorByMachineDemoIntl);
