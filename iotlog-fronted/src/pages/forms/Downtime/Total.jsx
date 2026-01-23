import Tooltip from "@paljs/ui/Tooltip";
import React from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { TextSpan } from "../../../components";
import { floatToStringBrazilian, floatToStringExtendDot } from "../../../components/Utils";
import useProfitLossHook from "./hooks/useProfitLossHook";

const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-between;
  width: 100%;
`

export default function Total(props) {
  const { item, ptax } = props;

  const {
    consumptionsValue,
    sumOthers,
    revenue,
    loss,
    operationIsDownTime,
    operationIsRunning,
    isPartialDowntime,
    contractAsset,
    valueInPeriodWithFactor
  } = useProfitLossHook({ item, ptax })


  if (!contractAsset) {
    return <TextSpan apparence="c2"></TextSpan>;
  }

  return (
    <>
      <Tooltip
        eventListener="#scrollPlacementId"
        className="inline-block"
        trigger="hint"
        content={<>
          <Col>
            <TextSpan apparence="p2">
              PTax: R$ <strong>{floatToStringBrazilian(ptax, 4)}</strong></TextSpan>
            {isPartialDowntime && <TextSpan apparence="p2">
              <FormattedMessage id="factor" />: <strong>{item.factor}%</strong></TextSpan>}
            <TextSpan apparence="p2">
              <FormattedMessage id="revenue" />: R$ <strong>{floatToStringExtendDot(revenue, 2)}</strong></TextSpan>
            <TextSpan apparence="p2">
              <FormattedMessage id="loss" />: R$ <strong>-{floatToStringExtendDot(loss, 2)}</strong></TextSpan>
            <TextSpan apparence="p2">
              <FormattedMessage id="consume" />: R$ <strong>-{floatToStringExtendDot(consumptionsValue, 2)}</strong></TextSpan>
            <TextSpan apparence="p2">
              <FormattedMessage id="others" />: R$ <strong>-{floatToStringExtendDot(sumOthers, 2)}</strong></TextSpan>
          </Col>
        </>}
        placement={"top"}
      >
        <TextSpan
          status={
            (isPartialDowntime || operationIsDownTime)
                ? 'Danger'
                : operationIsRunning ? 'Success' : ''}
          apparence="c2">
          {operationIsDownTime || !isPartialDowntime ? "-" : "+"}{floatToStringExtendDot(valueInPeriodWithFactor, 2)}
        </TextSpan>
      </Tooltip >
    </>
  );
}


