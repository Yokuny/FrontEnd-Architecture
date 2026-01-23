import React, { useMemo, useCallback } from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import moment from "moment";
import { useIntl } from "react-intl";
import { ContentChartWrapped } from "../../Utils";
import { useThemeSelected } from "../../../Hooks/Theme";
import { floatToStringExtendDot } from "../../../Utils";

const HistoryChart = React.memo((props) => {
  const { series, title, data, isNoShowDataLabel, id, activeEdit, isMobile } = props;

  const intl = useIntl();
  const theme = useTheme();
  const themeSelected = useThemeSelected();

  const typeChart = data?.typeChart?.value || "bar";

  // Memoize filename generation
  const filename = useMemo(() => `history_${new Date().toISOString().slice(0, 10)?.replace(/-/g, "")}`, []);

  // Memoize colors array
  const colors = useMemo(
    () => data?.machines?.map((x) => x.color || theme.colorPrimary500) || [],
    [data?.machines, theme.colorPrimary500]
  );

  const yAxisBounds = useMemo(() => {
    if (!series?.length) return { min: undefined, max: undefined };

    let allValues = [];
    series.forEach((s) => {
      if (s.data && Array.isArray(s.data)) {
        s.data.forEach((point) => {
          const value = Array.isArray(point) ? point[1] : point.y;
          if (value !== null && value !== undefined && !isNaN(value)) {
            allValues.push(value);
          }
        });
      }
    });

    if (allValues.length === 0) return { min: undefined, max: undefined };

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);

    const range = max - min;
    const margin = range * 0.1;

    return {
      min: min - margin,
      max: max + margin,
    };
  }, [series]);

  // Memoize date formatter
  const dateFormatter = useCallback((timestamp) => new Date(timestamp).toISOString(), []);

  // Memoize tooltip formatter
  const tooltipFormatter = useCallback(
    (value) => moment(value).format(intl.formatMessage({ id: "format.datetime" })),
    [intl]
  );

  // Memoize annotations
  const annotations = useMemo(() => {
    if (!data?.annotations?.length) return undefined;

    return {
      position: "front",
      yaxis: data.annotations.map((annotation) => ({
        y: annotation.value,
        borderColor: annotation.color,
        strokeDashArray: 0,
        label: {
          borderColor: annotation.color,
          show: true,
          text: `${annotation.description}: ${annotation.value}`,
          style: {
            color: "#fff",
            background: annotation.color,
          },
        },
      })),
    };
  }, [data?.annotations]);

  // Memoize chart options
  const options = useMemo(() => {
    const baseOptions = {
      chart: {
        id: `history_${id}`,
        background: theme.backgroundBasicColor1,
        type: typeChart,
        animations: {
          enabled: true,
          easing: "linear",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
        toolbar: {
          show: !activeEdit && !isMobile,
          export: {
            csv: {
              filename,
              columnDelimiter: ";",
              headerCategory: "Date",
              dateFormatter,
            },
            svg: { filename },
            png: { filename },
          },
        },
        zoom: { enabled: true },
        foreColor: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
      },
      colors,
      dataLabels: { enabled: !isNoShowDataLabel },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: new Array(series?.length ? series[0]?.data?.length : 1).fill(theme.textHintColor),
            fontFamily: theme.fontFamilyPrimary,
            fontWeight: "600",
          },
          datetimeUTC: false,
        },
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        style: {
          fontSize: "12px",
          fontFamily: theme.fontFamilyPrimary,
        },
        x: {
          show: false,
          formatter: tooltipFormatter,
        },
      },
      yaxis: {
        tickAmount: 3,
        min: yAxisBounds.min,
        max: yAxisBounds.max,
        forceNiceScale: true,
        labels: {
          style: {
            colors: [theme.textHintColor],
            fontFamily: theme.fontFamilyPrimary,
          },
          formatter: (value) => {
            return value ? floatToStringExtendDot(value, 0) : 0;
          },
        },
      },
      legend: {
        show: true,
        foreColor: theme.textHintColor,
        fontFamily: theme.fontFamilyPrimary,
        labels: {
          colors: [theme.textHintColor, theme.textHintColor],
        },
      },
      title: {
        text: title,
        align: "center",
        style: {
          foreColor: theme.textHintColor,
          color: theme.textHintColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "400",
          fontSize: "12px",
        },
      },
      grid: {
        show: true,
        strokeDashArray: 2,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10,
        },
      },
      theme: {
        mode: themeSelected?.isDark ? "dark" : "light",
      },
      stroke: {
        width: 1,
        ...(data?.stepline && { curve: "stepline" }),
      },
    };

    if (annotations) {
      baseOptions.annotations = annotations;
    }

    return baseOptions;
  }, [
    id,
    theme,
    typeChart,
    activeEdit,
    isMobile,
    filename,
    dateFormatter,
    colors,
    isNoShowDataLabel,
    tooltipFormatter,
    title,
    themeSelected?.isDark,
    data?.stepline,
    annotations,
    yAxisBounds,
  ]);

  return (
    <ContentChartWrapped noShadow>
      <ReactApexCharts
        key={`history_${id}`}
        options={options}
        series={series?.length ? series : []}
        height="100%"
        width="100%"
        type={typeChart}
      />
    </ContentChartWrapped>
  );
});

HistoryChart.displayName = "HistoryChart";

export default HistoryChart;
