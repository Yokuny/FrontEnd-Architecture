export const getOptionsDaily = ({
  theme,
  intl,
  themeSelected,
}) => ({
  chart: {
    type: "line",
    animations: {
      enabled: false,
      easing: "linear",
      dynamicAnimation: {
        speed: 1000,
      },
    },
    background: theme.backgroundBasicColor1,
    toolbar: {
      show: true,
      export: {
        csv: {
          filename: `operationaltime`,
          columnDelimiter: ';',
          headerCategory: 'Date',
        },
        svg: {
          filename: `operationaltime`,
        },
        png: {
          filename: `operationaltime`,
        },
      }
    },
    zoom: {
      enabled: true,
    },
    foreColor: theme.textBasicColor,
    fontFamily: theme.fontFamilyPrimary,
  },
  colors: [theme.colorPrimary500],
  markers: {
    shape: "circle",
    size: 2,
    strokeColors: theme.colorPrimary500,
  },
  dataLabels: {
    enabled: false,
    formatter: function (val) {
      return `${val ? parseFloat(val.toFixed(2)) : 0}%`;
    },
    style: {
      fontFamily: theme.fontFamilyPrimary,
    },
    background: {
      enabled: true,
    },
    offsetY: -1,
  },
  stroke: {
    width: 3,
    dashArray: 0,
  },
  xaxis: {
    type: "datetime",
    format: "dd/MMM",
    labels: {
      style: {
        color: theme.textHintColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "400",
        fontSize: "12px",
      },
      datetimeUTC: false
    },
  },
  yaxis: {
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      style: {
        colors: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
      },
      formatter: function (val) {
        return `${val ? parseFloat(val.toFixed(2)) : 0}%`;
      }
    },
    title: {
      text: intl.formatMessage({ id: "operating.rate" }),
      style: {
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
      },
    },
    min: 0,
    max: 100,
    tickAmount: 5
  },
  grid: {
    show: true,
    strokeDashArray: 2,
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: function (val) {
        return `${val ? parseFloat(val.toFixed(2)) : 0}%`;
      },
    },
    z: {
      formatter: function (val) {
        return `${val ? parseFloat(val.toFixed(1)) : 0}`;
      },
      title: intl.formatMessage({ id: "hour.unity" })
    },
  },
  legend: {
    show: true,
    foreColor: theme.textBasicColor,
    fontFamily: theme.fontFamilyPrimary,
  },
  theme: {
    palette: 'palette1',
    mode: themeSelected?.isDark? 'dark': 'light'
  },
  title: {
    text: `${intl.formatMessage({ id: "avg.daily.operational" })
  }`,
    align: "center",
    style: {
      fontSize: "12px",
      color: theme.colorBasic600,
      fontFamily: theme.fontFamilyPrimary,
      fontWeight: "600",
    },
  }
})
