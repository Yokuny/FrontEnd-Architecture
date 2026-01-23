import { FormattedMessage } from "react-intl";
import moment from "moment";
import { Button, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import styled, { useTheme } from "styled-components";

import { TextSpan } from "../../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table";
import { floatToStringExtendDot } from "../../../../components/Utils";
import ModalViewDetails from "./ModalViewDetails";

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function TableListRVESounding(props) {
  const { data, key } = props;

  const theme = useTheme()

  const fillPolling = data?.sounding;

  return <>
    <TABLE>
      <THEAD>
        <TRH>
          <TH textAlign="center" colSpan={2}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="polling.start" />
            </TextSpan>
            <Row between="xs" className="m-0 pl-2">
              <TextSpan apparence="p3" hint>
                <FormattedMessage id="date" />
              </TextSpan>
              <TextSpan apparence="p3" hint>
                <FormattedMessage id="volume" /> (m³)
              </TextSpan>
            </Row>
          </TH>
          <TH textAlign="center" colSpan={2}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="polling.next" />
            </TextSpan>
            <Row between="xs" className="m-0 pl-2">
              <TextSpan apparence="p3" hint>
                <FormattedMessage id="date" />
              </TextSpan>
              <TextSpan apparence="p3" hint>
                <FormattedMessage id="volume" /> (m³)
              </TextSpan>
            </Row>
          </TH>
          <TH textAlign="end" style={{ width: "120px" }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="machine.supplies.consumption.received" /> (m³)
            </TextSpan>
          </TH>
          <TH textAlign="end" style={{ width: "120px" }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="machine.supplies.consumption.supplied" /> (m³)
            </TextSpan>
          </TH>
          <TH textAlign="end" style={{ width: "100px" }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="consumption" /> <FormattedMessage id="period" /> (m³)
            </TextSpan>
          </TH>
          <TH textAlign="end" style={{ width: "100px" }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="contract.max" /> (m³)
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="status" />
            </TextSpan>
          </TH>
          <TH textAlign="end" style={{ maxWidth: "120px" }}>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="diff" />
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="actions" />
            </TextSpan>
          </TH>
        </TRH>
      </THEAD>
      <TBODY>
        {fillPolling
          ?.map((item, index) => {

            if (index > 2) {
              return <></>
            }

            const nextItem = index < fillPolling.length - 1
              ? fillPolling[index + 1]
              : null

            const operationsInThisInterval = data.operations
              ?.filter((operation) =>
                moment(operation.dateStart).isSameOrAfter(moment(item.date)) &&
                moment(operation.dateStart).isSameOrBefore(moment(nextItem?.date || new Date()))
              )

            const rdosInThisInterval = data.rdo
              ?.filter((rdo) =>
                moment(rdo.date).isSameOrAfter(moment(item.date)) &&
                moment(rdo.date).isSameOrBefore(moment(nextItem?.date || new Date()))
              )

            const totalSupply = rdosInThisInterval
              ?.reduce((acc, rdo) => acc + rdo.supply, 0)

            const totalReceive = rdosInThisInterval
              ?.reduce((acc, rdo) => acc + rdo.received, 0)

            const maxAllow = operationsInThisInterval
              ?.reduce((acc, operation) => acc +
                (operation?.consumptionDailyContract
                  ? ((operation?.consumptionDailyContract / 24) * operation?.diffInHours)
                  : 0),
                0)

            const consumed = nextItem
              ? (item.volume + totalReceive) - (nextItem.volume + totalSupply)
              : 0

            const diffPercentual = 100 - ((maxAllow / consumed) * 100)

            return <TR key={`${index}+${key}`} isEvenColor={index % 2 === 0}>
              <TD textAlign="center">
                <ColFlex>
                  <TextSpan apparence="p2">
                    {moment(item.date).format("DD MMM YYYY")}
                  </TextSpan>
                  <TextSpan apparence="p3" hint>
                    {moment(item.date).format("HH:mm")}
                  </TextSpan>
                </ColFlex>
              </TD>
              <TD textAlign="end">
                <TextSpan apparence="s2">
                  {floatToStringExtendDot(item.volume, 3)}
                </TextSpan>
              </TD>
              <TD textAlign="center">
                {nextItem?.date
                  ? <ColFlex>
                    <TextSpan apparence="p2">
                      {moment(nextItem.date).format("DD MMM YYYY")}
                    </TextSpan>
                    <TextSpan apparence="p3" hint>
                      {moment(nextItem.date).format("HH:mm")}
                    </TextSpan>
                  </ColFlex>
                  : <></>}
              </TD>
              <TD textAlign="end">
                <TextSpan apparence="s2">
                  {nextItem ? floatToStringExtendDot(nextItem.volume, 3) : ""}
                </TextSpan>
              </TD>
              <TD textAlign="end">
                <TextSpan apparence="p2">
                  {nextItem ? floatToStringExtendDot(totalReceive, 3) : ""}
                </TextSpan>
              </TD>
              <TD textAlign="end">
                <TextSpan apparence="p2">
                  {nextItem ? floatToStringExtendDot(totalSupply, 3) : ""}
                </TextSpan>
              </TD>
              <TD textAlign="end">
                <TextSpan apparence="label">
                  {nextItem ? floatToStringExtendDot(consumed, 3) : ""}
                </TextSpan>
              </TD>
              <TD textAlign="end">
                <TextSpan apparence="p2">
                  {floatToStringExtendDot(maxAllow, 3)}
                </TextSpan>
              </TD>
              <TD textAlign="center">
                {diffPercentual > 0 ?
                  <Button
                    appearance="outline"
                    className="ml-2"
                    style={{
                      border: 0
                    }}
                    status={"Danger"}
                    size="Tiny"
                  >
                    <FormattedMessage id="in.excess" />
                  </Button>
                  : nextItem ? <Button
                    appearance="outline"
                    className="ml-2"
                    style={{
                      border: 0
                    }}
                    status={"Success"}
                    size="Tiny"
                  >
                    <FormattedMessage id="below.contract" />
                  </Button> : <></>}
              </TD>
              <TD textAlign="end">
                {diffPercentual > 0 &&
                  <TextSpan
                    style={{
                      backgroundColor: diffPercentual > 0
                        ? theme.colorDanger500
                        : theme.colorBasic500,
                      color: "#fff",
                      padding: "2px 5px",
                      borderRadius: "3px",
                    }}
                    className="mr-2"
                    status={diffPercentual > 0 ? "Danger" : "Control"}
                    apparence={"p3"}>
                    {floatToStringExtendDot(diffPercentual, 1)}%
                  </TextSpan>}
                <TextSpan
                  status={diffPercentual > 0 ? "Danger" : "Control"}
                  apparence={diffPercentual > 0 ? "s1" : "p2"}>
                  {diffPercentual > 0 ? "" : "-"}{floatToStringExtendDot(Math.abs(maxAllow - consumed), 1)}
                  <TextSpan apparence={"p2"}> m³</TextSpan>
                </TextSpan>
              </TD>
              <TD textAlign="center">
                <ModalViewDetails
                  operations={operationsInThisInterval}
                  rdo={rdosInThisInterval}
                  index={index}
                />
              </TD>
            </TR>
          })
        }
      </TBODY>
    </TABLE>
  </>
}
