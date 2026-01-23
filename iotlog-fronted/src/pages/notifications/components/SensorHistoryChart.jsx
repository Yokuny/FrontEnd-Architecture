import React, { useEffect, useState, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import { useTheme } from 'styled-components';
import { Fetch } from '../../../components/Fetch';
import { SkeletonThemed } from '../../../components/Skeleton';
import { floatToStringBrazilian } from '../../../components/Utils';

const SensorHistoryChart = ({ notificationData }) => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        idAsset: notificationData.idMachine,
        idSensor: notificationData.idSensor,
        date: notificationData.date
      });
      const response = await Fetch.get(`/sensordata/sensorhistory?${queryParams.toString()}`);
      setData(response.data?.map(item => ({
        timestamp: new Date(item[0] * 1000),
        value: item[1]
      })));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [notificationData]);

  useEffect(() => {
    if (notificationData) {
      getData();
    }
  }, [notificationData]);

  const formatDate = (date) => {
    return moment(date).format('DD MMM HH:mm');
  };

  const getChartOptions = () => {
    const normalColor = theme.colorPrimary500;
    const outOfRangeColor = theme.colorDanger500;
    const min = notificationData?.min;
    const max = notificationData?.max;

    const hasValidMin = min != null && !isNaN(min);
    const hasValidMax = max != null && !isNaN(max);
    const hasBothLimits = hasValidMin && hasValidMax;
    const hasOnlyMin = hasValidMin && !hasValidMax;
    const hasOnlyMax = !hasValidMin && hasValidMax;
    const hasNoLimits = !hasValidMin && !hasValidMax;

    const outOfRangeAreaColor = `${theme.colorDanger500}20`;

    // Extremos reais dos dados (para preencher área fora dos limites)
    const dataValues = data.map(d => d.value).filter(v => v != null && !isNaN(v));
    const dataMin = dataValues.length ? Math.min(...dataValues) : 0;
    const dataMax = dataValues.length ? Math.max(...dataValues) : 0;

    // Áreas fora dos limites (acima do max / abaixo do min)
    const markAreaOutOfRange = [];
    if (hasValidMax) {
      // Área do max até o topo (usa dataMax; se dataMax <= max, área ficará mínima)
      markAreaOutOfRange.push([
        { yAxis: max },
        { yAxis: dataMax > max ? dataMax : max }
      ]);
    }
    if (hasValidMin) {
      // Área da base até o min (usa dataMin)
      markAreaOutOfRange.push([
        { yAxis: dataMin < min ? dataMin : min },
        { yAxis: min }
      ]);
    }

    const getVisualMapConfig = () => {
      if (!hasBothLimits) {
        return [];
      }

      return [
        {
          show: false,
          type: 'piecewise',
          seriesIndex: 0,
          dimension: 1,
          pieces: [
            { lt: min, color: outOfRangeColor },
            { gte: min, lte: max, color: normalColor },
            { gt: max, color: outOfRangeColor }
          ]
        }
      ];
    };

    const getSeriesData = () => {
      return data.map(item => ({
        value: item.value
      }));
    };

    const getLineStyle = () => {
      if (hasNoLimits || hasBothLimits) {
        return { width: 2 };
      }

      return {
        width: 2,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: (() => {
            const colorStops = [];
            const totalPoints = data.length;

            for (let i = 0; i < totalPoints; i++) {
              const value = data[i]?.value;
              let color = normalColor;

              if (hasOnlyMin && value < min) {
                color = outOfRangeColor;
              } else if (hasOnlyMax && value > max) {
                color = outOfRangeColor;
              }

              colorStops.push({
                offset: i / (totalPoints - 1),
                color: color
              });

              if (i < totalPoints - 1) {
                const nextValue = data[i + 1]?.value;
                let nextColor = normalColor;

                if (hasOnlyMin && nextValue < min) {
                  nextColor = outOfRangeColor;
                } else if (hasOnlyMax && nextValue > max) {
                  nextColor = outOfRangeColor;
                }

                if (color !== nextColor) {
                  colorStops.push({
                    offset: (i + 0.5) / (totalPoints - 1),
                    color: color
                  });
                  colorStops.push({
                    offset: (i + 0.5) / (totalPoints - 1),
                    color: nextColor
                  });
                }
              }
            }

            return colorStops;
          })()
        }
      };
    };

    const getItemStyle = () => {
      if (hasNoLimits) {
        return { color: normalColor };
      }

      if (hasBothLimits) {
        return { color: normalColor };
      }

      return {
        color: (params) => {
          const value = params.data.value;
          if (hasOnlyMin && value < min) {
            return outOfRangeColor;
          } else if (hasOnlyMax && value > max) {
            return outOfRangeColor;
          }
          return normalColor;
        }
      };
    };

    const seriesData = getSeriesData();
    const lineStyle = getLineStyle();
    const itemStyle = getItemStyle();
    const visualMapConfig = getVisualMapConfig();

    return {
      title: {
        text: '',
        textAlign: 'center',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const value = params[0].data.value || params[0].data;
          return `<b>${params[0].axisValue}</b><br>${floatToStringBrazilian(value,2)}`;
        }
      },
      visualMap: visualMapConfig,
      xAxis: {
        type: 'category',
        data: data.map(item => formatDate(item.timestamp)),
        axisLabel: {
          color: theme.textHintColor,
          fontFamily: theme.fontFamilyPrimary,
          formatter: (value) => {
            const [day, month, time] = value.split(' ');
            return `${day} ${month}\n${time}`;
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: theme.textHintColor,
            width: 1
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: theme.backgroundBasicColor2,
            type: 'dashed',
            width: 1
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: theme.textHintColor,
          fontFamily: theme.fontFamilyPrimary
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: theme.textHintColor,
            width: 1
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: theme.backgroundBasicColor2,
            type: 'dashed',
            width: 1
          }
        }
      },
      series: [
        {
          data: seriesData,
            type: 'line',
            smooth: false,
            symbol: 'circle',
            symbolSize: 6,
            connectNulls: true,
            lineStyle,
            itemStyle,
            emphasis: { focus: 'series' },
            // NOVO: áreas destacadas fora dos limites
            markArea: (!hasNoLimits && markAreaOutOfRange.length)
              ? {
                  silent: true,
                  itemStyle: {
                    color: outOfRangeAreaColor
                  },
                  data: markAreaOutOfRange
                }
              : undefined,
            markLine: {
              silent: true,
              symbol: 'none',
              data: [
                ...(hasValidMin ? [{
                  name: 'Min',
                  yAxis: min,
                  lineStyle: {
                    color: theme.colorDanger500,
                    type: 'dashed',
                    width: 1
                  },
                  label: {
                    formatter: 'Min',
                    color: theme.colorDanger500,
                    fontFamily: theme.fontFamilyPrimary,
                    position: 'end',
                    offset: [-5, 0]
                  }
                }] : []),
                ...(hasValidMax ? [{
                  name: 'Max',
                  yAxis: max,
                  lineStyle: {
                    color: theme.colorDanger500,
                    type: 'dashed',
                    width: 1
                  },
                  label: {
                    formatter: 'Max',
                    color: theme.colorDanger500,
                    fontFamily: theme.fontFamilyPrimary,
                    position: 'end',
                    offset: [-5, 0]
                  }
                }] : [])
              ]
            }
        }
      ]
    };
  };

  if (loading) {
    return (
      <div style={{ height: '300px', width: '100%' }}>
        <SkeletonThemed height={300} />
      </div>
    );
  }

  return (
    <div style={{ height: '300px', width: '100%', marginBottom: '10px' }}>
      <ReactECharts
        option={getChartOptions()}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};

export default SensorHistoryChart;
