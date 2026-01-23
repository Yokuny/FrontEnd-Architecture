import { connect } from "react-redux";
import { floatToStringExtendDot, isValueValid } from "../../../../../components/Utils";
import { POSITION_DATA_CONSUME } from "../../Constants";

const SpeedData = (props) => {

  const { isShowData, data, itemHistoryConsume, routeConsumption } = props;

  if (!isShowData)
    return `${floatToStringExtendDot(data?.speed, 1)} ${data?.unitySpeed ?? "kn"}`


  const getSpeed = () => {
    const speed = itemHistoryConsume[POSITION_DATA_CONSUME.SPEED];
    if (isValueValid(speed))
      return speed;

    const max = routeConsumption
      ?.find(x => x[POSITION_DATA_CONSUME.DATE] > itemHistoryConsume[POSITION_DATA_CONSUME.DATE] &&
        x[POSITION_DATA_CONSUME.DATE] < (itemHistoryConsume[POSITION_DATA_CONSUME.DATE] + 600) &&
        isValueValid(x[POSITION_DATA_CONSUME.SPEED]))

    const min = routeConsumption
      ?.find(x => x[POSITION_DATA_CONSUME.DATE] < itemHistoryConsume[POSITION_DATA_CONSUME.DATE] &&
        x[POSITION_DATA_CONSUME.DATE] > (itemHistoryConsume[POSITION_DATA_CONSUME.DATE] - 600) &&
        isValueValid(x[POSITION_DATA_CONSUME.SPEED]))


    if (!max && !min) return undefined;
    if (!max) return min[POSITION_DATA_CONSUME.SPEED];
    if (!min) return max[POSITION_DATA_CONSUME.SPEED];

    return (max[POSITION_DATA_CONSUME.SPEED] + min[POSITION_DATA_CONSUME.SPEED]) / 2;
  }


  return `${floatToStringExtendDot(getSpeed(), 1)} ${data?.unitySpeed ?? "kn"}`
}

const mapStateToProps = (state) => ({
  itemHistoryConsume: state.fleet.itemHistoryConsume,
  routeConsumptionSensors: state.fleet.routeConsumptionSensors,
  routeConsumption: state.fleet.routeConsumption,
});

export default connect(
  mapStateToProps,
  undefined
)(SpeedData);
