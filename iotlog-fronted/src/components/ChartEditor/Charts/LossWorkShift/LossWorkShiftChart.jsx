import React from "react";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { ContentChartWrapped, urlRedirect } from "../../Utils";

const LossWorkShiftChart = (props) => {
  const { losses, title } = props;

  const theme = useTheme();
  const intl = useIntl();

  const series = [
    {
      name: intl.formatMessage({ id: "loss.percentual" }),
      data: losses?.map((x) => {
        let lossPercentual =
          x?.loss > 0 && x?.produced > 0
            ? (x?.loss * 100) / (x?.produced || 0)
            : 0;
        return lossPercentual % 1 === 0
          ? lossPercentual
          : lossPercentual.toFixed(1);
      }),
    },
  ];

  const typeChart = props.data?.typeChart?.value || "bar";

  const options = {
    chart: {
      id: `lossworkshift_${props.id}`,
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
        dataPointSelection: (event, chartContext, { dataPointIndex }) => {
          const workShift = props.data.workShifts[dataPointIndex];
          urlRedirect(workShift?.link);
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
        formatter: (value, opts) => {
          const workShift = props.data.workShifts[opts.dataPointIndex];
          return `${workShift?.description} (${workShift?.initTime}-${workShift?.endTime})`;
        },
      },
      y: {
        formatter: (value, { dataPointIndex }) => {
          const valueLoss = losses[dataPointIndex];
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
        key={`lossworkshift_${props.id}`}
        options={options}
        series={series}
        height="100%"
        width="100%"
        type={typeChart}
      />
    </ContentChartWrapped>
  );
};
export default LossWorkShiftChart;
