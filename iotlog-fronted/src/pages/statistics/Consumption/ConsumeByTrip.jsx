import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";

export default function ConsumeByTrip(props) {

  const theme = useTheme();

  const options = {
    chart: {
      id: `consume_by_trip`,
      type: 'bar',
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
        show: true,
      },
      zoom: {
        enabled: true,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    colors: [theme.colorPrimary500],
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: ["202201","202202","202204","DE 4584"],
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: theme.fontFamilyPrimary,
      }
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
        },
      },
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    title: {
      text: 'Viagem',
      align: "center",
      style: {
        foreColor: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
        fontSize: "13px",
      },
    },
  };

  const series = [
    {
      name: 'Consumo',
      data: [50,80,120,20]
    }
  ]

  return (
    <>
      <ReactApexCharts
        key={`consume_by_trip`}
        options={options}
        series={series}
        height={350}
        width="100%"
        type="bar"
      />
    </>
  )
}
