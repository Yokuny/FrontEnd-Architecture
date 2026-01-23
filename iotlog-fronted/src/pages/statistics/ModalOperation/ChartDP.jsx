import { Card, CardBody, Row } from "@paljs/ui";
import ReactECharts from 'echarts-for-react';
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { CardNoShadow, DownloadCSV, LabelIcon, TextSpan } from "../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../components/Table";
import { floatToStringExtendDot } from "../../../components/Utils";
import { Platform } from "../../../components/Icons";
import moment from "moment";
import { useThemeSelected } from "../../../components/Hooks/Theme";
import { nanoid } from "nanoid";

export default function ChartDP(props) {

  const { seriesData } = props;

  const theme = useTheme();
  const intl = useIntl();
  const { isDark } = useThemeSelected();

  const seriesOrdered = seriesData?.sort((a, b) => b.minutes - a.minutes) || [];

  const option = {
    darkMode: !!isDark,
    grid: {
      bottom: '25%'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const total = seriesOrdered.reduce((sum, item) => sum + item.minutes, 0);
        const percentage = (params.value / total) * 100;
        return `<strong>${params.name}</strong><br/>
                ${intl.formatMessage({ id: 'total.hours' })}: ${floatToStringExtendDot(params.value / 60, 2)} h<br/>
                ${intl.formatMessage({ id: 'percent' })}: ${floatToStringExtendDot(percentage || 0, 2)}%`;
      }
    },
    series: [
      {
        name: 'Códigos Operacionais',
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['50%', '40%'],
        label: {
          show: true,
          color: theme.textBasicColor
        },
        data: seriesData?.map((item) => ({
          value: item.minutes,
          name: item.name || ''
        }))
      }
    ],
    responsive: true
  };

  return (
    <>
      <CardNoShadow style={{ marginBottom: 0, overflowX: 'hidden' }}>
        <CardBody style={{ overflowX: 'hidden' }}>
          <LabelIcon
            renderIcon={() => <Platform
              style={{
                height: 20,
                width: 20,
                fill: theme?.textHintColor,
                padding: 2
              }}
            />}
            renderTitle={() => <TextSpan apparence="s1" className="ml-1" hint><FormattedMessage id="platform" /></TextSpan>}
          />
          <ReactECharts
            option={option}
            style={{ height: '350px' }}
            key={nanoid(5)}
          />

          <TABLE>
            <THEAD>
              <TRH>
                <TH>
                  <TextSpan apparence="s2" hint>
                    <FormattedMessage id="platform" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="s2" hint>
                    Total <FormattedMessage id="hours" />
                  </TextSpan>
                </TH>
              </TRH>
            </THEAD>
            <TBODY>
              {seriesOrdered?.map((x, i) => (<TR key={i} isEvenColor={i % 2 === 0}>
                <TD>
                  <TextSpan apparence="s2">{x.name}</TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="s2">{floatToStringExtendDot(x.minutes ? x.minutes / 60 : 0, 1)}</TextSpan>
                </TD>
              </TR>))}
            </TBODY>
          </TABLE>
          <Row className="m-0 pt-2" end="xs">
            <DownloadCSV
              appearance="ghost"
              status="Basic"
              getData={() => seriesOrdered?.map(x => ({
                platform: x.name,
                hours: x.minutes ? x.minutes / 60 : 0
              }))}
              fileName={`platforms_${moment().format("YYYYMMMDDHHmmss")}`}
            />
          </Row>
        </CardBody>
      </CardNoShadow>
    </>
  )
}
