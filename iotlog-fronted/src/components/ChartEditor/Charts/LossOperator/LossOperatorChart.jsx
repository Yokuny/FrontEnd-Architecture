import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { ContentChartWrapped } from "../../Utils";


const LossOperatorChart = (props) => {
  const { losses, title } = props;

  const theme = useTheme();
  const intl = useIntl();

  let lossesList = [];
  let lossesByUser = []

  if (losses?.length && props.data?.operators?.length) {
    props.data.operators.forEach((x) => {
      const totalProduced = losses
        .filter((y) => y.operator == x.operator?.codeIntegrationUser)
        .reduce((a, b) => a + b.produced, 0);
      const totalLoss = losses
        .filter((y) => y.operator == x.operator?.codeIntegrationUser)
        .reduce((a, b) => a + b.loss, 0);

      let lossPercentual =
        totalLoss > 0 && totalProduced > 0
          ? (totalLoss * 100) / (totalProduced || 0)
          : 0;

      lossesList.push(
        lossPercentual % 1 === 0 ? lossPercentual : lossPercentual?.toFixed(1)
      );
      lossesByUser.push({
        codeUser: x.operator?.codeIntegrationUser,
        loss: totalLoss,
        produced: totalProduced
      })
    });
  }

  const series = [
    {
      name: intl.formatMessage({ id: "loss.percentual" }),
      data: lossesList,
    },
  ];

  const typeChart = props.data?.typeChart?.value || "bar";

  const options = {
    chart: {
      id: `lossoperatorchart_${props.id}`,
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
      y: {
        formatter: (value, { dataPointIndex }) => {
          const valueLoss = lossesByUser[dataPointIndex];
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
        key={`lossoperatorchart_${props.id}`}
        options={options}
        series={series}
        height="100%"
        width="100%"
        type={typeChart}
      />
    </ContentChartWrapped>
  );
};
export default LossOperatorChart;
