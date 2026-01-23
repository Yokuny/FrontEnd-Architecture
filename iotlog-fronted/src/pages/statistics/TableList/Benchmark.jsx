import React from "react";
import styled, { css, useTheme } from "styled-components";
import { TextSpan } from "../../../components";
import { TD, TR } from "../../../components/Table";
import { floatToStringBrazilian, floatToStringExtendDot } from "../../../components/Utils";
import { getIcon } from "../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";

const ColEnd = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 14px;
  align-items: flex-end;
`;

const TRStyled = styled(TR)`
  ${({ theme }) => css`
    td {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  @media screen and (min-width: 40em) {
    position: sticky;
    bottom: -4px;
  }
`

export default function Benchmark(props) {
  const { listStatusAllow, itens } = props;

  const theme = useTheme();

  const totalAll = itens?.reduce(
    (a, b) =>
      a + (b?.listTimeStatus || []).reduce((c, d) => c + (d?.minutes ?? 0), 0),
    0
  );

  const totalDistanceAll = itens?.reduce(
    (a, b) =>
      a + (b?.listTimeStatus || []).reduce((c, d) => c + (d?.distance ?? 0), 0),
    0
  );

  return (
    <>
      <TRStyled>
        <TD>
          <TextSpan apparence="p2" hint className="pt-2 pb-2">Total</TextSpan>
        </TD>
        {listStatusAllow?.map((x, i) => {
          const minutesInTheStatus = itens?.reduce(
            (a, b) =>
              a +
              (b?.listTimeStatus?.find((y) => y.status?.toLowerCase() === x)?.minutes ?? 0),
            0
          );

          const distanceInTheStatus = itens?.reduce(
            (a, b) =>
              a +
              (b?.listTimeStatus?.find((y) => y.status?.toLowerCase() === x)?.distance ?? 0),
            0
          );

          return (
            <>
              <TD textAlign="center" key={`bch-${i}`}>
                <ColEnd>
                <TextSpan
                    apparence="p3"
                    hint
                  >
                    {floatToStringExtendDot(
                      minutesInTheStatus
                        ? (minutesInTheStatus / totalAll) * 100
                        : 0,
                      1
                    )}
                    %
                  </TextSpan>
                  <TextSpan
                    apparence="p2"
                    hint
                  >
                    {`${floatToStringExtendDot(minutesInTheStatus ? minutesInTheStatus / 60 : 0, 1)}`}
                    <TextSpan apparence="p3" className="ml-1">H</TextSpan>
                  </TextSpan>
                  <TextSpan
                    apparence="s2"
                    hint
                  >
                    {`${floatToStringExtendDot(distanceInTheStatus, 2)}`}
                    <TextSpan apparence="p3" className="ml-1">NM</TextSpan>
                  </TextSpan>

                </ColEnd>
              </TD>
            </>
          );
        })}
        <TD textAlign="center">
          <ColEnd className="pr-1">
            <TextSpan apparence="p2" hint>
              {floatToStringBrazilian(totalAll ? totalAll / 60 : 0, 1)}
              <TextSpan className="ml-1" apparence="p3" hint>
                HR
              </TextSpan>
            </TextSpan>
            <TextSpan apparence="s1" hint>
              {floatToStringExtendDot(totalDistanceAll, 2)}
              <TextSpan className="ml-1" apparence="p3" hint>
                NM
              </TextSpan>
            </TextSpan>
          </ColEnd>
        </TD>
      </TRStyled>
    </>
  );
}
