import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { TextSpan } from "../../../../../components";
import { floatToStringExtendDot, isValueValid } from "../../../../../components/Utils";
import { POSITION_DATA_CONSUME } from "../../Constants";
import { Tooltip } from "@paljs/ui";

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

const ConsumptionData = (props) => {

  const { isShowData, data, itemHistoryConsume, routeConsumption, routeConsumptionSensors } = props;

  if (!isShowData)
    return <>
      <Tooltip
        key={"consume"}
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
                data?.main1Consume ? data?.main1Consume / 1000 : 0,
                3
              )} m³/h`}
            </TextSpan>
            <br />
            <TextSpan apparence="s3">
              <TextSpan apparence="p3">M2:</TextSpan>
              {"  "}
              {`${floatToStringExtendDot(
                data?.main2Consume ? data?.main2Consume / 1000 : 0,
                3
              )} m³/h`}
            </TextSpan>
          </>
        }
      >
        <TextSpan apparence="s2" className="ml-2">
          {`${floatToStringExtendDot(
            data?.main1Consume || data?.main2Consume ? ((data?.main1Consume ?? 0) + (data?.main2Consume ?? 0)) / 1000 : 0
          )} m³/h`}
        </TextSpan>
      </Tooltip>
      <TextSpan apparence="s2" className="ml-2">
        {`${floatToStringExtendDot(
          data?.main1Consume || data?.main2Consume ? (((data?.main1Consume ?? 0) + (data?.main2Consume ?? 0)) / 1000) * 24 : 0
        )} m³/`}<FormattedMessage id="day" />
      </TextSpan>
      <TextSpan apparence="s3" className="ml-2">
        <TextSpan apparence="p3">CO2:</TextSpan>
        {"  "}
        {`${floatToStringExtendDot(
          data?.main1Consume || data?.main2Consume ? ((data?.main1Consume ?? 0) + (data?.main2Consume ?? 0)) * 2.68 : 0,
          1
        )} Kg/h`}
      </TextSpan>
    </>


  const getConsume = (index) => {
    const consume = itemHistoryConsume[POSITION_DATA_CONSUME.LIST_CONSUME][index];
    if (isValueValid(consume))
      return consume;

    const max = routeConsumption
      ?.find(x => x[POSITION_DATA_CONSUME.DATE] > itemHistoryConsume[POSITION_DATA_CONSUME.DATE] &&
        x[POSITION_DATA_CONSUME.DATE] < (itemHistoryConsume[POSITION_DATA_CONSUME.DATE] + 600) &&
        x[POSITION_DATA_CONSUME.LIST_CONSUME]?.length &&
        isValueValid(x[POSITION_DATA_CONSUME.LIST_CONSUME][index]))

    const min = routeConsumption
      ?.find(x => x[POSITION_DATA_CONSUME.DATE] < itemHistoryConsume[POSITION_DATA_CONSUME.DATE] &&
        x[POSITION_DATA_CONSUME.DATE] > (itemHistoryConsume[POSITION_DATA_CONSUME.DATE] - 600) &&
        x[POSITION_DATA_CONSUME.LIST_CONSUME]?.length &&
        isValueValid(x[POSITION_DATA_CONSUME.LIST_CONSUME][index]))


    if (!isValueValid(max) && !isValueValid(min)) return undefined;
    if (!isValueValid(max)) return min[POSITION_DATA_CONSUME.LIST_CONSUME][index];
    if (!isValueValid(min)) return max[POSITION_DATA_CONSUME.LIST_CONSUME][index];

    return (max[POSITION_DATA_CONSUME.LIST_CONSUME][index] + min[POSITION_DATA_CONSUME.LIST_CONSUME][index]) / 2;
  }

  const sumAllConsumes = itemHistoryConsume[POSITION_DATA_CONSUME.LIST_CONSUME]?.reduce((a, b, i) => a + (getConsume(i) ?? 0), 0) || 0;

  return <>
    <Tooltip
      key={"consume"}
      eventListener="#scrollPlacementId"
      className="inline-block"
      trigger="hint"
      placement={"top"}
      content={
        <>
          <ColFlex>
            {routeConsumptionSensors?.consumption?.map((sensor, i) => <>
              <TextSpan apparence="s3" key={`axZ-${i}`}>
                <TextSpan apparence="p3">{`${sensor}:`}</TextSpan>
                {"  "}
                {`${floatToStringExtendDot(
                  (getConsume(i) ?? 0) / 1000,
                  3
                )} m³/h`}
              </TextSpan>
            </>)}
          </ColFlex>
        </>
      }
    >
      <TextSpan apparence="s2" className="ml-2">
        {`${floatToStringExtendDot(
          sumAllConsumes / 1000
        )} m³/h`}
      </TextSpan>
    </Tooltip>
    <TextSpan apparence="s2" className="ml-2">
      {`${floatToStringExtendDot(
        (sumAllConsumes / 1000) * 24
      )} m³/`}<FormattedMessage id="day" />
    </TextSpan>
    <TextSpan apparence="s3" className="ml-2">
      <TextSpan apparence="p3">CO2:</TextSpan>
      {"  "}
      {`${floatToStringExtendDot(
        ((sumAllConsumes) * 2.68) / 1000,
        2
      )} T/h`}
    </TextSpan>
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
)(ConsumptionData);
