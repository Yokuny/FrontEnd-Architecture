import * as echarts from 'echarts/core';
import { GridComponent, TitleComponent } from 'echarts/components';
import { ScatterChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { nanoid } from "nanoid";
import React from "react";
import { useTheme } from 'styled-components';


const colors = [
  "Primary",
  "Success",
  "Warning",
  "Danger",
  "Info"
]

const distributionColor = (index) => {
  return colors[index % colors.length];
}

export default function DashItemPanel(props) {

  const { series, sensorX, sensorsY, index } = props;

  const theme = useTheme()

  const color = distributionColor(index)

  const getOption = () => {
    return {
      title: {
        text: `${sensorX?.title} x ${sensorsY[0]?.title}`,
        left: 'center',
        top: 10,
        textStyle: {
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: '300',
          fontSize: 12,
          color: theme.colorBasic600
        }
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross' 
        },
        formatter: function (params) {
          const dataPoint = params.data;
          
          return `
            ${params.marker} <strong>${params.seriesName}</strong><br/>
            ${sensorX?.title}: ${dataPoint[0]}<br/>
            ${sensorsY[0]?.title}: ${dataPoint[1]}
          `;
        },
        textStyle: {
            fontFamily: theme.fontFamilyPrimary
        }
      },
      xAxis: {
        name: sensorX?.title,
        nameLocation: 'center',
        nameGap: 30,
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: theme.colorBasic400
          }
        },
        axisLine: {
          lineStyle: {
            color: theme.colorBasic600,
            width: 0.5
          }
        },
        nameTextStyle: {
          fontFamily: theme.fontFamilyPrimary
        }
      },
      textStyle: {
        fontFamily: theme.fontFamilyPrimary
      },
      yAxis: {
        name: sensorsY[0]?.title,
        nameLocation: 'center',
        nameGap: 30,
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: theme.colorBasic400
          }
        },
        axisLine: {
          lineStyle: {
            color: theme.colorBasic600,
            width: 0.5
          }
        },
        nameTextStyle: {
          fontFamily: theme.fontFamilyPrimary
        }
      },
      series: sensorsY?.map((x, i) => ({
        symbolSize: 10,
        data: series,
        type: 'scatter',
        name: x.label,
        itemStyle: {
          color: theme[`color${color}500`]
        },
      })) || []
    }
  }

  echarts.use([GridComponent, ScatterChart, CanvasRenderer, UniversalTransition, TitleComponent]);

  return <>
    <ReactEChartsCore
      key={nanoid(5)}
      echarts={echarts}
      option={getOption()}
      style={{ height: '100%', width: '100%' }}
    />
  </>
}
