import { getDistance } from "geolib";
import moment from "moment/moment";
import momentTimezone from "moment-timezone";
import { nanoid } from "nanoid";
import { connect } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { DivIcon } from "leaflet";
import { POSITION_DATA_CONSUME } from "../../../Consume/Constants";
import WeatherGradientRouteComponent from "./WeatherGradientRoute";
import WeatherLegend from "./WeatherLegend";
import { WeatherTooltip } from "./WeatherTootip";
import { setForceUpdate } from '../../../../../actions/map.actions';
import RotatedMarker from "./WeatherDirectionalRoute";
import { Fetch } from "../../../../../components";

const ONE_HUNDRED_KILOMETERS_IN_METERS = 100 * 1000;
const THIRTY_MINUTES_IN_MILLISECONDS = 1000 * 60 * 30;

function WeatherRoute(props) {
  const { data, isShowWeatherRoute, isShowDirectionRoute } = props;
  const [dataApi, setDataApi] = useState([]);
  const [optionDirection, setOptionDirection] = useState("wave_direction");
  const [optionWeather, setOptionWeather] = useState("wave_height");
  const [color, setColor] = useState(
    JSON.parse(localStorage.getItem("color")) || {
      min: "#3FEDFF",
      med: "#A146FF",
      max: "#FF5832",
    }
  );
  const gradientRef = useRef();
  const isDataLoadRef = useRef(false);

  useEffect(() => {
    if ((isShowWeatherRoute || isShowDirectionRoute)
      && isDataLoadRef.current === false
      && !dataApi?.length
    ) {
      fetchData();
    }
  }, [
    isShowWeatherRoute,
    isShowDirectionRoute,
  ]);

  const getAllWeatherData = async (coords) => {
    const weatherData = await Promise.all(
      coords.map(async (group) => {
        const first = group[0];

        const weather = await getWeatherConditions(
          first[POSITION_DATA_CONSUME.LAT],
          first[POSITION_DATA_CONSUME.LON],
          moment(unixDateToIso(first[POSITION_DATA_CONSUME.DATE])).format(
            "YYYY-MM-DD"
          )
        );

        return group.map((point) => ({
          point,
          weather,
        }));
      })
    );

    return weatherData;
  };

  const fetchData = async () => {
    const groupPointsByDistance = groupPoitnsByDistance(
      data,
      ONE_HUNDRED_KILOMETERS_IN_METERS
    );

    const weatherData = await getAllWeatherData(groupPointsByDistance);
    setDataApi(weatherData.flat());
  };

  async function getWeatherConditions(latitude, longitude, date) {
    const timezone = momentTimezone.tz.guess()

    const query = [
      `latitude=${latitude}`,
      `longitude=${longitude}`,
      `start_date=${date}`,
      `end_date=${date}`,
      `timezone=${timezone}`,
    ]

    const response = await Fetch.get(`/weather/conditions?${query.join("&")}`, {
      isV2: true,
    })
    isDataLoadRef.current = true;
    return response.data;
  }

  function getPointsGradients(option) {
    return data?.map((x, y) => {
      const z =
        dataApi[y]?.weather?.hourly[option][
        dataApi[y]?.weather?.hourly.time.findIndex(
          (z) =>
            moment(z).diff(
              moment(unixDateToIso(x[POSITION_DATA_CONSUME.DATE]))
            ) <= THIRTY_MINUTES_IN_MILLISECONDS
        )
        ];

      return [
        x[POSITION_DATA_CONSUME.LAT],
        x[POSITION_DATA_CONSUME.LON],
        z || 0,
      ];
    });
  }

  function groupPoitnsByDistance(points, distance) {
    const groups = [];

    points.forEach(([time, lat, lon]) => {
      let addedToGroup = false;

      for (const group of groups) {
        const [groupLat, groupLon] = group[0].slice(1, 3);
        const pointsDistance = getDistance(
          { latitude: lat, longitude: lon },
          { latitude: groupLat, longitude: groupLon }
        );

        if (pointsDistance <= distance) {
          group.push([time, lat, lon]);
          addedToGroup = true;
          break;
        }
      }

      if (!addedToGroup) {
        groups.push([[time, lat, lon]]);
      }
    });

    return groups;
  }

  function unixDateToIso(date) {
    return date * 1000;
  }

  function handleChangeDirection(value) {
    setOptionDirection(value);
  }
  function handleChangeWeather(value) {
    setOptionWeather(value);
  }

  function handleChangeColor(type, color) {
    setColor((prev) => {
      const newColor = { ...prev, [type]: color };

      localStorage.setItem("color", JSON.stringify(newColor));

      return newColor;
    });
  }

  const points = getPointsGradients(optionWeather);
  const pointsDirection = getPointsGradients(optionDirection);

  const min = Math.min(...points.map((z) => z[2])) || 0;
  const max = Math.max(...points.map((z) => z[2])) || 1;

  props.setForceUpdate();

  return (
    <>
      {!!dataApi?.length && (
        <>
          {isShowWeatherRoute &&
            <WeatherGradientRouteComponent
              ref={gradientRef}
              pointsGradients={points}
              min={min === max ? 0 : min}
              max={max === min && max === 0 ? 1 : max}
              key={nanoid(5)}
              color={color}
              style={{ zIndex: 101 }}
            />
          }
          {isShowDirectionRoute &&
            pointsDirection.map((point, index) => (
              <RotatedMarker position={point} icon={
                new DivIcon({
                  html: `<svg viewBox="0 0 24 24"><g><g><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M5.23 10.64a1 1 0 0 0 1.41.13L11 7.14V19a1 1 0 0 0 2 0V7.14l4.36 3.63a1 1 0 1 0 1.28-1.54l-6-5-.15-.09-.13-.07a1 1 0 0 0-.72 0l-.13.07-.15.09-6 5a1 1 0 0 0-.13 1.41z"/></g></g></svg>`,
                  className: "popup-transparent",
                  iconSize: [30, 30], // Tamanho do ícone
                  iconAnchor: [5, -20], // Ponto de ancoragem
                })
              } rotationAngle={point[2]} />
            ))
          }

          <WeatherTooltip gradientRef={gradientRef} dataList={dataApi} key={optionWeather} />
        </>
      )}
      <WeatherLegend
        min={min}
        max={max}
        onChangeDirection={handleChangeDirection}
        onChangeWeather={handleChangeWeather}
        color={color}
        onChangeColor={handleChangeColor}
        optionDirection={optionDirection}
        optionWeather={optionWeather}
      />
    </>
  );
}

const mapStateToProps = (state) => ({
  isShowWeatherRoute: state.map.isShowWeatherRoute,
  isShowDirectionRoute: state.map.isShowDirectionRoute,
});

const mapDispatchToProps = (dispatch) => ({
  setForceUpdate: () =>
    dispatch(setForceUpdate()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WeatherRoute);
