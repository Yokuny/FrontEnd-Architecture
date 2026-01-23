import ReactECharts from "echarts-for-react";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import { floatToStringExtendDot } from "../../../../components/Utils";

export default function ChartRVERDO(props) {
  const { data, asset, showDataLabels, unit } = props;

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();

  const chartRef = React.useRef(null);
  const [zoomRange, setZoomRange] = React.useState({ start: 0, end: 100 });


  const dataSorted = React.useMemo(() => {
    return [...(data || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  const categories = React.useMemo(() => {
    return dataSorted.map(item => moment(item.date).format("DD/MMM"));
  }, [dataSorted]);

  const consumptionMaxData = React.useMemo(() => {
    return dataSorted.map(item => {
      const maxInThisDay = item.operations?.reduce((acc, operation) =>
        acc + (operation?.consumptionDailyContract
          ? ((operation?.consumptionDailyContract / 24) * operation?.diffInHours)
          : 0),
        0) || 0;
      return Number((unit === "m³" ? maxInThisDay : maxInThisDay * 1000).toFixed(3));
    });
  }, [dataSorted]);

  const consumptionEstimatedData = React.useMemo(() => {
    return dataSorted.map((item, index) => {
      const val = item.consumptionEstimated;
      const estimated = val !== undefined && val !== null
        ? Number((unit === "m³" ? val : val * 1000).toFixed(3)) : null;
      const max = consumptionMaxData[index];
      const isExceeded = estimated !== null && max !== null && estimated > max;

      return {
        value: estimated,
        itemStyle: {
          color: isExceeded ? theme.colorDanger500 : theme.colorSuccess500
        }
      };
    });
  }, [dataSorted, consumptionMaxData, theme.colorDanger500, theme.colorSuccess500]);

  const visualMapPieces = React.useMemo(() => {
    return dataSorted.map((item, index) => {
      const val = item.consumptionEstimated;
      const estimated = val !== undefined && val !== null ? Number((unit === "m³" ? val : val * 1000).toFixed(3)) : null;
      const max = consumptionMaxData[index];
      const isExceeded = estimated !== null && max !== null && estimated > max;
      return {
        gt: index - 1,
        lte: index,
        color: isExceeded ? theme.colorDanger500 : theme.colorSuccess500
      };
    });
  }, [dataSorted, consumptionMaxData, theme.colorDanger500, theme.colorSuccess500]);

  const getFilteredDataByZoom = React.useCallback(() => {
    const totalItems = dataSorted.length;
    const startIndex = Math.floor((zoomRange.start / 100) * totalItems);
    const endIndex = Math.ceil((zoomRange.end / 100) * totalItems);
    return dataSorted.slice(startIndex, endIndex);
  }, [dataSorted, zoomRange]);

  const filteredDataByZoom = React.useMemo(() => {
    return getFilteredDataByZoom();
  }, [getFilteredDataByZoom]);

  const zoomPeriodLabel = React.useMemo(() => {
    if (filteredDataByZoom.length === 0) return "";
    const startDate = moment(filteredDataByZoom[0]?.date).format("DD/MMM/YYYY");
    const endDate = moment(filteredDataByZoom[filteredDataByZoom.length - 1]?.date).format("DD/MMM/YYYY");
    if (startDate === endDate) return `(${startDate})`;
    return `(${startDate} - ${endDate})`;
  }, [filteredDataByZoom]);

  const pieChartData = React.useMemo(() => {
    const codeDataMap = {};

    filteredDataByZoom.forEach(item => {
      item.operations?.forEach(operation => {
        const code = operation?.code || intl.formatMessage({ id: "unknown" });
        const hours = operation?.diffInHours || 0;
        const maxConsumptionValue = operation?.consumptionDailyContract
          ? ((operation?.consumptionDailyContract / 24) * hours)
          : 0;
        const maxConsumption = unit === "m³" ? maxConsumptionValue : maxConsumptionValue * 1000;
        if (codeDataMap[code]) {
          codeDataMap[code].hours += hours;
          codeDataMap[code].maxConsumption += maxConsumption;
        } else {
          codeDataMap[code] = { hours, maxConsumption };
        }
      });
    });

    return Object.entries(codeDataMap).map(([name, data]) => ({
      name,
      value: Number(data.hours.toFixed(2)),
      maxConsumption: Number(data.maxConsumption.toFixed(3))
    })).sort((a, b) => b.value - a.value);
  }, [filteredDataByZoom, intl]);

  const handleZoomChange = React.useCallback(() => {
    if (chartRef.current) {
      const option = chartRef.current.getOption();
      if (option.dataZoom && option.dataZoom.length > 0) {
        const start = option.dataZoom[0].start;
        const end = option.dataZoom[0].end;
        if (start !== undefined && end !== undefined) {
          setZoomRange({ start, end });
        }
      }
    }
  }, []);

  const options = {
    backgroundColor: theme.backgroundBasicColor1,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      },
      formatter: (params) => {
        let tooltip = `<strong>${params[0]?.axisValue}</strong><br/>`;
        params.forEach(param => {
          if (param.value !== null && param.value !== undefined) {
            tooltip += `${param.marker} ${param.seriesName}: <strong>${floatToStringExtendDot(param.value)}</strong> ${unit}<br/>`;
          }
        });
        return tooltip;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: {
        color: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary
      }
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: "none"
        },
        restore: {
          title: "Reset"
        },
        saveAsImage: {
          title: "Download",
          name: `rve-rdo-${asset?.name || "chart"}`
        }
      }
    },
    dataZoom: [
      {
        type: "slider",
        height: 20,
        bottom: 30
      }
    ],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "22%",
      top: "15%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: categories,
      boundaryGap: false,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        rotate: categories.length > 15 ? 45 : 0
      }
    },
    yAxis: {
      type: "value",
      name: `${intl.formatMessage({ id: "consumption" })} (${unit})`,
      nameLocation: "middle",
      nameGap: 50,
      min: 0,
      axisLine: {
        show: true,
        lineStyle: {
          color: theme.colorBasic600
        }
      },
      axisLabel: {
        color: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary
      },
      nameTextStyle: {
        color: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: themeSelected?.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"
        }
      }
    },
    visualMap: {
      show: false,
      dimension: 0,
      seriesIndex: 1,
      pieces: visualMapPieces
    },
    series: [
      {
        name: intl.formatMessage({ id: "consumption.max.contract" }),
        type: "line",
        smooth: false,
        data: consumptionMaxData,
        lineStyle: {
          width: 3,
          color: theme.colorPrimary500,
          type: "dashed"
        },
        itemStyle: {
          color: theme.colorPrimary500
        },
        label: {
          show: showDataLabels,
          position: "top",
          fontSize: 10,
          color: theme.colorPrimary400,
          fontFamily: theme.fontFamilyPrimary,
          formatter: (params) => floatToStringExtendDot(params.value, 1)
        }
      },
      {
        name: intl.formatMessage({ id: "consumption.pointed" }),
        type: "line",
        smooth: false,
        data: consumptionEstimatedData,
        lineStyle: {
          width: 3
        },
        label: {
          show: showDataLabels,
          position: "bottom",
          fontSize: 10,
          fontFamily: theme.fontFamilyPrimary,
          formatter: (params) => floatToStringExtendDot(params.value, 1)
        }
      }
    ]
  };

  const pieOptions = React.useMemo(() => ({
    backgroundColor: theme.backgroundBasicColor1,
    title: {
      text: `${intl.formatMessage({ id: "distribution" })} ${zoomPeriodLabel}`,
      left: "center",
      top: 0,
      textStyle: {
        color: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontSize: 14
      }
    },
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        return `${params.marker} ${params.name}: <strong>${floatToStringExtendDot(params.value, 2)}</strong> h (${floatToStringExtendDot(params.percent, 1)}%)<br/>Consumo máx.: <strong>${floatToStringExtendDot(params.data.maxConsumption, 2)}</strong> ${unit}`;
      }
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: {
        color: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary
      }
    },
    series: [
      {
        name: intl.formatMessage({ id: "distribution" }),
        type: "pie",
        radius: ["30%", "50%"],
        center: ["50%", "50%"],
        top: 30,
        bottom: 40,
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: theme.backgroundBasicColor1,
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: (params) => `${params.name}\n${floatToStringExtendDot(params.value, 2)} h`,
          color: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: true
        },
        data: pieChartData
      }
    ]
  }), [pieChartData, theme, intl, zoomPeriodLabel]);

  const onChartReady = React.useCallback((chartInstance) => {
    chartRef.current = chartInstance;
  }, []);

  const onEvents = React.useMemo(() => ({
    datazoom: handleZoomChange
  }), [handleZoomChange]);

  return (
    <>
      <ReactECharts
        option={options}
        style={{ height: 450 }}
        notMerge={false}
        onChartReady={onChartReady}
        onEvents={onEvents}
      />
      <ReactECharts
        option={pieOptions}
        style={{ height: 400, marginTop: 20 }}
        notMerge={true}
      />
    </>
  );
}
