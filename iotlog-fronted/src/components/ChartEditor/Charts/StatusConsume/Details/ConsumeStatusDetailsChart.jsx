import React from "react";
import { FormattedMessage } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import {
  Barrel,
  MapMarkerDistance,
  OilMeter,
  Speedometer,
} from "../../../../Icons";
import TextSpan from "../../../../Text/TextSpan";
import { floatToStringExtendDot } from "../../../../Utils";
import { getValueConsume } from "../Utils";
import { getIcon } from "../../../../../pages/fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { ContentChart } from "../../../Utils";
import { EvaIcon } from "@paljs/ui";
import StatusSelected from "../../General/StatusSelected";

const IconRounded = styled.div`
  ${({ theme, colorTextTheme = "", color = "" }) => css`
    padding: 12px;
    // background-color: ${theme.colorPrimary500};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-left: 5px;
    margin-right: 8px;
  `}

  .ml-r3 {
    top: -5px;
    left: -4px;
    position: relative;
  }
`;

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
`;

const CardGrid = styled.div`
  display: grid;
  ${({ isMinimal = false }) => `gap: ${isMinimal ? '.50rem' : '.75rem'}`};
  align-items: stretch;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  width: 100%;
`;

const CardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.05rem;
  ${({ isMinimal = false }) => `padding: ${isMinimal ? '.15rem .45rem' : '.45rem'}`};
  border-radius: 0.25rem;
  background-color: ${({ theme }) => theme?.backgroundBasicColor2};
  border: 1px solid ${({ theme }) => theme?.borderBasicColor3 || "rgba(148, 163, 184, 0.12)"};
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

const ColLine = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  width: 100%;
  align-items: flex-start;
`;

const ChartBody = styled(ContentChart)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.75rem;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
`;

const ConsumeStatusDetailsChart = (props) => {
  const { filterStatusConsume, dataStatusConsume } = props;

  const theme = useTheme();

  const seriesDistance = dataStatusConsume
    ?.filter((x) =>
      filterStatusConsume?.length && filterStatusConsume[0]
        ? filterStatusConsume.includes(x?.status)
        : true
    )
    ?.map((x) => x.distance);

  const distance = seriesDistance?.reduce((a, b) => a + (b ?? 0), 0);

  const seriesConsume = dataStatusConsume
    ?.filter((x) =>
      filterStatusConsume?.length && filterStatusConsume[0]
        ? filterStatusConsume.includes(x?.status)
        : true
    )
    ?.map((x) => getValueConsume(x.consumption, props.unitStatusConsume));

  const seriesTime = dataStatusConsume
    ?.filter((x) =>
      filterStatusConsume?.length && filterStatusConsume[0]
        ? filterStatusConsume.includes(x?.status)
        : true
    )
    ?.map((x) => (x.minutes ? parseFloat((x.minutes / 60)?.toFixed(2)) : 0));

  const totaltime = seriesTime.reduce((a, b) => a + b, 0);

  const avgLitre = totaltime
    ? seriesConsume.reduce((a, b) => a + (b ?? 0), 0) / totaltime
    : 0;
  const avgSpeed = totaltime ? distance / totaltime : 0;

  const getStatus = () => {
    return dataStatusConsume.find((item) => filterStatusConsume?.includes(item.status))?.status
  }

  const hasStatusActive = !!getStatus()

  return (
    <Container>
      <ChartBody>
        <StatusSelected />
        <CardGrid isMinimal={hasStatusActive}>
          <CardItem isMinimal={hasStatusActive}>
            <IconRounded>
              <MapMarkerDistance
                style={{
                  height: 23,
                  width: 23,
                  fill: theme.colorSuccess500,
                }}
              />
            </IconRounded>
            <ColLine>
              <div>
                <TextSpan apparence="h6" style={{ marginRight: 4 }}>
                  {floatToStringExtendDot(distance, 2).toString().split(",")[0]}
                  <TextSpan apparence="s2">
                    ,{floatToStringExtendDot(distance, 2).toString().split(",")[1]}
                  </TextSpan>
                </TextSpan>
                <TextSpan apparence="p3" hint style={{ marginBottom: 0.6 }}>
                  nm
                </TextSpan>
              </div>
              <TextSpan apparence="p3" hint>
                <FormattedMessage id="distance" />
              </TextSpan>
            </ColLine>
          </CardItem>
          <CardItem isMinimal={hasStatusActive}>
            <IconRounded>
              <Speedometer
                style={{
                  height: 23,
                  width: 23,
                  fill: theme.colorInfo400,
                }}
              />
            </IconRounded>
            <ColLine>
              <div>
                <TextSpan apparence="h6" style={{ marginRight: 4 }}>
                  {floatToStringExtendDot(avgSpeed, 2).toString().split(",")[0]}
                  <TextSpan apparence="s2">
                    ,{floatToStringExtendDot(avgSpeed, 2).toString().split(",")[1]}
                  </TextSpan>
                </TextSpan>
                <TextSpan apparence="p3" hint style={{ marginBottom: 0.6 }}>
                  {`kn`}
                </TextSpan>
              </div>
              <TextSpan apparence="p3" hint>
                <FormattedMessage id="speed" /> <FormattedMessage id="average" />
              </TextSpan>
            </ColLine>
          </CardItem>
          <CardItem isMinimal={hasStatusActive}>
            <IconRounded colorTextTheme={`colorPrimary100`}>
              <EvaIcon
                name="clock-outline"
                options={{
                  width: 23,
                  height: 23,
                  fill: theme.colorBasic600
                }}
              />
            </IconRounded>
            <ColLine>
              <div>
                <TextSpan apparence="h6" style={{ marginRight: 4 }}>
                  {floatToStringExtendDot(totaltime, 2).toString().split(",")[0]}
                  <TextSpan apparence="s2">
                    ,{floatToStringExtendDot(totaltime, 2).toString().split(",")[1]}
                  </TextSpan>
                </TextSpan>
                <TextSpan apparence="p3" hint style={{ marginBottom: 0.6 }}>
                  hr
                </TextSpan>
              </div>
              <TextSpan apparence="p3" hint>
                <FormattedMessage id="hour.unity" />
              </TextSpan>
            </ColLine>
          </CardItem>
          <CardItem isMinimal={hasStatusActive}>
            <IconRounded>
              <Barrel
                style={{
                  height: 23,
                  width: 23,
                  fill: theme.colorPrimary700,
                }}
              />
            </IconRounded>
            <ColLine>
              <div>
                <TextSpan apparence="h6" style={{ marginRight: 4 }}>
                  {
                    floatToStringExtendDot(avgLitre * 24, 3)
                      .toString()
                      .split(",")[0]
                  }
                  <TextSpan apparence="s2">
                    ,
                    {
                      floatToStringExtendDot(avgLitre * 24, 3)
                        .toString()
                        .split(",")[1]
                    }
                  </TextSpan>
                </TextSpan>
                <TextSpan apparence="p3" hint style={{ marginBottom: 0.6 }}>
                  {`${props.unitStatusConsume}/`}
                  <FormattedMessage id="day" />
                </TextSpan>
              </div>
              <TextSpan apparence="p3" hint>
                <FormattedMessage id="average" /> <FormattedMessage id="day" />
              </TextSpan>
            </ColLine>
          </CardItem>
        </CardGrid>
      </ChartBody>
    </Container>
  );
};

export default ConsumeStatusDetailsChart;
