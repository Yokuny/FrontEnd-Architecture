import { floatToStringBrazilian, floatToStringExtendDot } from "../../../../components/Utils";

export const getOptionsConfiability = ({
  theme,
  intl,
  themeSelected,
  vessels,
  events
}) => ({
  chart: {
    type: "bar",
    stacked: false,
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
          filename: `opentasks`,
          columnDelimiter: ';',
          headerCategory: 'Date',
        },
        svg: {
          filename: `opentasks`,
        },
        png: {
          filename: `opentasks`,
        },
      }
    },
    zoom: {
      enabled: true,
    },
    foreColor: theme.textBasicColor,
    fontFamily: theme.fontFamilyPrimary,
    events: events || {}
  },
  colors: [theme.colorInfo500],
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        position: 'bottom',
        offsetX: -10,
        offsetY: 0
      }
    }
  }],
  stroke: {
    width: 3,
    dashArray: 0,
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        total: {
          enabled: true,
          style: {
            color: theme.textBasicColor,
            fontFamily: theme.fontFamilyPrimary,
            fontSize: '13px',
            fontWeight: 900
          }
        },
      }
    },
  },
  dataLabels: {
    formatter: function (val) {
      return floatToStringExtendDot(val, 1) + ' %';
    }
  },
  xaxis: {
    categories: vessels || [],
    labels: {
      style: {
        colors: vessels?.map(x => theme.colorBasic600) || [],
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "400",
        fontSize: "12px",
      },
    },
    title: {
      style: {
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
      },
    }
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
    },
    title: {
      // text: 'Quantidade',
      style: {
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
      },
    },
    min: 0,
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
        return `${floatToStringExtendDot(val,1)} %`;
      },
    },
  },
  legend: {
    position: 'right',
    offsetY: 20
  },
  theme: {
    palette: 'palette1',
    mode: themeSelected?.isDark ? 'dark': 'light'
  },
  title: {
    text: `Confiabilidade`,
    align: "center",
    style: {
      fontSize: "12px",
      color: theme.colorBasic600,
      fontFamily: theme.fontFamilyPrimary,
      fontWeight: "600",
    },
  }
})
