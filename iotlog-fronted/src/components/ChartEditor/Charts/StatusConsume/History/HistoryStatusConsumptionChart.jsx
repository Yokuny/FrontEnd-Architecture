import React from "react";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { ContentChart, ContentChartWrapped } from "../../../Utils";
import { useThemeSelected } from "../../../../Hooks/Theme";
import { getIcon } from "../../../../../pages/fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { floatToStringExtendDot } from "../../../../Utils";

const HistoryStatusConsumptionChart = (props) => {
  const { dataHistory, unit, type } = props;

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();

  if (!dataHistory?.series?.length) {
    return <ContentChart></ContentChart>;
  }

  const iconsProps = dataHistory?.series?.map((x) => {
    const icon = getIcon(x.status, theme);
    return {
      icon: icon,
      status: x,
      statusText: intl.formatMessage({ id: icon?.text }),
    };
  });

  const colors = iconsProps?.map((x) => x.icon?.bgColor);

  const options = {
    chart: {
      background: theme.backgroundBasicColor1,
      id: `hT_CCo_${props.id}`,
      type: "bar",
      stacked: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: theme.fontFamilyPrimary,
              color: theme.textBasicColor,
            },
            formatter: function (w) {
              if (type === "consume") {
                return floatToStringExtendDot(w, 1);
              }
              return `${floatToStringExtendDot(w, 2)} H`;
            },
          },
        },
      },
    },
    xaxis: {
      categories: dataHistory?.months,
    },
    colors: colors,
    dataLabels: {
      enabled: true,
      formatter: function (val, { seriesIndex, dataPointIndex, w }) {
        if (type === "consume") {
          return floatToStringExtendDot(val, 1);
        }
        const total = columnTotals[dataPointIndex];
        const percentage = ((val / total) * 100);
        return `${floatToStringExtendDot(percentage, 1)}%`;
      },
    },
    yaxis: {
      tickAmount: 0,
      show: false,
    },
    tooltip: {
      enabled: true,
      shared: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex];
        const total = columnTotals[dataPointIndex];
        const percentage = ((value / total) * 100);
        const statusName = w.globals.seriesNames[seriesIndex];

        const valueStr = type === "consume"
          ? `${floatToStringExtendDot(value, 1)} ${unit}`
          : `${floatToStringExtendDot(value, 2)} ${intl.formatMessage({
              id: "hour.unity",
            })}`;

        return `<div class="apexcharts-tooltip-title">
          ${dataHistory?.months[dataPointIndex]}
        </div>
        <div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 1; display: flex;">
          <div class="apexcharts-tooltip-text">
            <div class="apexcharts-tooltip-y-group" style="display: flex; align-items: center; gap: 6px">
              <div style="background-color: ${colors[seriesIndex]}; height: 14px; width: 14px; border-radius: 50%;"></div>
              <span>${statusName}: ${valueStr} <strong>(${floatToStringExtendDot(percentage, 1)}%)</strong></span>
            </div>
          </div>
        </div>`;
      }
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    title: {
      text: props.title,
      align: "center",
      style: {
        fontSize: "13px",
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "500",
      },
    },
    theme: {
      palette: "palette1",
      mode: themeSelected?.isDark ? "dark" : "light",
    },
  };

  const columnTotals = dataHistory?.series?.[0]?.[type === "consume" ? "consumption" : "minutes"]?.map((_, colIndex) => {
    return dataHistory.series.reduce((total, serie) => {
      const value = type === "consume"
        ? parseFloat((unit === "L" ? serie.consumption[colIndex] : serie.consumption[colIndex] / 1000).toFixed(1))
        : parseFloat((serie.minutes[colIndex] / 60).toFixed(2));
      return total + (isNaN(value) ? 0 : value);
    }, 0);
  }) || [];

  const series = dataHistory?.series?.map((x) => {
    return {
      name: intl.formatMessage({ id: getIcon(x.status, theme)?.text }),
      data:
        type === "consume"
          ? x.consumption.map((y) =>
              parseFloat((unit === "L" ? y : y / 1000).toFixed(1))
            )
          : x.minutes.map((y) => parseFloat(y / 60).toFixed(2)),
    };
  });

  return (
    <ContentChartWrapped noShadow>
      <ReactApexCharts
        key={`hT_CCo_${props.id}`}
        options={options}
        series={series}
        height="100%"
        width="100%"
        type={"bar"}
      />
    </ContentChartWrapped>
  );
};

export default HistoryStatusConsumptionChart;
