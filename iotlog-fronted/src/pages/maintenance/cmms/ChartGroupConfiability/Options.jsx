import { floatToStringExtendDot } from "../../../../components/Utils";

export const getOptionsGroupConfiability = ({
  theme,
  intl,
  themeSelected,
  groups,
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
          filename: `group_confiability`,
          columnDelimiter: ';',
          headerCategory: 'Group',
        },
        svg: {
          filename: `group_confiability`,
        },
        png: {
          filename: `group_confiability`,
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
    },
    style: {
      fontSize: '11px'
    }
  },
  xaxis: {
    categories: groups || [],
    labels: {
      style: {
        colors: groups?.map(x => theme.colorBasic600) || [],
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
    text: `Confiabilidade por Grupo Funcional`,
    align: "center",
    style: {
      fontSize: "12px",
      color: theme.colorBasic600,
      fontFamily: theme.fontFamilyPrimary,
      fontWeight: "600",
    },
  }
}); 