import React from "react";
import { withTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { injectIntl } from "react-intl";
import { ContainerChart } from "../../Utils";

const GroupBooleanDemo = (props) => {
  const { height = 200, width = 200 } = props;

  const series = [{
    name: '',
    data: [26, 43, 22, 35]
  }]

  const options = {
    chart: {
      id: "GroupBooleanDemo",
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
    colors: [props.theme.colorDanger500],
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: ["Bool 1", "Bool 2", "Bool 3", "Bool 4"],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
    },
    tooltip: {
      enabled: false,
      intersect: true,
      shared: false
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        style: {
          foreColor: props.theme.textBasicColor,
          fontFamily: props.theme.fontFamilyPrimary,
        },
      }
    },
    legend: {
      show: true,
      foreColor: props.theme.textBasicColor,
      fontFamily: props.theme.fontFamilyPrimary,
    },
    title: {
      text: props.intl.formatMessage({ id: 'count.boolean.daily.by.sensor' }),
      align: 'center',
      style: {
        foreColor: props.theme.textBasicColor,
        fontFamily: props.theme.fontFamilyPrimary,
        fontWeight: '600'
      },
    }
  };

  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow pt-4">
        <ReactApexCharts
          options={options}
          series={series}
          height={height - 10}
          width={width - 15}
          type="bar"
        />
      </ContainerChart>
    </>
  );
};

const GroupBooleanDemoIntl = injectIntl(GroupBooleanDemo);
export default withTheme(GroupBooleanDemoIntl);
