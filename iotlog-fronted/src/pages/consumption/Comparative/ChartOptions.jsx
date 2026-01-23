import { floatToStringExtendDot } from '../../../components/Utils';
import moment from 'moment';

export const getChartOptions = ({ theme, consumptionReadings,  unit, isDark }) => {
  const maxValue = Math.max(
    ...consumptionReadings?.map(r => [r.consumptionTelemetry?.value || 0, r.consumptionManual?.value || 0]).flat()
  ) || 200;

  const unitToShow = unit || 'L';

  return {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      stacked: false,
      background: theme.backgroundBasicColor1,
      height: 350,
      animations: {
        enabled: false,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '85%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'center',
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      type: 'category',
      categories: consumptionReadings?.map(reading => moment(reading.timestamp * 1000).format('DD/MM')) || [],
      tickPlacement: 'on',
      axisBorder: {
        show: true,
        color: theme.borderBasicColor3
      },
      axisTicks: {
        show: true,
        color: theme.borderBasicColor3
      },
      labels: {
        rotate: -45,
        rotateAlways: true,
        hideOverlappingLabels: false,
        style: {
          colors: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
          fontSize: "12px"
        }
      }
    },
    yaxis: {
      min: 0,
      max: maxValue * 1.2,
      tickAmount: 5,
      labels: {
        style: {
          colors: theme.colorBasic600,
          fontFamily: theme.fontFamilyPrimary
        },
        formatter: function(value) {
          return `${floatToStringExtendDot(value, 1)} ${unitToShow}`;
        }
      }
    },
    colors: [theme.colorWarning500, theme.colorInfo500],
    legend: {
      position: 'bottom',
      offsetY: 0,
      labels: {
        colors: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary
      },

    },
    fill: {
      opacity: 1
    },
    grid: {
      show: true,
      strokeDashArray: 2,
      borderColor: theme.borderBasicColor3,
      position: 'back',
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    theme: {
      palette: 'palette1',
      mode: isDark ? 'dark' : 'light'
    },
    tooltip: {
      y: {
        formatter: function(value) {
          if (!value) return '0';
          return `${floatToStringExtendDot(value, 3)} ${unitToShow}`;
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }]
  };
};
