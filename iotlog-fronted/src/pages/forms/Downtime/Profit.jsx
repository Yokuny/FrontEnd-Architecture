import styled from "styled-components";
import { TextSpan } from "../../../components";
import { floatToStringExtendDot } from "../../../components/Utils";
import { calcFactor } from "./Utils";

const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-end;
`;

export default function Profit(props) {
  const { item, ptax } = props;

  if (!item.contractAsset) {
    return <TextSpan apparence="c2"></TextSpan>;
  }

  const valueInBrl = calcFactor(
    item.contractAsset?.daily?.BRL,
    item,
    item.factor || 100
  );
  const valueInUsd =
    calcFactor(item.contractAsset?.daily?.USD, item, item.factor || 100) * ptax;
  const valueInPeriodWithFactor = valueInBrl + valueInUsd;

  const operationIsDownTime =
    item.status === "downtime" || item.status === "downtime-parcial";
  const operationIsRunning = item.status === "operacao";
  const isPartialDowntime = item.status === "downtime-parcial";
  const isParadaProgramada = item.status === "parada-programada";

  const renderPartialDowntime = () => {
    const factor = item.factor || 100;

    const lossInBrl = calcFactor(item.contractAsset?.daily?.BRL, item, factor);
    const lossInUsd =
      calcFactor(item.contractAsset?.daily?.USD, item, factor) * ptax;
    const loss = lossInBrl + lossInUsd;

    return (
      <>
        <Col>
          <TextSpan status={"Danger"} apparence="p2">
            {`-${floatToStringExtendDot(loss, 2)}`}
          </TextSpan>
        </Col>
      </>
    );
  };

  return (
    <>
      {isPartialDowntime && (item.factor || 100) < 100 ? (
        renderPartialDowntime()
      ) : (
        <TextSpan
          status={
            operationIsDownTime || isParadaProgramada ? "Danger" : operationIsRunning ? "Success" : ""
          }
          apparence="p2"
        >
          {`-${floatToStringExtendDot(valueInPeriodWithFactor, 2)}`}
        </TextSpan>
      )}
    </>
  );
}
