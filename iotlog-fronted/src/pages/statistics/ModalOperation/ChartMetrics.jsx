import styled, { css, useTheme } from "styled-components";
import { LabelIcon, TextSpan } from "../../../components";
import { floatToStringExtendDot } from "../../../components/Utils";
import { FormattedMessage } from "react-intl";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../components/Table";
import { getIcon } from "../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { IconBorder } from "../../../components/Icons/IconRounded";
import { Card, CardBody, EvaIcon } from "@paljs/ui";

const ColContent = styled.div`
  display: flex;
  align-content: center;
`
export default function ChartMetrics(props) {
  const theme = useTheme();

  const { listAnalytics } = props;

  const listAnalyticsSortered = listAnalytics?.sort((a, b) => b.distance - a.distance)

  const totalMinutes = listAnalyticsSortered?.reduce((a, b) => a + (b.minutes ? (b.minutes / 60) : 0), 0) || 0;

  return (<>
    <Card style={{ marginBottom: 0, overflowX: 'hidden' }}>
      <CardBody style={{ overflowX: 'hidden' }}>
        <LabelIcon
          renderIcon={() => <EvaIcon
          name="trending-up-outline"
            options={{
              height: 20,
              width: 20,
              fill: theme?.textHintColor,
            }}
          />}
          renderTitle={() => <TextSpan apparence="s1" className="ml-1" hint><FormattedMessage id="times.operational" /></TextSpan>}
        />
        <TABLE>
          <THEAD>
            <TRH>
              <TH>
                <TextSpan apparence="s2" hint>
                  <FormattedMessage id="status" />
                </TextSpan>
              </TH>
              <TH textAlign="center">
                <TextSpan apparence="s2" hint>
                  <FormattedMessage id="distance" /> <TextSpan apparence="p3">(NM)</TextSpan>
                </TextSpan>
              </TH>
              <TH textAlign="center">
                <TextSpan apparence="s2" hint>
                  <FormattedMessage id="hour.unity" />
                </TextSpan>
              </TH>
              <TH textAlign="center">
                <TextSpan apparence="s2" hint>
                  <FormattedMessage id="speed.avg" /> <TextSpan apparence="p3">(NM/H)</TextSpan>
                </TextSpan>
              </TH>
            </TRH>
          </THEAD>
          <TBODY>
            {listAnalyticsSortered?.map((x, i) => {
              const iconProps = getIcon(x.status, theme, true);
              return (<TR key={i} isEvenColor={i % 2 === 0}>
                <TD>
                  <ColContent>
                    <IconBorder
                      color="transparent"
                      style={{ fill: iconProps.bgColor }}
                    >
                      {iconProps.component}
                    </IconBorder>
                    <TextSpan apparence="s2" className="ml-2 pt-2">
                      <FormattedMessage id={iconProps.text} />
                    </TextSpan>
                  </ColContent>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="s2">{floatToStringExtendDot(x.distance, 1)}</TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="s2">{floatToStringExtendDot(x.minutes ? x.minutes / 60 : 0, 1)}</TextSpan>
                </TD>
                <TD textAlign="center" style={{ width: 40 }}>
                  <TextSpan apparence="s2">
                    {floatToStringExtendDot(x.minutes ? x.distance / (x.minutes / 60) : 0, 1)}
                  </TextSpan>
                </TD>
              </TR>
              )
            })}
            {!!listAnalyticsSortered?.length && <TR>
              <TD>
                <TextSpan apparence="c2" hint>Total</TextSpan>
              </TD>
              <TD textAlign="center">
                <TextSpan apparence="c2">{floatToStringExtendDot(listAnalyticsSortered?.reduce((a, b) => a + b.distance, 0), 1)}</TextSpan>
              </TD>
              <TD textAlign="center">
                <TextSpan apparence="c2">{floatToStringExtendDot(totalMinutes, 1)}</TextSpan>
              </TD>
              <TD textAlign="center">
                <TextSpan apparence="c2"></TextSpan>
              </TD>
            </TR>}
          </TBODY>
        </TABLE>
      </CardBody>
    </Card>
  </>)
}
