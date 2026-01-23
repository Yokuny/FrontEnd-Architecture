import React from "react";
import styled, { css, useTheme } from "styled-components";
import { TD, TR } from "../../../../components/Table";
import { TextSpan } from "../../../../components";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { ListType } from "../../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { FormattedMessage } from "react-intl";

const ColEnd = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px 14px;
  align-items: flex-end;
  justify-content: center;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TDFirst = styled(TD)`
  position: sticky;
  left: 0;
  bottom: 0;
  z-index: 1;
  background: ${(props) =>
    props.isEvenColor
      ? props.theme.backgroundBasicColor1
      : props.theme.backgroundBasicColor2};
  padding-left: 1rem;
  min-width: 200px;
`;

const TDLast = styled(TD)`
  position: sticky;
  right: 0;
  bottom: 0;
  z-index: 1;
  background: ${(props) =>
    props.isEvenColor
      ? props.theme.backgroundBasicColor1
      : props.theme.backgroundBasicColor2};
  min-width: 150px;
  padding-right: 1rem;
`;

const TRStyled = styled(TR)`
  ${({ theme }) => css`
    td {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  z-index: 10;

  @media screen and (min-width: 40em) {
    position: sticky;
    bottom: 0px;
  }
`;

export default function Benchmark(props) {
  const { itens, unit } = props;

  const totalAll = itens?.reduce(
    (a, b) =>
      a + (b?.listTimeStatus || []).reduce((c, d) => c + (d?.minutes ?? 0), 0),
    0
  );

  const totalConsumptionAll = itens?.reduce(
    (a, b) =>
      a +
      (b?.listTimeStatus || []).reduce((c, d) => c + (d?.consumption ?? 0), 0),
    0
  );

  return (
    <>
      <TRStyled>
        <TDFirst>
          <Col>
            <TextSpan apparence="p2" hint className="pt-2 pb-2">
              Total
            </TextSpan>
            <TextSpan apparence="p2" hint className="mt-4">
              <FormattedMessage id="average" />
            </TextSpan>
          </Col>
        </TDFirst>
        {ListType?.map((x, i) => {
          const minutesInTheStatus = itens?.reduce(
            (a, b) =>
              a +
              (b?.listTimeStatus?.find((y) =>
                x.accept.includes(y.status?.toLowerCase())
              )?.minutes ?? 0),
            0
          );

          const consumptionInTheStatus = itens?.reduce(
            (a, b) =>
              a +
              (b?.listTimeStatus?.find((y) =>
                x.accept.includes(y.status?.toLowerCase())
              )?.consumption ?? 0),
            0
          );

          return (
            <>
              <TD textAlign="center" key={`bch-${i}`}>
                <ColEnd>
                  <TextSpan apparence="p3" hint>
                    {floatToStringExtendDot(
                      minutesInTheStatus
                        ? (minutesInTheStatus / totalAll) * 100
                        : 0,
                      1
                    )}
                    %
                  </TextSpan>
                  <TextSpan apparence="p2" hint>
                    {`${floatToStringExtendDot(
                      minutesInTheStatus ? minutesInTheStatus / 60 : 0,
                      2
                    )}`}
                    <TextSpan apparence="p3" className="ml-1">
                      HR
                    </TextSpan>
                  </TextSpan>
                  <TextSpan apparence="s2" hint>
                    {`${floatToStringExtendDot(consumptionInTheStatus, 2)}`}
                    <TextSpan apparence="p3" className="ml-1">
                      {unit}
                    </TextSpan>
                  </TextSpan>
                  <TextSpan apparence="p2" className="mt-2" hint>
                    {`${floatToStringExtendDot(
                      consumptionInTheStatus /
                      (minutesInTheStatus ? minutesInTheStatus / 60 : 0),
                      2
                    )}`}
                    <TextSpan apparence="p3" className="ml-1">
                      {unit}/HR
                    </TextSpan>
                  </TextSpan>
                  <TextSpan apparence="s2" hint>
                    {`${floatToStringExtendDot(
                      (consumptionInTheStatus /
                        (minutesInTheStatus ? minutesInTheStatus / 60 : 0)) * 24,
                      2
                    )}`}
                    <TextSpan apparence="p3" className="ml-1">
                      {unit}/<FormattedMessage id="day" />
                    </TextSpan>
                  </TextSpan>
                </ColEnd>
              </TD>
            </>
          );
        })}
        <TDLast textAlign="center">
          <ColEnd className="pr-1">
            <TextSpan apparence="p2" hint>
              {floatToStringExtendDot(totalAll ? totalAll / 60 : 0, 2)}
              <TextSpan className="ml-1" apparence="p3" hint>
                HR
              </TextSpan>
            </TextSpan>
            <TextSpan apparence="s1" hint>
              {floatToStringExtendDot(totalConsumptionAll, 2)}
              <TextSpan className="ml-1" apparence="p3" hint>
                {unit}
              </TextSpan>
            </TextSpan>
            <TextSpan apparence="p2" hint className="pt-4">
              {floatToStringExtendDot(
                totalConsumptionAll / (totalAll ? totalAll / 60 : 0),
                2
              )}
              <TextSpan className="ml-1" apparence="p3" hint>
                {unit}/HR
              </TextSpan>
            </TextSpan>
            <TextSpan apparence="s2" hint>
              {floatToStringExtendDot(
                (totalConsumptionAll / (totalAll ? totalAll / 60 : 0)) * 24,
                2
              )}
              <TextSpan className="ml-1" apparence="p3" hint>
                {unit}/<FormattedMessage id="day" />
              </TextSpan>
            </TextSpan>
          </ColEnd>
        </TDLast>
      </TRStyled>
    </>
  );
}
