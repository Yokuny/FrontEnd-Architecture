import { floatToStringExtendDot } from "../../../../components/Utils";

export const getOptionsPie = ({
  theme,
  intl
}) => ({
  chart: {
    type: 'donut',
    foreColor: theme.textBasicColor,
  },
  colors: [theme.colorDanger500,theme.colorPrimary500],
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
      }
    }
  },
  legend: {
    show: true,
    position: 'bottom',
    foreColor: theme.textBasicColor,
    fontFamily: theme.fontFamilyPrimary,
  },
  dataLabels: {
    enabled: true,
    style: {
      fontFamily: theme.fontFamilyPrimary,
    }
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (value) => `${floatToStringExtendDot(value, 1)} H`
    }
  },
  labels: [
    intl.formatMessage({ id: "time.inoperability" }),
    intl.formatMessage({ id: "time.operational" }),
  ],
  stroke: {
    show: false
  }
})
