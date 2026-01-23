import ReactECharts from 'echarts-for-react';
import { CardBody, CardHeader } from '@paljs/ui/Card';
import { CardNoShadow, TextSpan } from '../../../../../components';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import { floatToStringExtendDot } from '../../../../../components/Utils';
import { useThemeSelected } from '../../../../../components/Hooks/Theme';

const ScaleChart = ({ data }) => {
  const theme = useTheme();
  const intl = useIntl();
  const { isDark } = useThemeSelected();
  const option = {
    darkMode: !!isDark,
    grid: {
      bottom: '25%',
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const total = data.reduce((sum, item) => sum + item.quantity, 0);
        const percentage = ((params.value / total) * 100).toFixed(2);
        const item = data.find(item => item.escala?.label === params.name);
        const totalHoras = item?.totalHoras || 0;
        return `<strong>${params.name}</strong><br/>
                ${intl.formatMessage({ id: 'quantity' })}: ${item.quantity}<br/>
                ${intl.formatMessage({ id: 'total.hours' })}: ${floatToStringExtendDot(totalHoras || 0, 2)} h<br/>
                ${intl.formatMessage({ id: 'percent' })}: ${floatToStringExtendDot(percentage || 0, 2)}%`;
      }
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      bottom: 0,
      left: 'center',
      width: '85%',
      textStyle: {
        fontSize: 12,
        fontWeight: 400,
        color: theme.textBasicColor,
      },
      itemWidth: 15,
      itemHeight: 15,
      formatter: (name) => {
        const item = data.find(item => item.escala?.label === name);
        const label = item?.escala?.label || '';
        return label;
      },
      pageButtonPosition: 'end',
      pageButtonGap: 5,
      pageIconSize: 14,
      pageIconColor: theme.colorPrimary500,
      pageIconInactiveColor: theme.textBasicColor,
      pageTextStyle: {
        color: theme.textBasicColor
      }
    },
    series: [
      {
        name: 'Escalas',
        type: 'pie',
        radius: '65%',
        center: ['50%', '40%'],
        bottom: 26,
        itemStyle: {
          borderRadius: 10
        },
        label: {
          show: true,
          color: theme.textBasicColor
        },
        data: data.map((item) => ({
          value: item.totalHoras,
          name: item.escala?.label || ''
        }))?.sort((a, b) => b.value - a.value)
      }
    ],
    responsive: true
  };

  return (
    <CardNoShadow>
      <CardHeader>
        <TextSpan apparence="s2">
          <FormattedMessage id="rve.dashboard.scales" defaultMessage="Escalas" />
        </TextSpan>
      </CardHeader>
      <CardBody>
        <ReactECharts
          option={option}
          style={{ height: '350px' }}
          onEvents={{}}
        />
      </CardBody>
    </CardNoShadow>
  );
};

export default ScaleChart;
