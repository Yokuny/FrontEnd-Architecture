import React, { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { CardBody, CardHeader } from '@paljs/ui/Card';
import { CardNoShadow, TextSpan } from '../../../../../components';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import { floatToStringExtendDot } from '../../../../../components/Utils';
import { useThemeSelected } from '../../../../../components/Hooks/Theme';
import OperationalCodesModal from './OperationalCodesModal';
import ScalesModal from './ScalesModal';

const GroupConsumptionCodeChart = ({ data, initialDate, finalDate, idAsset, idEnterprise }) => {
  const theme = useTheme();
  const intl = useIntl();
  const { isDark } = useThemeSelected();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [scalesModalVisible, setScalesModalVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);

  const groupedData = useMemo(() => {
    const groups = {};
    (data || []).forEach((item) => {
      const id = item.idGroupConsumption;
      const name = item.idGroupConsumption
        ? [item.idGroupConsumption, item.groupConsumptionDescription]
          .filter(Boolean)
          .join(' - ')
        : 'N/A';

      if (!groups[id]) {
        groups[id] = {
          name,
          maxConsumption: item.maxConsumption,
          idGroupConsumption: id,
          quantity: 0,
          totalHoras: 0,
          total: 0
        };
      }
      groups[id].quantity += item.quantity || 0;
      groups[id].totalHoras += item.totalHoras || 0;
      groups[id].total += item.total || 0;
    });
    return Object.values(groups);
  }, [data]);

  const operationalCodesForGroup = useMemo(() => {
    if (!selectedGroup || !data) return [];
    return data.filter((item) => item.idGroupConsumption === selectedGroup.idGroupConsumption);
  }, [data, selectedGroup]);

  const handleCodeClick = (clickedItem) => {
    setSelectedCode(clickedItem);
    setScalesModalVisible(true);
  };

  const handleChartClick = (params) => {
    const clickedGroup = groupedData.find((item) => item.name === params.name);
    if (clickedGroup) {
      setSelectedGroup(clickedGroup);
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
        const total = groupedData.reduce((sum, item) => sum + item.quantity, 0);
        const percentage = total > 0 ? ((params.value / total) * 100).toFixed(2) : 0;
        const item = groupedData.find(item => item.name === params.name);
        const totalHoras = item?.totalHoras || 0;

        const consumptionMax = item?.maxConsumption
          ? (item?.maxConsumption / 24) * totalHoras
          : 0;

        return `<strong>${params.name}</strong><br/>
                ${intl.formatMessage({ id: 'quantity' })}: ${item.quantity}<br/>
                ${intl.formatMessage({ id: 'total.hours' })}: ${floatToStringExtendDot(totalHoras || 0, 2)} h<br/>
                ${intl.formatMessage({ id: 'consumption.max' })}: ${floatToStringExtendDot(consumptionMax || 0, 2)} m³<br/>
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
        return name;
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
        name: intl.formatMessage({ id: 'operation.consumptiongroup.label' }),
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
        data: groupedData.map((item) => ({
          value: item.totalHoras,
          name: item.name
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
            <FormattedMessage id="operation.consumptiongroup.label" />
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

      {modalVisible && <OperationalCodesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedGroup={selectedGroup}
        operationalCodesForGroup={operationalCodesForGroup}
        onCodeClick={handleCodeClick}
      />}

      {scalesModalVisible && <ScalesModal
        visible={scalesModalVisible}
        onClose={() => setScalesModalVisible(false)}
        selectedCode={selectedCode}
        selectedGroup={selectedGroup}
        initialDate={initialDate}
        finalDate={finalDate}
        idAsset={idAsset}
        idEnterprise={idEnterprise}
      />}
    </>
  );
};

export default GroupConsumptionCodeChart;
