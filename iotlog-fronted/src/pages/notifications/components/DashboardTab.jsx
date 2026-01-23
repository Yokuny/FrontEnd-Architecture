import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Card, CardHeader } from "@paljs/ui";
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import styled from "styled-components";
import { useTheme } from "styled-components";
import { TextSpan } from "../../../components";
import { useThemeSelected } from "../../../components/Hooks/Theme";
import { CardNoShadow } from "../../../components";

const ChartContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ChartCard = styled(CardNoShadow)`
  flex: 1;
  margin-bottom: 0;
`;

const DashboardTab = ({
  readStatus,
  newStatus,
}) => {
  const intl = useIntl();
  const themeSelected = useThemeSelected();
  const theme = useTheme();

  echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

  const getOptionsRead = () => {
    const labels = [
      intl.formatMessage({ id: 'notifications.status.unread' }),
      intl.formatMessage({ id: 'notifications.status.read' })
    ];
    const colors = ['#e74c3c', '#3498db'];
    const total = readStatus?.series?.reduce((a, b) => a + b, 0) || 0;

    return {
      darkMode: themeSelected?.isDark,
      textStyle: {
        fontFamily: theme.fontFamilyPrimary,
      },
      color: colors,
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        textStyle: {
          fontFamily: theme.fontFamilyPrimary
        },
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        textStyle: {
          color: theme.textBasicColor,
          fontSize: 12,
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'],
          center: ["50%", "40%"],
          label: {
            show: true,
            formatter: '{d}%',
            color: theme.textBasicColor,
          },
          data: readStatus?.series?.map((value, index) => ({
            value: value,
            name: labels[index],
          })) || [],
        },
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '33%',
          style: {
            text: intl.formatMessage({ id: 'total' }),
            textAlign: 'center',
            fill: theme.textBasicColor,
            fontSize: 12,
            fontFamily: theme.fontFamilyPrimary,
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
            text: total.toString(),
            textAlign: 'center',
            fill: theme.textBasicColor,
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: theme.fontFamilyPrimary,
          },
        },
      ],
    };
  };

  const getOptions = () => {
    const labels = [
      intl.formatMessage({ id: 'pending' }),
      intl.formatMessage({ id: 'in_progress' }),
      intl.formatMessage({ id: 'not_done' }),
      intl.formatMessage({ id: 'done' })
    ];
    const colors = ['#f39c12', '#3498db', '#e74c3c', '#2ecc71'];
    const total = newStatus?.series?.reduce((a, b) => a + b, 0) || 0;

    return {
      darkMode: themeSelected?.isDark,
      textStyle: {
        fontFamily: theme.fontFamilyPrimary,
      },
      color: colors,
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        textStyle: {
          fontFamily: theme.fontFamilyPrimary
        },
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        textStyle: {
          color: theme.textBasicColor,
          fontSize: 12,
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'],
          center: ["50%", "40%"],
          label: {
            show: true,
            formatter: '{d}%',
            color: theme.textBasicColor,
          },
          data: newStatus?.series?.map((value, index) => ({
            value: value,
            name: labels[index],
          })) || [],
        },
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '33%',
          style: {
            text: intl.formatMessage({ id: 'total' }),
            textAlign: 'center',
            fill: theme.textBasicColor,
            fontSize: 12,
            fontFamily: theme.fontFamilyPrimary,
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
            text: total.toString(),
            textAlign: 'center',
            fill: theme.textBasicColor,
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: theme.fontFamilyPrimary,
          },
        },
      ],
    };
  };
  return (
    <>
      <ChartContainer>
        <ChartCard>
          <CardHeader>
            <TextSpan apparence="c1" hint>
              <FormattedMessage id="notifications.chart.read.status" />
            </TextSpan>
          </CardHeader>
          <div style={{ padding: "1rem" }}>
            <ReactEChartsCore
              echarts={echarts}
              option={getOptionsRead()}
              style={{ height: '300px', width: '100%' }}
            />
          </div>
        </ChartCard>
        <ChartCard>
          <CardHeader>
            <TextSpan apparence="c1" hint>
              <FormattedMessage id="notifications.chart.treatment.status" />
            </TextSpan>
          </CardHeader>
          <div style={{ padding: "1rem" }}>
            <ReactEChartsCore
              echarts={echarts}
              option={getOptions()}
              style={{ height: '300px', width: '100%' }}
            />
          </div>
        </ChartCard>
      </ChartContainer>
    </>
  );
};

export default DashboardTab;
