import React from "react";
import Row from "@paljs/ui/Row";
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts'
import {
  CanvasRenderer,
} from 'echarts/renderers';
import {
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { setFilterStatusConsume } from "../../../../actions";
import { getIcon } from "../../../../pages/fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { LoadingCard } from "../../../Loading";
import { floatToStringExtendDot } from "../../../Utils";
import { ContentChart } from "../../Utils";
import { getValueConsume } from "./Utils";
import { useThemeSelected } from "../../../Hooks/Theme";

const RowStyled = styled(Row)`
 height: 100%;
 width: 100%;
 margin: 0px;
 display: flex;
 justify-content: center;
 align-items: center;
 flex-wrap: nowrap;
`

const ColStyled = styled(Row)`
 height: 100%;
 width: 100%;
 display: flex;
 justify-content: center;
 flex-direction: column;
`

const StatusConsumptionChart = (props) => {

  const {
    dataStatusConsume,
  } = props;

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();

  if (!dataStatusConsume?.length) {
    return <ContentChart></ContentChart>
  }

  const iconsProps = dataStatusConsume?.map(x => ({
    icon: getIcon(x.status, theme),
    status: x.status
  }))

  const colors = iconsProps
    ?.map(x => x.icon?.bgColor)

  const getConsumption = (value) => {
    return floatToStringExtendDot(getValueConsume(value, props.unitStatusConsume), 2)
  }

  const setStatus = (status, statusOriginal) => {
    props.setFilterStatusConsume([status, props.filterStatusConsume[1],statusOriginal])
  }

  const getOption = () => {
    return {
      darkMode: themeSelected?.isDark,
      textStyle: {
        fontFamily: theme.fontFamilyPrimary
      },
      color: colors,
      tooltip: {
        trigger: 'item',
        formatter: (c) => `
          ${c.marker} <strong>${intl.formatMessage({ id: c.name })}</strong>  <i>(${floatToStringExtendDot(c.percent,2)}%)</i><br />
${intl.formatMessage({ id: 'hour.unity' })}: <strong>${floatToStringExtendDot(c.value / 60, 2)}</strong><br />
${intl.formatMessage({ id: 'day.unity' })}: <strong>${floatToStringExtendDot(c.value / 60 / 24, 1)}</strong><br />
${intl.formatMessage({ id: 'consume' })}: <strong>${getConsumption(c.data.consumption)} ${props.unitStatusConsume}</strong>`,
        fontSize: 12,
        backgroundColor: themeSelected.isDark ? theme.backgroundBasicColor4 : theme.backgroundBasicColor1,
        textStyle: {
          color: theme.textBasicColor,
        }
      },
      label: {
        show: true,
        formatter: (item) => `${intl.formatMessage({ id: item.name })} ${floatToStringExtendDot(item.percent,2)}%`,
        position: 'inside',
        fontSize: 12,
        fontWeight: '600',
        color: theme.textHintColor,
      },
      series: [
        {
          name: intl.formatMessage({ id: 'consume' }),
          type: 'pie',
          radius: [50, 80],
          center: ['50%', '60%'],
          data: dataStatusConsume?.map(x => ({
            value: x.minutes.toFixed(2),
            name: getIcon(x.status, theme)?.text,
            consumption: x.consumption,
            status: x.status,
            statusOriginal: x.statusOriginal
          }))
        }
      ]
    }
  }

  echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

  return (
    <LoadingCard isLoading={props.isLoadingStatusConsume}>
      <ContentChart className="card-shadow p-4">
        <RowStyled>
          <ColStyled>
            <ReactEChartsCore
              echarts={echarts}
              option={getOption()}
              style={{ height: '89%', width: '100%' }}
              onEvents={{
                click: (event) => setStatus(event.data.status, event.data.statusOriginal)
              }}
            />
          </ColStyled>
        </RowStyled>
      </ContentChart>
    </LoadingCard>
  );
};

const mapStateToProps = (state) => ({
  isLoadingStatusConsume: state.chartData.isLoadingStatusConsume,
  filterStatusConsume: state.chartData.filterStatusConsume,
  unitStatusConsume: state.chartData.unitStatusConsume,
  dataStatusConsume: state.chartData.dataStatusConsume,
  toggleMenu: state.settings.toggleMenu,
});

const mapDispatchToProps = (dispatch) => ({
  setFilterStatusConsume: (disabled) => {
    dispatch(setFilterStatusConsume(disabled));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusConsumptionChart)
