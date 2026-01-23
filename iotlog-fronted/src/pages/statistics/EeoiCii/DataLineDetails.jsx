import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { Tooltip } from "@paljs/ui";
import { TextSpan } from "../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../components/Table";
import { floatToStringExtendDot, floatToStringBrazilian } from "../../../components/Utils";
import CIIRating from "../CII/CIIRating";
import CiiService from "../../../services/CiiService";
import { BadgeEstimated } from "../../consumption/Daily/Utils";

const TheadStyle = styled(THEAD)`
  ${({ theme }) => css`
    th {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  position: sticky;
  top: 0;
`

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
`

const valueIsValid = (value) => {
  return value !== undefined && value !== null;
}

export default function DataLineDetails(props) {
  const { data } = props;

  return <>
    <TABLE>
      <TheadStyle>
        <TRH>
          <TH>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="travel" />
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="p2" hint>
              Seq.
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="p2" hint>
              Oper.
            </TextSpan>
          </TH>
          <TH textAlign="end">
            <ColFlex>
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="distance" />
              </TextSpan>
              <TextSpan apparence="p2" hint>
                (nm)
              </TextSpan>
            </ColFlex>
          </TH>
          <TH textAlign="end" style={{ width: 90 }}>
            <Tooltip
              placement="top"
              trigger="hover"
              content={
                <TextSpan apparence="p2">
                  * <FormattedMessage id="in.travel" />
                </TextSpan>
              }
            >
              <ColFlex>
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="speed" />
                </TextSpan>
                <TextSpan apparence="p2" hint>
                  * <FormattedMessage id="average" /> (<FormattedMessage id="kn" />)
                </TextSpan>
              </ColFlex>
            </Tooltip>
          </TH>
          <TH textAlign="end">
            <ColFlex>
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="consume" />
              </TextSpan>
              <TextSpan apparence="p2" hint>
                Total (Ton)
              </TextSpan>
            </ColFlex>
          </TH>
          {/* <TH textAlign="end" style={{ width: 110 }}>
            <ColFlex>
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="in.travel" />
              </TextSpan>
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="average" /> (Kg/h)
              </TextSpan>
            </ColFlex>
          </TH>
          <TH textAlign="end" style={{ width: 110 }}>
            <ColFlex>
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="in.maneuver" />
              </TextSpan>
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="average" /> (Kg/h)
              </TextSpan>
            </ColFlex>
          </TH> */}
          <TH textAlign="end">
            <ColFlex>
              <TextSpan apparence="p2" hint>
                CO2
              </TextSpan>
              <TextSpan apparence="p2" hint>
                (Ton)
              </TextSpan>
            </ColFlex>
          </TH>
          <TH textAlign="end">
            <TextSpan apparence="p2" hint>
              EEOI
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="p2" hint>
              CII Rating
            </TextSpan>
          </TH>
        </TRH>
      </TheadStyle>
      <TBODY>
        {data?.map((x, i) => {

          const ciiReq = x.ciiRef * (1 - CiiService.getFactorByDate(x.dateTimeEnd));

          return (<TR key={i} isEvenColor={i % 2 === 0}>
            <TD>
              <TextSpan apparence="s2">
                {x.code}
              </TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="p2">
                {x.sequence}
              </TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="p2">
                {x.activities}
              </TextSpan>
            </TD>
            <TD textAlign="end">
              <TextSpan apparence="p2">
                {floatToStringExtendDot(x.distance, 2)}
              </TextSpan>
            </TD>
            <TD textAlign="end">
              <TextSpan apparence="p2">
                {floatToStringExtendDot(x.distanceInVoyage ? x.distanceInVoyage / x.timeInVoyage : 0, 1)}
              </TextSpan>
            </TD>
            <TD textAlign="end">
              <ColFlex>
                {Object.keys(x.consumption)
                  .filter(f => !!x.consumption[f])
                  .sort((a, b) => x.consumption[b] - x.consumption[a])
                  .map((f, z) => <div key={`${i}-${z}-fueld`}>
                       <TextSpan apparence={f === "IFO" ? "s2" : "p2"}
                          className={`${f === "IFO" ? "mr-1" : ""}`}
                    >
                      {floatToStringExtendDot(x.consumption[f], 1)}
                    </TextSpan>
                    <BadgeEstimated
                        status={f === "IFO" ? "Basic" : "Info"}
                        className={`${f === "IFO" ? "mr-1" : ""} ml-1`}
                        isBg
                      >
                        <TextSpan apparence={f === "IFO" ? "c3" : "p4"}>
                        {f}
                        </TextSpan>
                    </BadgeEstimated>
                  </div>)}
              </ColFlex>
            </TD>
            {/* <TD textAlign="end">
              <ColFlex>
                {Object.keys(x.consumptionInVoyage)
                  .filter(f => !!x.consumptionInVoyage[f])
                  .map((f, z) => <div key={`${i}-${z}-fueld`}>
                    <TextSpan apparence="c3" hint>
                      {`${f} `}
                    </TextSpan>
                    <TextSpan apparence="p2">
                      {floatToStringExtendDot(x.consumptionInVoyage[f] ? (x.consumptionInVoyage[f] / x.timeInVoyage) * 1000 : 0, 1)}
                    </TextSpan>
                  </div>)}
              </ColFlex>
            </TD>
            <TD textAlign="end">
              <ColFlex>
                {Object.keys(x.consumptionInPort)
                  .filter(f => !!x.consumptionInPort[f])
                  .map((f, z) => <div key={`${i}-${z}-fueld`}>
                    <TextSpan apparence="c3" hint>
                      {`${f} `}
                    </TextSpan>
                    <TextSpan apparence="p2">
                      {floatToStringExtendDot(x.consumptionInPort[f] ? (x.consumptionInPort[f] / x.timeInPort) * 1000 : 0, 1)}
                    </TextSpan>
                  </div>)}
              </ColFlex>
            </TD> */}
            <TD textAlign="end">
              <TextSpan apparence="p2">
                {floatToStringExtendDot(x.co2, 1)}
              </TextSpan>
            </TD>
            <TD textAlign="end">
              <TextSpan apparence="p2">
                {floatToStringBrazilian(x.eeoi, 2)}
              </TextSpan>
            </TD>
            <TD textAlign="center">
              {valueIsValid(x.ciiRef) &&
                valueIsValid(x.dd) &&
                valueIsValid(x.ciiAttained) ?
                <Tooltip
                  placement="top"
                  trigger="hint"
                  content={<TextSpan apparence="c1">
                    {`${new Date(x.dateTimeEnd).getFullYear()} ${new Date(x.dateTimeEnd).getFullYear() > 2022 ? `(${floatToStringExtendDot(CiiService.getFactorByDate(x.dateTimeEnd) * 100, 0)}%)` : ''}`}
                    <br />
                    CII Req: <TextSpan apparence="p2">
                      {floatToStringExtendDot(ciiReq, 2)}
                    </TextSpan>
                    <br />
                    CII Atteined: <TextSpan apparence="p2">
                      {floatToStringExtendDot(x.ciiAttained, 2)}
                    </TextSpan>
                  </TextSpan>}
                >
                  <CIIRating
                    dd={x?.dd}
                    ciiAttained={x.ciiAttained}
                    ciiReq={ciiReq}
                  />
                </Tooltip> :
                <TextSpan apparence="p2" hint>
                  -
                </TextSpan>}
            </TD>
          </TR>
          )
        })}
      </TBODY>
    </TABLE>
  </>
}
