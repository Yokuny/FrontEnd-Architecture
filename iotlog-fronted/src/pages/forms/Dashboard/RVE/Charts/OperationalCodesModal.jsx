import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled, { useTheme } from 'styled-components';
import { CardBody, Col, EvaIcon, Row } from '@paljs/ui';
import { CardNoShadow, Modal, TextSpan } from '../../../../../components';
import { floatToStringExtendDot } from '../../../../../components/Utils';
import { useThemeSelected } from '../../../../../components/Hooks/Theme';

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
`;

const OperationalCodesModal = ({
  visible,
  onClose,
  selectedGroup,
  operationalCodesForGroup,
  onCodeClick
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const { isDark } = useThemeSelected();

  const totals = useMemo(() => {
    const totalHoras = operationalCodesForGroup.reduce((sum, item) => sum + (item.totalHoras || 0), 0);
    const totalQuantity = operationalCodesForGroup.reduce((sum, item) => sum + (item.quantity || 0), 0);
    return { totalHoras, totalQuantity };
  }, [operationalCodesForGroup]);

  const chartOption = useMemo(() => {
    if (!operationalCodesForGroup.length) return {};
    return {
      darkMode: !!isDark,
      grid: {
        bottom: '25%'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const total = operationalCodesForGroup.reduce((sum, item) => sum + item.quantity, 0);
          const percentage = total > 0 ? ((params.value / total) * 100).toFixed(2) : 0;
          const item = operationalCodesForGroup.find((item) => item.codigo?.value === params.name);
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
          color: theme.textBasicColor
        },
        itemWidth: 15,
        itemHeight: 15,
        itemGap: 15,
        formatter: (name) => {
          const item = operationalCodesForGroup.find((item) => item.codigo?.value === name);
          return item?.codigo?.label || name;
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
          data: operationalCodesForGroup.map((item) => ({
            value: item.totalHoras,
            name: item.codigo?.value || ''
          }))?.sort((a, b) => b.value - a.value)
        }
      ],
      responsive: true
    };
  }, [operationalCodesForGroup, isDark, intl, theme]);

  const handleChartClick = (params) => {
    const clickedItem = operationalCodesForGroup.find(item => item.codigo?.value === params.name);
    if (clickedItem) {
      onCodeClick(clickedItem);
    }
  };

  const onEvents = {
    click: handleChartClick
  };

  return (
    <Modal
      show={visible}
      onClose={onClose}
      size="Large"
      title="rve.dashboard.operationalCodes"
      subtitle={selectedGroup?.name}
      hideOnBlur
    >
      {operationalCodesForGroup.length > 0 ? (
        <Row>
          <Col breakPoint={{ xs: 12, md: 3 }}>
            <CardNoShadow>
              <CardBody>
                <Row middle="xs" center="xs" className="pt-2 pb-2">
                  <ColFlex breakPoint={{ xs: 3 }}>
                    <EvaIcon
                      name="clock-outline"
                      options={{
                        height: '1.5rem',
                        width: '1.5rem',
                      }}
                      status="Primary"
                    />
                  </ColFlex>
                  <ColFlex breakPoint={{ xs: 9 }}>
                    <TextSpan apparence="h5">
                      {floatToStringExtendDot(totals.totalHoras, 2)}
                    </TextSpan>
                    <TextSpan apparence="p2" hint className="mt-1">
                      <FormattedMessage id="total.hours" />
                    </TextSpan>
                  </ColFlex>
                </Row>
              </CardBody>
            </CardNoShadow>
            <CardNoShadow>
              <CardBody>
                <Row middle="xs" center="xs" className="pt-2 pb-2">
                  <ColFlex breakPoint={{ xs: 3 }}>
                    <EvaIcon
                      name="layers-outline"
                      options={{
                        height: '1.5rem',
                        width: '1.5rem',
                      }}
                      status="Info"
                    />
                  </ColFlex>
                  <ColFlex breakPoint={{ xs: 9 }}>
                    <TextSpan apparence="h5">
                      {totals.totalQuantity}
                    </TextSpan>
                    <TextSpan apparence="p2" hint className="mt-1">
                      <FormattedMessage id="quantity" />
                    </TextSpan>
                  </ColFlex>
                </Row>
              </CardBody>
            </CardNoShadow>
          </Col>
          <Col breakPoint={{ xs: 12, md: 9 }}>
            <ReactECharts
              option={chartOption}
              style={{ height: '400px', cursor: 'pointer' }}
              onEvents={onEvents}
            />
          </Col>
        </Row>
      ) : (
        <TextSpan apparence="p2" hint>
          <FormattedMessage id="no.data" />
        </TextSpan>
      )}
    </Modal>
  );
};

export default OperationalCodesModal;
