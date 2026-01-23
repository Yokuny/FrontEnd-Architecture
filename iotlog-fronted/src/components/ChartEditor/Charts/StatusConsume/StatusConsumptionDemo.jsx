import React from "react";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import TextSpan from "../../../Text/TextSpan";
import { floatToStringExtendDot } from "../../../Utils";
import { ContainerChart } from "../../Utils";


const StatusConsumptionDemo = ({ height = 200, width = 200 }) => {
  const theme = useTheme();
  const intl = useIntl();

  const optionsTimes = {
    chart: {
      type: 'donut',
    },
    colors: [theme.colorPrimary500, theme.colorSuccess500, theme.colorWarning500],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            value: {
              formatter: (value) => `${floatToStringExtendDot(value, 1)} H`,
              color: theme.textBasicColor,
              offsetY: -5,
            },
            total: {
              color: theme.textBasicColor,
              fontFamily: theme.fontFamilyPrimary,
              fontSize: "15px",
              show: true,
              label: '',
              formatter: (value) => `5m³`
            }
          }
        }
      }
    },
    legend: {
      show: false,
      position: 'left',
      offsetY: 40
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `${floatToStringExtendDot(value, 1)} H`
      }
    },
    labels: ['Travel', "At anchor", 'Moored'],
    stroke: {
      show: false
    }
  }

  return (
    <ContainerChart height={height} width={width} className="card-shadow">
      <TextSpan className="mb-2" apparence="s2">{`${intl.formatMessage({ id: 'hour.unity' })}/${intl.formatMessage({ id: 'consume' })}`}</TextSpan>
      <div className="row-flex-center pl-3">
        <ReactApexCharts
          options={optionsTimes}
          series={[10, 50, 40]}
          type='donut'
          height={110}
          width={90}
        />
        <ReactApexCharts
          options={optionsTimes}
          series={[20, 90, 30]}
          type='donut'
          height={110}
          width={90}
        />
      </div>
    </ContainerChart>
  );
};

export default StatusConsumptionDemo;
