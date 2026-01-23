export const getBaseOptions = ({
  theme,
  colors,
  dataLabelFormatter,
  enabledOnSeries = undefined,
}) => {
  return {
    chart: {
      stacked: true,
      toolbar: {
        show: true,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
      background: theme.backgroundBasicColor1,
    },
    colors: colors
      ? colors
      : [
          theme.colorPrimary500,
          theme.colorSuccess500,
          theme.colorWarning500,
          theme.colorSuccess300,
        ],
    dataLabels: {
      enabled: true,
      enabledOnSeries,
      style: {
        fontFamily: theme.fontFamilyPrimary,
      },
      ...(dataLabelFormatter && { formatter: dataLabelFormatter }),
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
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
  };
};

export const getBarChartOptions = ({ theme, categories }) => {
  return {
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45, // Rotaciona os rótulos em -45 graus (diagonal para baixo e para a direita)
        rotateAlways: true, // Garante que a rotação seja aplicada sempre, independente do espaço disponível.
        hideOverlappingLabels: false,
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
        },
      },
    },
  };
};

export const getMultiYAxisBarChartOptions = ({ theme, labels, categories, curve="smooth" }) => {
  return {
    stroke: {
      curve: curve,
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45, // Rotaciona os rótulos em -45 graus (diagonal para baixo e para a direita)
        rotateAlways: true, // Garante que a rotação seja aplicada sempre, independente do espaço disponível.
        hideOverlappingLabels: false,
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
        },
      },
    },
    yaxis: [
      {
        opposite: true,
        labels: {
          formatter: function (value) {
            if (!value) return "0";
            if (value > 1_000_000) {
              return parseInt(value / 1_000_000) + " M";
            }
            if (value > 1_000) {
              return parseInt(value / 1_000) + " K";
            }
            return parseInt(value);
          },
          style: {
            foreColor: theme.textBasicColor,
            fontFamily: theme.fontFamilyPrimary,
            fontWeight: "600",
          },
        },
        title: {
          text: labels[0],
        },
      },
      {
        labels: {
          formatter: function (value) {
            return parseInt(value); // 1 decimal place
          },
          style: {
            foreColor: theme.textBasicColor,
            fontFamily: theme.fontFamilyPrimary,
          },
        },
        title: {
          text: labels[1],
        },
      },
    ],
  };
};

export const getDonutChartOptions = ({ theme, labels }) => {
  return {
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              color: theme.textBasicColor,
              fontFamily: theme.fontFamilyPrimary,
              fontSize: "21px",
              offsetY: 2,
            },
          },
        },
      },
    },
    labels,
  };
};

export const formatDependantAxisCategories = (data, dependantAxis) => {
  return data.map((groupData) => {
    if (dependantAxis === "month") {
      return `${groupData?._id?.month}-${groupData?._id?.year}`;
    }
    if (dependantAxis === "year") {
      return `${groupData?._id?.year}`;
    }
    return groupData?._id ?? "null";
  });
};
