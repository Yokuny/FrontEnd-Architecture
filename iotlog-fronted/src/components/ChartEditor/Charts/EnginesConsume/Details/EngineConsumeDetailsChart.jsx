import React from "react";
import { FormattedMessage } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import TextSpan from "../../../../Text/TextSpan";
import { ContentChart } from "../../../Utils";
import { Engine } from "../../../../Icons";
import { floatToStringExtendDot } from "../../../../Utils";
import StatusSelected from "../../General/StatusSelected";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
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

const EngineList = styled.div`
  ${({ countEngines }) => css`
    grid-template-rows: repeat(${countEngines <= 2 ? 1 : 2}, 1fr);

     @media (min-width: 768px) {
    grid-template-columns: repeat(${countEngines <= 2 ? 1 : countEngines <= 4 ? 2 : 3}, minmax(0, 1fr));
  }
  `}
    display: grid;
    gap: 0.75rem;
     ${({ isMinimal = false }) => `gap: ${isMinimal ? '.5rem' : '.75rem'}`};
    align-items: stretch;
    grid-template-columns: 1fr;
    
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;


`;

const EngineRow = styled.div`
  display: grid;
  align-items: center;
   ${({ isMinimal = false }) => `gap: ${isMinimal ? '.6rem' : '1.1rem'}`};
  width: 100%;
  height: 100%;
  padding: 1rem 0.9rem;
  border-radius: 0.25rem;
  background-color: ${({ theme }) =>
    theme?.backgroundBasicColor2};
  border: 1px solid
    ${({ theme }) => theme?.borderBasicColor3 || "rgba(148, 163, 184, 0.12)"};
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 26px -24px rgba(15, 23, 42, 0.8);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
`;

const EngineBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  min-width: 69px;
  height: 100%;
  padding: 0.35rem 0.65rem;
  border-radius: 0.25rem;
  background-color: ${({ theme }) =>
    theme?.colorPrimary500
      ? `${theme.colorPrimary500}10`
      : "rgba(56, 189, 248, 0.15)"};
  color: ${({ theme }) => theme?.colorPrimary500 || "#38bdf8"};
`;

const EngineContent = styled.div`
  display: flex;
  flex-direction: column;
   ${({ isMinimal = false }) => `gap: ${isMinimal ? '.4rem' : '.9rem'}`};
  width: 100%;
  height: 100%;
`;

const EngineHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  //flex-wrap: wrap;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const EngineIndex = styled(TextSpan)`
  font-weight: 600;
  font-size: 1.1rem;
  color: inherit;
`;

const EngineSubtitle = styled(TextSpan)`
  font-size: 0.8rem;
  color: ${({ theme }) => theme?.colorBasic500 || "#94a3b8"};
`;

const HoursText = styled(TextSpan)`
  font-size: 0.7rem;
  color: ${({ theme }) => theme?.colorBasic600 || "#cbd5f5"};
  opacity: 0.7;
`;

const EngineFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
   ${({ isMinimal = false }) => `margin-top: ${isMinimal ? '-8' : '-12'}px`};
`;

const ProgressTrack = styled.div`
  position: relative;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
  background-color: ${({ theme }) =>
    theme?.backgroundBasicColor4 || "rgba(148, 163, 184, 0.24)"};
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ value }) => Math.min(Math.max(value, 0), 100)}%;
  border-radius: inherit;
  background-color: ${({ value = 0, theme }) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    if (safeValue > 90) {
      return theme?.colorDanger500 || "#ef4444";
    }
    if (safeValue > 80) {
      return theme?.colorDanger300 || "#f97316";
    }
    if (safeValue > 60) {
      return theme?.colorWarning500 || "#facc15";
    }
    if (safeValue > 20) {
      return theme?.colorSuccess500 || "#22c55e";
    }
    return theme?.colorInfo500 || "#38bdf8";
  }};
  transition: width 0.4s ease, background-color 0.3s ease;
`;

const MetricStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.1rem;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const MetricLabel = styled(TextSpan)`
  font-size: 0.7rem;
  text-align: right;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme?.colorBasic600 || "#cbd5f5"};
`;

const MetricValue = styled(TextSpan)`
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: -5px;
`;

const EngineConsumeDetailsChart = (props) => {
  const {
    data,
    filterStatusConsume,
    dataStatusConsume
  } = props;

  const totalUsageMinutes = data?.engines?.reduce(
    (acc, engine) => acc + (engine.usageTime || 0),
    0
  );

  const getStatus = () => {
    return dataStatusConsume.find((item) => filterStatusConsume?.includes(item.status))?.status
  }

  const hasStatusActive = !!getStatus()

  return (
    <Container>
      <ChartBody>
        <StatusSelected />

        <EngineList
          isMinimal={hasStatusActive}
          countEngines={data?.engines?.length || 0}>
          {data?.engines?.map((engine, index) => {
            const usageMinutes = engine?.usageTime || 0;
            const usagePercent =
              totalUsageMinutes > 0
                ? (usageMinutes * 100) / totalUsageMinutes
                : 0;
            const loadPercent = engine?.averagePower ?? 0;

            return (
              <EngineRow
                key={index}>

                <EngineContent isMinimal={hasStatusActive}>
                  <EngineHeader>
                    <div>
                      <EngineBadge>
                        <EngineIndex apparence="s1">{index + 1}x</EngineIndex>
                        <Engine width={18} height={18} />
                      </EngineBadge>
                    </div>
                    <MetricStack>
                      <MetricLabel apparence="p3" hint>
                        <FormattedMessage id="load" defaultMessage="Load" />
                      </MetricLabel>
                      <MetricValue apparence="h6" style={{ fontSize: '.9rem' }}>
                        {floatToStringExtendDot(loadPercent, 1)} %
                      </MetricValue>
                    </MetricStack>
                  </EngineHeader>
                  <ProgressTrack>
                    <ProgressFill value={loadPercent} />
                  </ProgressTrack>
                  <EngineFooter isMinimal={hasStatusActive}>
                    <HoursText apparence="c2" hint>
                      {floatToStringExtendDot(usageMinutes / 60, 1)} HR
                    </HoursText>
                    <EngineSubtitle apparence="p3" hint>
                      {floatToStringExtendDot(usagePercent, 1)}%
                    </EngineSubtitle>
                  </EngineFooter>
                </EngineContent>
              </EngineRow>
            );
          })}
        </EngineList>
      </ChartBody>
    </Container>
  );
};

export default EngineConsumeDetailsChart;
