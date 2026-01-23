// create and style an component with gauge for temperature

import React from "react";
import styled, { css } from "styled-components";
import TextSpan from "../../../../Text/TextSpan";
import { floatToStringExtendDot } from "../../../../Utils";

const ContentChart = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const ThermometerContainer = styled.div`
  min-width: 120px;
  border-radius: 10px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Bulb = styled.div`
${({ theme, color }) => css`
  background-color: ${color || theme.colorSuccess500};
  min-width: 21px;
  min-height: 21px;
  max-width: 24px;
  max-height: 24px;
  border-radius: 24px;
`}`;

const Tube = styled.div`
${({ theme }) => css`
  width: 15px;
  border-radius: 8px;
  height: 100%;
  background-color: ${theme.backgroundBasicColor3};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: -5px;
`}
`;

const Mercury = styled.div`
${({ theme, color }) => css`
  width: 9px;
  background-color: ${color || theme.colorSuccess500};
  border-radius: 10px;
  height: 79%;
`}`;

const LabelsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 12px;
  height: 100%;
`;

const ContainerTube = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
`

export default function GaugeTemp({
  color,
  value,
  valueMin,
  valueMax,
  className = "",
  title = ""
}) {

  const total = valueMax + (valueMin < 0 ? Math.abs(valueMin) : valueMin);

  const maxLabel = 5;
  const itemLabel = total / maxLabel;
  const minimum = valueMin < 0 ? Math.abs(valueMin) : valueMin;
  const labels = new Array(maxLabel)
    .fill(0)
    .map((_, i) => (itemLabel * i) < minimum ? ((itemLabel * i) - minimum) : (itemLabel) * i)
    .reverse();

  const valueInMercury = (value / total) * 100;

  return (
    <>
      <ContentChart className={className}>
        <TextSpan
          style={{ height: '5%' }}
          apparence="p2" hint className="ml-4 pl-1 pt-1">
          {title}
        </TextSpan>
        <ThermometerContainer>
          <LabelsContainer>
            {labels?.map((x, i) => <TextSpan
              key={`${i}-l-d`}
              apparence="p3" hint>{x} <span style={{ fontSize: 7 }}>-</span></TextSpan>)}
          </LabelsContainer>
          <ContainerTube>
            <Tube>
              <Mercury
                color={color}
                style={{ height: `${valueInMercury}%` }} />
            </Tube>
            <Bulb color={color} />
          </ContainerTube>
        </ThermometerContainer>
        <TextSpan
          style={{ height: '5%' }}
          apparence="s2" className="ml-4 pl-1">
          {floatToStringExtendDot(value, 2)} °C
        </TextSpan>
      </ContentChart>
    </>
  );
}
