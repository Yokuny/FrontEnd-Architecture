import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";
import React from "react";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { getColorByIndex } from "../services/UtilsService";

export default function ChartSubgroup(props) {

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();

  const { data } = props;

  const subGroupsDistincts = [...new Set(data?.map(x => x.subgroup || "N/A") || [])];

  const totalOperation = data?.length;

  const series = [
    {
      name: intl.formatMessage({ id: 'total' }),
      data: subGroupsDistincts?.map(m => {
        return data?.filter(y => y.subgroup === m || (m === "N/A" && !y.subgroup))?.length;
      }) || []
    }
  ]

  const colors = series[0]?.data?.map((x, i) => getColorByIndex(i, totalOperation));

  const options = {
    chart: {
      background: theme.backgroundBasicColor1,
      id: `subt_CGoup`,
      type: "bar",
      stacked: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    plotOptions: {
      bar: {
        columnWidth: 50,
        borderRadius: 2,
        horizontal: false,
        distributed: true,
      },
    },
    xaxis: {
      categories: subGroupsDistincts,
    },
    colors,
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return floatToStringExtendDot((val * 100) / totalOperation, 1) + "%";
      },
    },
    yaxis: {
      tickAmount: 3,
      max: Math.max(...series[0].data) + 2,
      min: 0,
      labels: {
        style: {
          colors: theme.colorBasic600,
          fontFamily: theme.fontFamilyPrimary,
        }
      },
    },
    grid: {
      show: true,
      strokeDashArray: 2,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return parseInt(val)
        }
      }
    },
    legend: {
      show: false,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,

    },
    title: {
      text: `Subgrupo`,
      align: "center",
      style: {
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: '500',
        fontSize: '13px'
      },
    },
    theme: {
      palette: 'palette1',
      mode: themeSelected?.isDark ? 'dark' : 'light'
    }
  };

  return (
    <>
      <ReactApexCharts
        key={`subt_CGoup`}
        options={options}
        series={series}
        type='bar'
        height={300}
      />
    </>
  )
}
