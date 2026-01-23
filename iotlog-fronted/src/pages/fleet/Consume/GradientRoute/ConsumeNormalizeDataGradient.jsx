import React from "react";
import { useTheme } from "styled-components";
import { nanoid } from "nanoid";
import ConsumeLineGradientComponent from "./ConsumeLineGradientComponent";
import {
  getArrayMax,
  getArrayMin,
  getLatLonNormalize,
} from "../../../../components/Utils";
import LegendConsume from "./LegendConsume";
import { ShowLineConsume } from "./ShowLineConsume";

const ConsumeNormalizeDataGradient = (props) => {
  const { data } = props;

  const theme = useTheme();
  const gradientRef = React.useRef();

  const [showGradient, setShowGradient] = React.useState(true);

  const onlyValuesConsumes = data
    ?.filter((x) => x.consume)
    ?.map((x) => x?.consume?.value);

  const calcMax = onlyValuesConsumes?.length
    ? getArrayMax(onlyValuesConsumes)
    : 1;

  const min = onlyValuesConsumes?.length ? getArrayMin(onlyValuesConsumes) : 0;
  const max = calcMax < 1 ? 1 : calcMax;

  const speedPointsSorted = data
    ?.filter((x) => x.consume)
    ?.sort((a, b) => new Date(a.consume.date) - new Date(b.consume.date));

  const getProximityConsume = (date) => {
    const dateToCompareInUnixTime = new Date(date).getTime();
    return (
      speedPointsSorted?.find(
        (x) => new Date(x.date).getTime() >= dateToCompareInUnixTime
      )?.value || undefined
    );
  };

  const dataList = data
    ?.map((x) => {
      const latLonNormalized = getLatLonNormalize(x.position?.value);
      if (!latLonNormalized) return null;
      if (latLonNormalized.length !== 2) return null;
      if (
        isNaN(latLonNormalized[0])
        || isNaN(latLonNormalized[1])
      ) return null;
      return {
        lat: latLonNormalized[0],
        lng: latLonNormalized[1],
        consume:
          x?.consume?.value !== undefined
            ? x?.consume?.value
            : getProximityConsume(x?.dateBase),
        date: x.dateBase,
      };
    })
    ?.filter((x) => !!x && x.consume !== undefined);

  let pointsGradients = dataList?.map((x) => [x.lat, x.lng, x.consume]) || [];
  if (props.lastPosition?.length && pointsGradients?.length) {
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
      <ConsumeLineGradientComponent
        ref={gradientRef}
        theme={theme}
        min={min > 0 ? min - min * 0.05 : min}
        max={max + max * 0.05}
        pointsGradients={pointsGradients}
        style={{ zIndex: 201 }}
        zIndex={201}
        isShowGradient={showGradient}
        key={idKey}
      />
      <LegendConsume min={min} max={max} theme={theme} showGradient />
      <ShowLineConsume
        key={`${idKey}-g`}
        gradientRef={gradientRef}
        dataList={dataList}
      />
    </>
  );
};

export default ConsumeNormalizeDataGradient;
