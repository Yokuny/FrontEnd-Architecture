import moment from "moment";

export function capitalizeFirstLetter(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export const getEChartsOptions = ({
  theme,
  intl,
  data,
  machine,
  isReal,
  isEstimated,
  themeSelected
}) => {
  const categories = data?.map(item => moment(item?.date).format('DD/MMM'))?.reverse() || [];

  const realData = data?.map(item => {
    const val = Number(item?.consumptionReal?.value);
    return !isNaN(val) ? Number(val.toFixed(3)) : 0;
  })?.reverse() || [];
  const estimatedData = data?.map(item => {
    const val = Number(item?.consumption?.value);
    return !isNaN(val) ? Number(val.toFixed(3)) : 0;
  })?.reverse() || [];
  const hoursData = data?.map(item => item?.hours)?.reverse() || [];

  const series = [];
  const yAxis = [];
  let yAxisIndex = 0;

  if (isReal) {
    series.push({
      name: `${intl.formatMessage({ id: "polling" })} (${data?.[0]?.consumptionReal?.unit || ''})`,
      type: 'line',
      smooth: true,
      data: realData,
      yAxisIndex: yAxisIndex,
      lineStyle: {
        width: 3,
        color: theme.colorPrimary500
      },
      itemStyle: {
        color: theme.colorPrimary500
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 10,
        color: theme.colorPrimary500
      }
    });
    yAxis.push({
      type: 'value',
      name: `${intl.formatMessage({ id: "real.consumption" })} (${data?.length ? data[0]?.consumption?.unit || '' : ''})`,
      nameLocation: 'middle',
      nameGap: isEstimated ? 45 : 50,
      nameRotate: -90,
      position: 'right',
      offset: isEstimated ? 60 : 0,
      min: 0,
      axisLine: {
        show: true,
        lineStyle: {
          color: theme.colorPrimary500
        }
      },
      axisLabel: {
        color: theme.colorPrimary500,
        fontFamily: theme.fontFamilyPrimary
      },
      nameTextStyle: {
        color: theme.colorPrimary500,
        fontFamily: theme.fontFamilyPrimary
      },
      splitLine: {
        show: false
      }
    });
    yAxisIndex++;
  }

  if (isEstimated) {
    series.push({
      name: `${intl.formatMessage({ id: "flowmeter" })} (${data?.[0]?.consumption?.unit || ''})`,
      type: 'line',
      smooth: true,
      data: estimatedData,
      yAxisIndex: yAxisIndex,
      lineStyle: {
        width: 3,
        color: theme.colorWarning500
      },
      itemStyle: {
        color: theme.colorWarning500
      },
      label: {
        show: true,
        position: 'right',
        fontSize: 10,
        color: theme.colorWarning500
      }
    });
    yAxis.push({
      type: 'value',
      name: `${intl.formatMessage({ id: "estimated.consumption" })} (${data?.[0]?.consumption?.unit || ''})`,
      nameLocation: 'middle',
      nameGap: 43,
      nameRotate: -90,
      position: 'right',
      min: 0,
      axisLine: {
        show: true,
        lineStyle: {
          color: theme.colorWarning500
        }
      },
      axisLabel: {
        color: theme.colorWarning500,
        fontFamily: theme.fontFamilyPrimary
      },
      nameTextStyle: {
        color: theme.colorWarning500,
        fontFamily: theme.fontFamilyPrimary
      },
      splitLine: {
        show: false
      }
    });
    yAxisIndex++;
  }

  // Hours bar chart (always shown)
  series.push({
    name: capitalizeFirstLetter(intl.formatMessage({ id: "hours" })),
    type: 'bar',
    data: hoursData,
    yAxisIndex: yAxisIndex,
    barWidth: '30%',
    itemStyle: {
      color: theme.colorBasic600
    }
  });
  yAxis.push({
    type: 'value',
    name: capitalizeFirstLetter(intl.formatMessage({ id: "hours" })),
    position: 'left',
    min: 0,
    max: 24,
    axisLine: {
      show: true,
      lineStyle: {
        color: theme.colorBasic600
      }
    },
    axisLabel: {
      color: theme.colorBasic600,
      fontFamily: theme.fontFamilyPrimary,
      formatter: (val) => val ? parseInt(val) : 0
    },
    nameTextStyle: {
      color: theme.colorBasic600,
      fontFamily: theme.fontFamilyPrimary
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: themeSelected?.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
      }
    }
  });

  return {
    backgroundColor: theme.backgroundBasicColor1,
    title: {
      text: `${intl.formatMessage({ id: "consumption.daily" })} 24hrs`,
      left: 'center',
      textStyle: {
        fontSize: 12,
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
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
    toolbox: machine ? {
      show: true,
      feature: {
        saveAsImage: {
          title: 'Download',
          name: 'dailyconsumption'
        }
      }
    } : { show: false },
    grid: {
      left: '1%',
      right: isReal && isEstimated ? '4%' : '3%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary
      }
    },
    yAxis: yAxis,
    series: series
  };
};
