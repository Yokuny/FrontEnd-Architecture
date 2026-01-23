import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import {
  ContentChartWrapped,
  urlRedirect,
} from "../../Utils";

const LossDailyChart = (props) => {
  const { losses, title } = props;

  const theme = useTheme();
  const intl = useIntl();

  const machines = props.data?.machines?.map((x) => x.machine?.label);
  const idMachines = props.data?.machines?.map((x) => x.machine?.value);

  let lossesList = [];

  if (props.data?.machines?.length)
    props.data.machines.forEach((x) => {
      const lossFinded = losses?.find((y) => x.machine.value == y.idMachine);
      let lossPercentual =
        lossFinded?.loss > 0 && lossFinded?.produced > 0
          ? (lossFinded?.loss * 100) / (lossFinded?.produced || 0)
          : 0;
      lossesList.push(
        lossPercentual % 1 === 0 ? lossPercentual : lossPercentual?.toFixed(1)
      );
    });

  const series = [
    {
      name: intl.formatMessage({ id: "loss.percentual" }),
      data: lossesList,
    },
  ];

  const typeChart = props.data?.typeChart?.value || "bar";

  const options = {
    chart: {
      id: `lossdailychart_${props.id}`,
      type: typeChart,
      stacked: true,
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
        dataPointSelection: (event, chartContext, config) => {
          const idMachine = idMachines[config.dataPointIndex];
          const machine = props.data?.machines?.find(
            (x) => x.machine?.value == idMachine
          );
          urlRedirect(machine?.link);
        },
      },
    },
    colors: [theme.colorDanger500],
    dataLabels: {
      enabled: true,
      formatter: (value) => `${value}%`,
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
      y: {
        formatter: (value, { dataPointIndex }) => {
          const idMachine = idMachines[dataPointIndex];
          const valueLoss = losses?.find((x) => x.idMachine == idMachine);
          return `${intl.formatMessage({ id: "produced" })}: ${
            valueLoss?.produced || 0
          } <br/>${intl.formatMessage({ id: "loss" })}: ${
            valueLoss?.loss || 0
          } <br/>${intl.formatMessage({
            id: "loss.percentual",
          })}: ${value}%`;
        },
        title: {
          formatter: (seriesName) => "",
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
        key={`lossdailychart_${props.id}`}
        options={options}
        series={series}
        height="100%"
        width="100%"
        type={typeChart}
      />
    </ContentChartWrapped>
  );
};

export default LossDailyChart;
