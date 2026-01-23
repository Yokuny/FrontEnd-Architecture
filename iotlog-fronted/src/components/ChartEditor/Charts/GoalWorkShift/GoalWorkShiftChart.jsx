import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { ContentChartWrapped, urlRedirect } from "../../Utils";

const GoalWorkShiftChart = (props) => {
  const { produces, title } = props;

  const theme = useTheme();
  const intl = useIntl();

  const series = [
    {
      name: intl.formatMessage({ id: "produced" }),
      data: produces?.map((x) => x.produced),
    },
    {
      name: intl.formatMessage({ id: "goal" }),
      data: produces?.map((x) => x.dailyGoal),
    },
  ];

  const typeChart = props.data?.typeChart?.value || "bar";

  const options = {
    chart: {
      id: `goalworkshift_${props.id}`,
      type: typeChart,
      stacked: !!props.data.stacked,
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
      events: {
        dataPointSelection: (event, chartContext, { dataPointIndex }) => {
          const workShift = props.data.workShifts[dataPointIndex];
          urlRedirect(workShift?.link);
        },
      },
    },
    colors: [
      props.data.colorProduced || theme.colorSuccess500,
      props.data.colorGoal || theme.colorWarning500,
    ],
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: theme.fontFamilyPrimary,
      },
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: props.data.workShifts?.map((x) => x.description) || [],
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
      intersect: true,
      shared: false,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: theme.fontFamilyPrimary,
      },
      x: {
        formatter: (value, { dataPointIndex }) => {
          const workShift = props.data.workShifts[dataPointIndex];
          return `${workShift?.description} (${workShift?.initTime}-${workShift?.endTime})`;
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
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
        key={`goalworkshift_${props.id}`}
        options={options}
        series={series}
        height="100%"
        width="100%"
        type={typeChart}
      />
    </ContentChartWrapped>
  );
};
export default GoalWorkShiftChart;
