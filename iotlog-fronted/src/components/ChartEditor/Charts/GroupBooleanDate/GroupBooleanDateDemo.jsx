import React from "react";
import { withTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { injectIntl } from "react-intl";
import { ContainerChart } from "../../Utils";
import moment from "moment";

const GroupBooleanDateDemo = (props) => {
  const { height = 200, width = 200 } = props;

  const series = [
    {
      name: "",
      data: [45, 10, 59, 56],
    },
  ];

  let dateNow = moment().utc();

  const options = {
    chart: {
      id: "GroupBooleanDateDemo",
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
    colors: [props.theme.colorPrimary500],
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: [
        dateNow
          .subtract(4, "days")
          .format(props.intl.formatMessage({ id: "format.daymonth" })),
        dateNow
          .subtract(3, "days")
          .format(props.intl.formatMessage({ id: "format.daymonth" })),
        dateNow
          .subtract(2, "days")
          .format(props.intl.formatMessage({ id: "format.daymonth" })),
        dateNow
          .subtract(1, "days")
          .format(props.intl.formatMessage({ id: "format.daymonth" })),
      ],
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
      text: props.intl.formatMessage({ id: "count.boolean.daily.by.date" }),
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

const GroupBooleanDateDemoIntl = injectIntl(GroupBooleanDateDemo);
export default withTheme(GroupBooleanDateDemoIntl);
