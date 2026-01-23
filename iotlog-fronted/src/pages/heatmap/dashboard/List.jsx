import { Col, Row } from "@paljs/ui";
import moment from "moment";
import ReactECharts from "echarts-for-react";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";

export default function ListDashboardHeatmap(props) {
  const theme = useTheme();
  const intl = useIntl();

  function findMarkLines(serie) {
    const markLineData = [];

    const alert = props.heatmapAlerts?.find(alert => alert.idSensor === serie.id);

    if (alert) {
      if (alert.minValue) {
        markLineData.push({
          name: intl.formatMessage({ id: "sensor.signal.value.min" }),
          yAxis: parseFloat(alert.minValue),
          lineStyle: {
            color: 'red',
            type: 'solid',
            width: 1
          },
          label: {
            formatter: alert.minValue + ' ' + intl.formatMessage({ id: "sensor.signal.value.min" }),
            position: 'end',
            color: 'white',
            backgroundColor: 'purple',
            borderColor: 'violet',
            borderWidth: 1,
            padding: [2, 4]
          }
        });
      }

      if (alert.maxValue) {
        markLineData.push({
          name: intl.formatMessage({ id: "sensor.signal.value.max" }),
          yAxis: parseFloat(alert.maxValue),
          lineStyle: {
            color: 'red',
            type: 'solid',
            width: 1
          },
          label: {
            formatter: alert.maxValue + ' ' + intl.formatMessage({ id: "sensor.signal.value.max" }),
            position: 'end',
            color: 'white',
            backgroundColor: 'purple',
            borderColor: 'violet',
            borderWidth: 1,
            padding: [2, 4]
          }
        });
      }
    }

    return markLineData;
  }

  function getChartOptions(serie) {
    const markLineData = findMarkLines(serie);

    return {
      backgroundColor: theme.backgroundBasicColor1,
      title: {
        text: serie?.name,
        left: 'center',
        textStyle: {
          fontSize: 12,
          color: theme.colorBasic600,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: 300
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#333',
        borderColor: '#333',
        textStyle: {
          fontSize: 12,
          fontFamily: theme.fontFamilyPrimary,
          color: '#fff'
        },
        formatter: function (params) {
          if (!params || !params[0]) return '';
          const point = params[0];
          const value = point.value?.[1];
          const date = moment(point.value?.[0]).format(intl.formatMessage({ id: "format.datetime" }));
          return `${date}<br/>${point.seriesName}: ${value !== null && value !== undefined ? value.toFixed(1) : value}`;
        }
      },
      legend: {
        show: true,
        textStyle: {
          color: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        show: true,
        right: 10,
        top: -3,
        feature: {
          saveAsImage: {
            title: 'Salvar',
            name: `sensors_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
          },
          dataZoom: {
            title: {
              zoom: 'Zoom',
              back: 'Voltar'
            }
          },
          restore: {
            title: 'Restaurar'
          }
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        }
      ],
      xAxis: {
        type: 'time',
        axisLabel: {
          color: theme.colorBasic600,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: 600
        },
        axisLine: {
          lineStyle: {
            color: theme.colorBasic600
          }
        }
      },
      yAxis: {
        type: 'value',
        splitNumber: 4,
        axisLabel: {
          color: theme.colorBasic600,
          fontFamily: theme.fontFamilyPrimary,
          formatter: function (val) {
            return val !== null && val !== undefined ? val.toFixed(1) : val;
          }
        },
        axisLine: {
          lineStyle: {
            color: theme.colorBasic600
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            width: 1
          }
        }
      },
      series: [
        {
          name: serie?.name,
          type: 'line',
          showSymbol: false,
          lineStyle: {
            width: 1.1
          },
          itemStyle: {
            color: theme.colorPrimary500
          },
          data: serie?.data?.map(point => {
            // Suporta tanto formato [x, y] quanto {x, y}
            if (Array.isArray(point)) {
              return point;
            }
            return [point.x, point.y];
          }) || [],
          markLine: markLineData.length > 0 ? {
            silent: true,
            symbol: 'none',
            data: markLineData
          } : undefined,
          animation: true,
          animationDuration: 800,
          animationEasing: 'linear'
        }
      ]
    };
  }

  return (
    <>
      <Row middle="xs" center="xs" className="m-0">
        {props.data?.map((serie, indexSensor) => {
          const options = getChartOptions(serie);

          return (
            <Col
              breakPoint={{ md: 12 }}
              className="mb-4 p-0"
              key={`heat_col_${indexSensor}`}
            >
              <ReactECharts
                key={`heat_list_${indexSensor}`}
                option={options}
                style={{ height: '300px', width: '100%' }}
                opts={{ renderer: 'svg' }}
                notMerge={true}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
}
