import React from "react";
import { withTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { injectIntl } from "react-intl";
import { ContainerChart } from "../../Utils";

const GroupStatusDemo = (props) => {
  const { height = 200, width = 200 } = props;

  const series = [
    {
      name: props.intl.formatMessage({ id: 'active' }),
      data: [1, 0, 0],
    },
    {
      name: props.intl.formatMessage({ id: 'lostconnection' }),
      data: [0, 0, 1],
    },
    {
      name: props.intl.formatMessage({ id: 'failure' }),
      data: [0, 1, 0],
    },
  ];

  const options = {
    chart: {
      id: "groupDemo",
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
      props.theme.colorDanger500,
    ],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Mac. 1", "Mac. 2", "Mac. 3"],
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
        show: false,
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
      text: props.intl.formatMessage({ id: "status.machine" }),
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

const GroupStatusDemoIntl = injectIntl(GroupStatusDemo);
export default withTheme(GroupStatusDemoIntl);
