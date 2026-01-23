import React from "react";
import { useTheme } from "styled-components";
import { nanoid } from "nanoid";
import {
  getArrayMax,
  getArrayMin,
} from "../../../../../components/Utils";
import GradientLegend from "./GradientLegend";
import { GradientShowLineData } from "./GradientShowLineData";
import GradientRouteComponent from "./GradientRouteComponent";
import { connect } from "react-redux";

const valueIsValid = (value) => {
  return value !== undefined && value !== null;
}

const GradientRoute = (props) => {
  const { data, isShowRoute, isShowWeatherRoute, forceUpdate } = props;
  const [_, setForceUpdate] = React.useState(0);

  const theme = useTheme();
  const gradientRef = React.useRef();

  React.useEffect(() => {
    setForceUpdate(prev => prev + 1);
  },[isShowWeatherRoute, forceUpdate])

  const dataList = data?.filter((x) =>
    valueIsValid(x[1]) &&
    valueIsValid(x[2]) &&
    valueIsValid(x[3]));

  const onlyValuesSpeeds = dataList?.map((x) => x[3]);

  const calcMax = onlyValuesSpeeds?.length ? getArrayMax(onlyValuesSpeeds) : 1;

  const min = onlyValuesSpeeds?.length ? getArrayMin(onlyValuesSpeeds) : 0;
  const max = calcMax < 1 ? 1 : calcMax;

  let pointsGradients = dataList?.map((x) => [x[1], x[2], x[3]]) || [];
  if (props.lastPosition?.length &&
    valueIsValid(props.lastPosition[0]) &&
    valueIsValid(props.lastPosition[1]) &&
    pointsGradients?.length) {
    pointsGradients = [
      [
        props.lastPosition[0],
        props.lastPosition[1],
        pointsGradients.slice(0)[0][2],
      ],
      ...(pointsGradients || []),
    ];
  }

  const idKey = nanoid(4);

  return (
    <>
      {isShowRoute &&
        <GradientRouteComponent
          ref={gradientRef}
          theme={theme}
          min={min > 0 ? min - min * 0.05 : min}
          max={max + max * 0.05}
          pointsGradients={pointsGradients}
          style={{ zIndex: 201 }}
          zIndex={201}
          isShowGradient={isShowRoute}
          key={idKey}
        />
      }
      <GradientLegend
        theme={theme}
        min={min}
        max={max}
        key={`${idKey}-l`}
      />
      <GradientShowLineData
        key={`${idKey}-g`}
        gradientRef={gradientRef}
        dataList={dataList}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  isShowRoute: state.map.isShowRoute,
  isShowWeatherRoute: state.map.isShowWeatherRoute,
  forceUpdate: state.map.forceUpdate,
});

export default connect(mapStateToProps)(GradientRoute);
