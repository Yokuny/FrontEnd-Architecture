import { Row } from "@paljs/ui";
import { getDistance } from "geolib";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { TextSpan } from "../../../../../components";
import {
  floatToStringExtendDot,
  isValueValid,
} from "../../../../../components/Utils";
import { POSITION_DATA_CONSUME } from "../../../Consume/Constants";
import { ContentDiv } from "./styles";

const THIRTY_MINUTES_IN_MILLISECONDS = 1000 * 60 * 30;

export const WeatherTooltip = ({ gradientRef, dataList }) => {
  const intl = useIntl();
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    if (gradientRef.current) {
      gradientRef.current.on("mousemove", function (e) {
        if (isValueValid(e?.latlng?.lat) && isValueValid(e?.latlng?.lng)) {
          setItemDetails({
            mousePoint: e.containerPoint,
            data: sortByDistanceArray(dataList, e.latlng)[0],
          });
        }
      });
      gradientRef.current.on("mouseout", function (e) {
        setItemDetails(null);
      });
    }
  }, [dataList, gradientRef]);

  function sortByDistanceArray(coordinates, point) {
    const sorter = (a, b) =>
      getDistance({ lat: a.point[1], lng: a.point[2] }, point) -
      getDistance({ lat: b.point[1], lng: b.point[2] }, point);
    return coordinates?.sort(sorter);
  }

  const point = itemDetails?.data?.point;
  const weather = itemDetails?.data?.weather;

  function unixDateToIso(date) {
    return date * 1000;
  }

  function findValueByTime(point, time) {
    return time?.findIndex(
      (z) =>
        moment(z).diff(
          moment(unixDateToIso(point[POSITION_DATA_CONSUME.DATE]))
        ) <= THIRTY_MINUTES_IN_MILLISECONDS
    );
  }

  const time = findValueByTime(point, weather?.hourly.time);
  const options = [
    {
      title: intl.formatMessage({ id: "wave.height" }),
      value: weather?.hourly.wave_height[time],
      unit: weather?.hourly_units.wave_height,
    },
    {
      title: intl.formatMessage({ id: "wave.direction" }),
      value: weather?.hourly.wave_direction[time],
      unit: weather?.hourly_units.wave_direction,
    },
    {
      title: intl.formatMessage({ id: "wave.period" }),
      value: weather?.hourly.wave_period[time],
      unit: weather?.hourly_units.wave_period,
    },
    {
      title: intl.formatMessage({ id: "wind.wave.height" }),
      value: weather?.hourly.wind_wave_height[time],
      unit: weather?.hourly_units.wind_wave_height,
    },
    {
      title: intl.formatMessage({ id: "wind.wave.direction" }),
      value: weather?.hourly.wind_wave_direction[time],
      unit: weather?.hourly_units.wind_wave_direction,
    },
    {
      title: intl.formatMessage({ id: "wind.wave.period" }),
      value: weather?.hourly.wind_wave_period[time],
      unit: weather?.hourly_units.wind_wave_period,
    },
    {
      title: intl.formatMessage({ id: "wind.wave.peak.period" }),
      value: weather?.hourly.wind_wave_peak_period[time],
      unit: weather?.hourly_units.wind_wave_peak_period,
    },
    {
      title: intl.formatMessage({ id: "swell.wave.height" }),
      value: weather?.hourly.swell_wave_height[time],
      unit: weather?.hourly_units.swell_wave_height,
    },
    {
      title: intl.formatMessage({ id: "swell.wave.direction" }),
      value: weather?.hourly.swell_wave_direction[time],
      unit: weather?.hourly_units.swell_wave_direction,
    },
    {
      title: intl.formatMessage({ id: "swell.wave.period" }),
      value: weather?.hourly.swell_wave_period[time],
      unit: weather?.hourly_units.swell_wave_period,
    },
    {
      title: intl.formatMessage({ id: "swell.wave.peak.period" }),
      value: weather?.hourly.swell_wave_peak_period[time],
      unit: weather?.hourly_units.swell_wave_peak_period,
    },
    {
      title: intl.formatMessage({ id: "ocean.current.velocity" }),
      value: weather?.hourly?.ocean_current_velocity[time],
      unit: weather?.hourly_units.ocean_current_velocity,
    },
    {
      title: intl.formatMessage({ id: "ocean.current.direction" }),
      value: weather?.hourly.ocean_current_direction[time],
      unit: weather?.hourly_units.ocean_current_direction,
    },
  ];

  return (
    <>
      {!!itemDetails && (
        <ContentDiv x={itemDetails.mousePoint.x} y={itemDetails.mousePoint.y}>
          {options.map((option, index) => (
            <Row between="xs" className="mb-1" key={index}>
              <TextSpan apparence="p2" hint>
                {option.title}
              </TextSpan>
              <TextSpan apparence="s1" className="ml-4">
                {floatToStringExtendDot(option.value, 1)}
                <TextSpan apparence="p3">
                  {option.value !== null && option.unit}
                </TextSpan>
              </TextSpan>
            </Row>
          ))}
        </ContentDiv>
      )}
    </>
  );
};
