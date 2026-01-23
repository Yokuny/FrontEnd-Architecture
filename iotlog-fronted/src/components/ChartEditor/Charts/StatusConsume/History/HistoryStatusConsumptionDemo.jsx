import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { ContainerChart } from "../../../Utils";
import { floatToStringExtendDot } from "../../../../Utils";


const HistoryStatusConsumptionDemo = () => {
  const theme = useTheme();

  const options = {
    chart: {
      background: theme.backgroundBasicColor1,
      type: "bar",
      stacked: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
      toolbar: {
        show: false,
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: theme.fontFamilyPrimary,
              color: theme.textBasicColor,
            },
            formatter: function (w) {
              return floatToStringExtendDot(w, 1)
            }
          }
        }
      },
    },
    xaxis: {
      categories: ["Set", "Out"],
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return floatToStringExtendDot(val, 1)
      }
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    title: {
      text: "Consumo operação",
      align: "center",
      style: {
        fontSize: "13px",
        color: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
      },
    }
  };

  const series = [
    {
      name: "Underway",
      data: [44, 55]
    },
    {
      name: "At anchor",
      data: [13, 23]
    }
  ]

  return (
    <>
      <ContainerChart height={200} width={200} className="card-shadow pt-4">
        <ReactApexCharts
          options={options}
          series={series}
          height={180}
          width={170}
          type={"bar"}
        />
      </ContainerChart>
    </>
  );
};


export default HistoryStatusConsumptionDemo;
