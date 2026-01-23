import { connect } from "react-redux";
import styled from "styled-components";
import { TextSpan } from "../../../../../components";
import { isValueValid } from "../../../../../components/Utils";
import { POSITION_DATA_CONSUME } from "../../Constants";
import { EvaIcon } from "@paljs/ui";

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;


const EnginesRunData = (props) => {

  const { isShowData, data, itemHistoryConsume, routeConsumption, routeConsumptionSensors } = props;

  if (!isShowData) {
    const statusMotor =
      [
        {
          code: "M1",
          status: itemHistoryConsume ? !!itemHistoryConsume?.main1Consume : !!data?.main1Consume,
        },
        {
          code: "M2",
          status: itemHistoryConsume ? !!itemHistoryConsume?.main2Consume : !!data?.main2Consume,
        },
        {
          code: "AUX1",
          status: itemHistoryConsume ? itemHistoryConsume?.aux1Run : data?.aux1Run,
        },
        {
          code: "AUX2",
          status: itemHistoryConsume ? itemHistoryConsume?.aux2Run : data?.aux2Run,
        },
      ];

    return <>
      {statusMotor?.some((x) => x.status) && (
        <RowFlex className="ml-1 mb-1">
          <EvaIcon
            name="settings-2-outline"
            className={`rotate`}
          />
          <TextSpan apparence="s3" className="ml-1">
            {statusMotor
              ?.filter((x) => x.status)
              ?.map((x) => x.code)
              .join(", ")}
          </TextSpan>
        </RowFlex>
      )}
    </>
  }

  const getStatus = (index) => {
    const status = itemHistoryConsume[POSITION_DATA_CONSUME.LIST_ENGINES_RUN][index];
    if (!!status)
      return !!status;

    const max = routeConsumption
      ?.find(x => x[POSITION_DATA_CONSUME.DATE] > itemHistoryConsume[POSITION_DATA_CONSUME.DATE] &&
        x[POSITION_DATA_CONSUME.DATE] < (itemHistoryConsume[POSITION_DATA_CONSUME.DATE] + 600) &&
        x[POSITION_DATA_CONSUME.LIST_ENGINES_RUN]?.length &&
        isValueValid(x[POSITION_DATA_CONSUME.LIST_ENGINES_RUN][index]))

    const min = routeConsumption
      ?.find(x => x[POSITION_DATA_CONSUME.DATE] < itemHistoryConsume[POSITION_DATA_CONSUME.DATE] &&
        x[POSITION_DATA_CONSUME.DATE] > (itemHistoryConsume[POSITION_DATA_CONSUME.DATE] - 600) &&
        x[POSITION_DATA_CONSUME.LIST_ENGINES_RUN]?.length &&
        isValueValid(x[POSITION_DATA_CONSUME.LIST_ENGINES_RUN][index]))


    if (!isValueValid(max) && !isValueValid(min)) return undefined;
    if (!isValueValid(max)) return !!min[POSITION_DATA_CONSUME.LIST_ENGINES_RUN][index];
    if (!isValueValid(min)) return !!max[POSITION_DATA_CONSUME.LIST_ENGINES_RUN][index];

    return !!max[POSITION_DATA_CONSUME.LIST_CONSUME][index] || !!min[POSITION_DATA_CONSUME.LIST_CONSUME][index];
  }

  const statusMotor = routeConsumptionSensors?.power?.map((x, i) =>
  ({
    code: x,
    status: getStatus(i)
  }));

  return <>
    {statusMotor?.some((x) => x.status) && (
      <RowFlex className="ml-1 mb-1">
        <EvaIcon
          name="settings-2-outline"
          className={`rotate`}
        />
        <TextSpan apparence="s3" className="ml-1">
          {statusMotor
            ?.filter((x) => x.status)
            ?.map((x) => x.code)
            .join(", ")}
        </TextSpan>
      </RowFlex>
    )}
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
)(EnginesRunData);
