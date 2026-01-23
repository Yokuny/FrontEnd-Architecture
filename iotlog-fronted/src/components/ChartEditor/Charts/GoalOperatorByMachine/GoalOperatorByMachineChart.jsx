import React from "react";
import { useTheme, withTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { injectIntl, useIntl } from "react-intl";
import { ContainerChartThemed, ContentChartWrapped } from "../../Utils";

const GoalOperatorChart = (props) => {
  const { produced, title } = props;

  const theme = useTheme();
  const intl = useIntl();

  const series = [
    {
      name: intl.formatMessage({ id: "working" }),
      data: produced?.data?.map((x) => x.working || null) || [],
    },
    {
      name: intl.formatMessage({ id: "finished" }),
      data: produced?.data?.map((x) => x.finished || null) || [],
    },
    {
      name: intl.formatMessage({ id: "goal" }),
      data: new Array(produced?.data?.length || 0)
        .fill()
        .map((x) => produced?.goal),
    },
  ];

  const typeChart = props.data?.typeChart?.value || "bar";

  const options = {
    chart: {
      id: `goaloperatorbymachine_${props.id}`,
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
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -8,
      style: {
        fontFamily: theme.fontFamilyPrimary,
      },
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories:
        produced?.data?.map(
          (x) => x.name || intl.formatMessage({ id: "unknown" })
        ) || [],
      labels: {
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
      tickAmount: 4,
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
        },
      },
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
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
      <ReactApexCharts
        key={`goaloperatorbymachine_${props.id}`}
        options={options}
        series={series}
        height="100%"
        width="100%"
        type={typeChart}
      />
    </ContentChartWrapped>
  );
};
export default GoalOperatorChart;
