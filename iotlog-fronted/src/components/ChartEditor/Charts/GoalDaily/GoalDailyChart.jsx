import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { ContentChartWrapped, urlRedirect } from "../../Utils";

const GoalDailyChart = (props) => {
  const { produces, goals, title } = props;

  const theme = useTheme();
  const intl = useIntl();

  const machines = props.data?.machines?.map((x) => x.machine?.label);

  let produced = [];
  let goal = [];

  if (props.data?.machines?.length)
    props.data.machines.forEach((x) => {
      const producedFinded = produces?.find(
        (y) => x.machine.value == y.idMachine
      );
      produced.push(producedFinded ? producedFinded.produced : 0);

      const goalFinded = goals?.find((y) => x.machine.value == y.idMachine);
      goal.push(goalFinded ? goalFinded.dailyGoal : 0);
    });

  const series = [
    {
      name: intl.formatMessage({ id: "produced" }),
      data: produced,
    },
    {
      name: intl.formatMessage({ id: "goal" }),
      data: goal,
    },
  ];

  const typeChart = props.data?.typeChart?.value || "bar";

  const options = {
    chart: {
      id: `goaldailychart_${props.id}`,
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
          const machine = props.data?.machines[dataPointIndex];
          urlRedirect(machine?.link);
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
      categories: machines || [],
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
        key={`goaldailychart_${props.id}`}
        options={options}
        series={series}
        height="100%"
        width="100%"
        type={typeChart}
      />
    </ContentChartWrapped>
  );
};
export default GoalDailyChart;
