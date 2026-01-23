import { floatToStringExtendDot } from "../../../../components/Utils";

export const getChartOptions = ({ theme, isDark, chartData, events, intl }) => {
  return {
    chart: {
      type: 'line',
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
        show: false,
        export: {
          csv: {
            filename: `order_by_month`,
            columnDelimiter: ';',
            headerCategory: 'Date',
          },
          svg: {
            filename: `order_by_month`,
          },
          png: {
            filename: `order_by_month`,
          },
        }
      },
      zoom: {
        enabled: true
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
      events: events || {}
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'top',
        }
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [2],
      offsetY: -5,
      style: {
        fontSize: '11px',
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: 'bold',
        colors: [`${theme.colorPrimary600}80`]
      },
      background: {
        borderWidth: 0,
      },
      formatter: function (val) {
        return floatToStringExtendDot(val, 0) + '%';
      },
      textAnchor: 'middle',
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        rotate: -45,
        rotateAlways: true,
        hideOverlappingLabels: false,
        style: {
          colors: chartData.categories?.map(() => theme.textBasicColor) || [],
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
          fontSize: "12px",
        }
      },
      title: {
        style: {
          color: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
        },
      }
    },
    yaxis: [
      {
        labels: {
          style: {
            colors: theme.colorBasic600,
            fontFamily: theme.fontFamilyPrimary,
          },
          formatter: function (val) {
            return parseInt(val);
          },
        },
        min: 0,
        tickAmount: 4
      }
    ],
    colors: [theme.colorBasic500, theme.colorPrimary500, theme.colorPrimary600],
    title: {
      text: intl.formatMessage({ id: 'orders.by.month' }),
      align: 'center',
      style: {
        fontSize: "12px",
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
      },
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'bottom',
      offsetY: 10,
      labels: {
        colors: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
      }
    },
    grid: {
      show: true,
      strokeDashArray: 1,
    },
    stroke: {
      width: [0, 0, 2],
      dashArray: 4,
      curve: 'straight',
    },
    theme: {
      palette: 'palette1',
      mode: isDark ? 'dark' : 'light'
    }
  };
};

export const processChartData = (data, intl) => {
  const groupedData = data.reduce((acc, item) => {
    if (!item.dataAbertura) return acc;

    const date = new Date(item.dataAbertura);
    if (isNaN(date.getTime())) return acc;

    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!acc[monthYear]) {
      acc[monthYear] = {
        completed: 0,
        total: 0
      };
    }

    if (item.dataConclusao) {
      acc[monthYear].completed++;
    }

    acc[monthYear].total++;


    return acc;
  }, {});

  const sortedMonths = Object.keys(groupedData).sort();

  return {
    categories: sortedMonths.map(date => {
      const [year, month] = date.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return `${monthNames[parseInt(month) - 1]}-${year}`;
    }),
    series: [
      {
        name: intl.formatMessage({ id: 'orders.incomplete' }),
        data: sortedMonths.map(month => groupedData[month].total),
        type: 'column',
      },
      {
        name: intl.formatMessage({ id: 'orders.completed' }),
        data: sortedMonths.map(month => groupedData[month].completed),
        type: 'column',
      },
      {
        name: intl.formatMessage({ id: 'Percentual' }),
        data: sortedMonths.map(month => {
          const total = groupedData[month].total || 1;
          const completed = groupedData[month].completed || 0;
          return (completed / total) * 100;
        }),
        type: 'line',
      }
    ]
  };
};
