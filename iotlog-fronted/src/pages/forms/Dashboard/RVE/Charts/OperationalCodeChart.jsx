import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { CardBody, CardHeader } from '@paljs/ui/Card';
import { CardNoShadow, TextSpan } from '../../../../../components';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import { floatToStringExtendDot } from '../../../../../components/Utils';
import { useThemeSelected } from '../../../../../components/Hooks/Theme';
import ScalesModal from './ScalesModal';

const OperationalCodeChart = ({ data, initialDate, finalDate, idAsset, idEnterprise }) => {
  const theme = useTheme();
  const intl = useIntl();
  const { isDark } = useThemeSelected();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);

  const handleChartClick = (params) => {
    const clickedItem = data.find(item => item.codigo?.value === params.name);
    if (clickedItem) {
      setSelectedCode(clickedItem);
      setModalVisible(true);
    }
  };

  const option = {
    darkMode: !!isDark,
    grid: {
      bottom: '25%'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const total = data.reduce((sum, item) => sum + item.quantity, 0);
        const percentage = ((params.value / total) * 100).toFixed(2);
        const item = data.find(item => item.codigo?.value === params.name);
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
      itemGap: 15,
      formatter: (name) => {
        const item = data.find(item => item.codigo?.value === name);
        const label = item?.codigo?.label || '';
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
        name: intl.formatMessage({ id: 'rve.dashboard.operationalCodes' }),
        type: 'pie',
        radius: '65%',
        center: ['50%', '40%'],
        itemStyle: {
          borderRadius: 10
        },
        label: {
          show: true,
          color: theme.textBasicColor
        },
        data: data.map((item) => ({
          value: item.totalHoras,
          name: item.codigo?.value || ''
        }))?.sort((a, b) => b.value - a.value)
      }
    ],
    responsive: true
  };

  const onEvents = {
    click: handleChartClick
  };

  return (
    <>
      <CardNoShadow>
        <CardHeader>
          <TextSpan apparence="s2">
            <FormattedMessage id="rve.dashboard.operationalCodes" />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <ReactECharts
            option={option}
            style={{ height: '350px', cursor: 'pointer' }}
            onEvents={onEvents}
          />
        </CardBody>
      </CardNoShadow>

      {modalVisible && (
        <ScalesModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedCode={selectedCode}
          initialDate={initialDate}
          finalDate={finalDate}
          idAsset={idAsset}
          idEnterprise={idEnterprise}
        />
      )}
    </>
  );
};

export default OperationalCodeChart;
