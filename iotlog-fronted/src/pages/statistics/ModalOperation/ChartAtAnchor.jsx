import { Card, CardBody, Row } from "@paljs/ui";
import ReactECharts from 'echarts-for-react';
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";
import moment from "moment";
import { nanoid } from "nanoid";
import { CardNoShadow, DownloadCSV, LabelIcon, TextSpan } from "../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../components/Table";
import { floatToStringExtendDot } from "../../../components/Utils";
import ReactCountryFlag from "react-country-flag";
import { Anchor } from "../../../components/Icons";
import { useThemeSelected } from "../../../components/Hooks/Theme";

export default function ChartAtAnchor(props) {

  const { seriesData } = props;

  const theme = useTheme();
  const intl = useIntl();
  const { isDark } = useThemeSelected();
  const seriesOrdered = seriesData?.sort((a, b) => b.minutes - a.minutes)

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
          name: item?.city && item?.stateCode ? `${item?.city || ''} - ${(isNaN(item?.stateCode) ? item?.stateCode : item?.stateName) || ''}` : (item.fence || intl.formatMessage({ id: 'other' }))
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
            renderIcon={() => <Anchor
              style={{
                height: 20,
                width: 20,
                fill: theme?.textHintColor,
                padding: 2
              }}
            />}
            renderTitle={() => <TextSpan apparence="s1" className="ml-1" hint><FormattedMessage id="anchorage" /></TextSpan>}
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
                    <FormattedMessage id="description" />
                  </TextSpan>
                </TH>
                <TH>
                  <TextSpan apparence="s2" hint>
                    <FormattedMessage id="proximity" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="s2" hint>
                    Qt. <FormattedMessage id="anchorage" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="s2" hint>
                    <FormattedMessage id="hour.unity" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="s2" hint>
                    <FormattedMessage id="average" /> <TextSpan apparence="p3">(HR)</TextSpan>
                  </TextSpan>
                </TH>
              </TRH>
            </THEAD>
            <TBODY>
              {seriesOrdered?.map((x, i) => (<TR key={i} isEvenColor={i % 2 === 0}>
                <TD>
                  <TextSpan apparence="s2">{x.fence || "-"}</TextSpan>
                </TD>
                <TD>
                  <TextSpan apparence="s2">{x.city ? `${x.city} - ${isNaN(x.stateCode) ? x.stateCode : x.stateName}` : '-'}
                    <ReactCountryFlag
                      countryCode={x.country}
                      svg
                      style={{ marginLeft: 5, marginRight: 3, marginTop: -3, fontSize: "1.4em", borderRadius: 4 }} />
                  </TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="s2">{x.fencesCount}</TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="s2">{floatToStringExtendDot(x.minutes ? x.minutes / 60 : 0, 1)}</TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="s2">{floatToStringExtendDot(x.minutes ? (x.minutes / 60) / (x?.fencesCount ?? 0) : 0, 1)}</TextSpan>
                </TD>
              </TR>))}
              {!!seriesOrdered?.length && <TR>
                <TD>
                  <TextSpan apparence="c2" hint>
                    Total
                  </TextSpan>
                </TD>
                <TD></TD>
                <TD textAlign="center">
                  <TextSpan apparence="c2">{seriesOrdered?.reduce((a, b) => a + (b?.fencesCount ?? 0), 0)}</TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="c2">{floatToStringExtendDot(seriesOrdered?.reduce((a, b) => a + (b.minutes ?? 0), 0) / 60, 1)}</TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="c2">{floatToStringExtendDot((seriesOrdered?.reduce((a, b) => a + (b.minutes ?? 0), 0) / 60) / seriesOrdered?.reduce((a, b) => a + b.fencesCount, 0), 1)}</TextSpan>
                </TD>
              </TR>
              }
            </TBODY>
          </TABLE>
          <Row className="m-0 pt-2" end="xs">
            <DownloadCSV
              appearance="ghost"
              status="Basic"
              getData={() => seriesOrdered?.map(x => ({
                description: x.fence || "-",
                proximity: x.city ? `${x.city} - ${isNaN(x.stateCode) ? x.stateCode : x.stateName}` : '-',
                fencesCount: x.fencesCount,
                minutes: x.minutes ? x.minutes / 60 : 0,
                average: x.minutes ? (x.minutes / 60) / (x?.fencesCount ?? 0) : 0,
              }))}
              fileName={`anchored_${moment().format("YYYYMMMDDHHmmss")}`}
            />
          </Row>
        </CardBody>
      </CardNoShadow>
    </>
  )
}
