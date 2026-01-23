import { connect } from "react-redux";
import styled from "styled-components";
import { Tooltip } from "@paljs/ui";
import { TextSpan } from "../../../../../components";
import { floatToStringExtendDot, isValueValid } from "../../../../../components/Utils";
import { POSITION_DATA_CONSUME } from "../../Constants";

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;

  .max-text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 90px;
  }
`;

const PowerData = (props) => {

  const { isShowData, data, itemHistoryConsume, routeConsumption, routeConsumptionSensors } = props;

  if (!isShowData) {
    return <>
      <Tooltip
        key={"power"}
        eventListener="#scrollPlacementId"
        className="inline-block"
        trigger="hint"
        placement={"top"}
        content={
          <>
            <TextSpan apparence="s3">
              <TextSpan apparence="p3">M1:</TextSpan>
              {"  "}
              {`${floatToStringExtendDot(
                data?.main1Power,
                1
              )} kw`}
            </TextSpan>
            <br />
            <TextSpan apparence="s3">
              <TextSpan apparence="p3">M2:</TextSpan>
              {"  "}
              {`${floatToStringExtendDot(
                data?.main2Power,
                1
              )} kw`}
            </TextSpan>
            <br />
            <TextSpan apparence="s3">
              <TextSpan apparence="p3">AUX1:</TextSpan>
              {"  "}
              {`${floatToStringExtendDot(
                (data?.aux1Power),
                1
              )} kw`}
            </TextSpan>
            <br />
            <TextSpan apparence="s3">
              <TextSpan apparence="p3">AUX2:</TextSpan>
              {"  "}
              {`${floatToStringExtendDot(
                (data?.aux2Power),
                1
              )} kw`}
            </TextSpan>
          </>
        }
      >
        <TextSpan apparence="s2" className="ml-2">
          {floatToStringExtendDot(
            (data?.main1Power || 0) +
            (data?.main2Power || 0) +
            (data?.aux1Power || 0) +
            (data?.aux2Power || 0), 1
          )}{" "}
          kw
        </TextSpan>
      </Tooltip>
    </>
  }


  const getPower = (index) => {
    const power = itemHistoryConsume[POSITION_DATA_CONSUME.LIST_POWER][index];
    if (isValueValid(power))
      return power;

    const max = routeConsumption
      ?.find(x => x[POSITION_DATA_CONSUME.DATE] > itemHistoryConsume[POSITION_DATA_CONSUME.DATE] &&
        x[POSITION_DATA_CONSUME.DATE] < (itemHistoryConsume[POSITION_DATA_CONSUME.DATE] + 600) &&
        x[POSITION_DATA_CONSUME.LIST_POWER]?.length &&
        isValueValid(x[POSITION_DATA_CONSUME.LIST_POWER][index]))

    const min = routeConsumption
      ?.find(x => x[POSITION_DATA_CONSUME.DATE] < itemHistoryConsume[POSITION_DATA_CONSUME.DATE] &&
        x[POSITION_DATA_CONSUME.DATE] > (itemHistoryConsume[POSITION_DATA_CONSUME.DATE] - 600) &&
        x[POSITION_DATA_CONSUME.LIST_POWER]?.length &&
        isValueValid(x[POSITION_DATA_CONSUME.LIST_POWER][index]))


    if (!isValueValid(max) && !isValueValid(min)) return undefined;
    if (!isValueValid(max)) return min[POSITION_DATA_CONSUME.LIST_POWER][index];
    if (!isValueValid(min)) return max[POSITION_DATA_CONSUME.LIST_POWER][index];

    return (max[POSITION_DATA_CONSUME.LIST_POWER][index] + min[POSITION_DATA_CONSUME.LIST_POWER][index]) / 2;
  }

  const sumAllPowers = itemHistoryConsume[POSITION_DATA_CONSUME.LIST_POWER]?.reduce((a, b, i) => a + (getPower(i) ?? 0), 0) || 0;

  return <>
    <Tooltip
      key={"power"}
      eventListener="#scrollPlacementId"
      className="inline-block"
      trigger="hint"
      placement={"top"}
      content={
        <>
          <ColFlex>
            {routeConsumptionSensors?.power?.map((sensor, i) => <>
              <TextSpan apparence="s3" key={`aZz-${i}`}>
                <TextSpan apparence="p3">{`${sensor}:`}</TextSpan>
                {"  "}
                {`${floatToStringExtendDot(
                  (getPower(i) ?? 0),
                  2
                )} kw/h`}
              </TextSpan>
            </>)}
          </ColFlex>
        </>
      }
    >
      <TextSpan apparence="s2" className="ml-2">
        {floatToStringExtendDot(sumAllPowers,1)}{" "}
        kw/h
      </TextSpan>
    </Tooltip>
  </>
}

const mapStateToProps = (state) => ({
  itemHistoryConsume: state.fleet.itemHistoryConsume,
  routeConsumptionSensors: state.fleet.routeConsumptionSensors,
  routeConsumption: state.fleet.routeConsumption,
});

export default connect(
  mapStateToProps,
  undefined
)(PowerData);
