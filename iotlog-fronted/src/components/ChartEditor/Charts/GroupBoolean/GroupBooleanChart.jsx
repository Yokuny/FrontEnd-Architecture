import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { ContentChartWrapped } from "../../Utils";
import { useIntl } from "react-intl";
const colors = [
  "#FC5050",
  "#F5B544",
  "#FC777D",
  "#edcdab",
  "#D645D4",
  "#D67B45",
  "#f7a037",
  "#ec1010",
  "#FAF669",
  "#FCBADD",
];

const GroupBooleanChart = (props) => {
  const { countSignalsTrue, title } = props;

  const theme = useTheme();
  const intl = useIntl();

  let valueToShow = [];
  let sensorsToShow = [];

  if (props.data?.machines?.length)
    props.data.machines.forEach((x) => {
      let value = countSignalsTrue?.length
        ? (
            countSignalsTrue.find(
              (y) =>
                y.idMachine == x.machine?.value && y.sensorId == x.sensor?.value
            ) || { total: 0 }
          ).total
        : 0;

      if (
        !props.data.isViewThanMoreZero ||
        (!!props.data.isViewThanMoreZero && value > 0)
      ) {
        valueToShow.push(value);
        sensorsToShow.push(x.sensor?.title ?? x.sensor?.value);
      }
    });

  const typeChart = props.data?.typeChart?.value || "bar";

  const series =
    typeChart == "pie"
      ? valueToShow
      : [
          {
            data: valueToShow,
          },
        ];

  const options =
    typeChart == "pie"
      ? {
          chart: {
            type: "pie",
          },
          labels: sensorsToShow || [],
          colors: colors,
          legend: {
            position: "bottom",
          },
          title: {
            text: `${title ? `${title} - ` : ""}${props.dateFilter.format(
              intl.formatMessage({ id: "format.daymonth" })
            )}`,
            align: "center",
            style: {
              foreColor: theme.textBasicColor,
              fontFamily: theme.fontFamilyPrimary,
              fontWeight: "600",
              fontSize: "13px",
            },
          },
        }
      : {
          chart: {
            id: `group_count_boolean${props.id}`,
            type: typeChart,
            animations: {
              enabled: true,
              easing: "linear",
              dynamicAnimation: {
                speed: 1000,
              },
            },
            toolbar: {
              show: !props.activeEdit && !props.isMobile,
            },
            zoom: {
              enabled: false,
            },
            foreColor: theme.textBasicColor,
            fontFamily: theme.fontFamilyPrimary,
          },
          colors: [props.data.color || theme.colorPrimary500],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            categories: sensorsToShow || [],
            labels: {
              style: {
                foreColor: theme.textBasicColor,
                fontFamily: theme.fontFamilyPrimary,
                fontWeight: "600",
              },
            },
          },
          tooltip: {
            enabled: true,
            theme: "dark",
            style: {
              fontSize: "12px",
              fontFamily: theme.fontFamilyPrimary,
            },
            y: {
              title: {
                formatter: (seriesName) => "",
              },
            },
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
          },
          title: {
            text: `${title ? `${title} - ` : ""}${props.dateFilter.format(
              intl.formatMessage({ id: "format.daymonth" })
            )}`,
            align: "center",
            style: {
              foreColor: theme.textBasicColor,
              fontFamily: theme.fontFamilyPrimary,
              fontWeight: "600",
              fontSize: "13px",
            },
          },
        };

  return (
    <ContentChartWrapped>
      <div style={{ height: 1 }}></div>
      <ReactApexCharts
        key={`boolean_group${props.id}`}
        options={options}
        series={series}
        height="100%"
        width="100%"
        type={typeChart}
      />
      <div style={{ height: 1 }}></div>
    </ContentChartWrapped>
  );
};
export default GroupBooleanChart;
