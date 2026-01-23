import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { ContentChartWrapped } from "../../Utils";

const GoalOperatorChart = (props) => {
  const { produced, title } = props;

  const theme = useTheme();
  const intl = useIntl();

  let producedByOperator = [];
  let goal = [];

  if (produced?.length && props.data?.operators?.length) {
    props.data.operators.forEach((x) => {
      const totalProduced = produced
        .filter((y) => y.operator == x.operator?.codeIntegrationUser)
        .reduce((a, b) => a + b.produced, 0);
      producedByOperator.push(totalProduced);
      goal.push(
        produced.find((y) => y.operator == x.operator?.codeIntegrationUser)
          ?.dailyGoal || 0
      );
    });
  }

  const series = [
    {
      name: intl.formatMessage({ id: "produced" }),
      data: producedByOperator,
    },
    {
      name: intl.formatMessage({ id: "goal" }),
      data: goal,
    },
  ];

  const typeChart = props.data?.typeChart?.value || "bar";

  const options = {
    chart: {
      id: `goaloperator_${props.id}`,
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
      categories: props.data.operators?.map((x) => x.operator?.name) || [],
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
        key={`goaloperator_${props.id}`}
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
