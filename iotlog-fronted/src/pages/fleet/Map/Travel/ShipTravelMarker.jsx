import { DivIcon } from "leaflet";
import { nanoid } from "nanoid";
import React from "react";
import { Marker } from "react-leaflet";
import { useTheme } from "styled-components";
import { Fetch, SpinnerFull } from "../../../../components";
import { angle360, getLatLonNormalize, isPositionValid } from "../../../../components/Utils";
import GradientRoute from "../ShowRoute/GradientRoute";
import EventsShipRoute from "../ShowRoute/TypeRoute/EventsShipRoute";
import { ChangeView } from "../Utils";

const ShipTravelMarker = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [dataHistory, setDataHistory] = React.useState([]);
  const [course, setCourse] = React.useState([]);
  const [centerMap, setCenterMap] = React.useState(false);
  const theme = useTheme();

  React.useEffect(() => {
    if (props.travelDetailsSelected) {
      getHistoryPositions(props.travelDetailsSelected);
    }
  }, [props.travelDetailsSelected]);

  React.useEffect(() => {
    let time;
    if (centerMap) {
      time = setTimeout(() => {
        setCenterMap(false);
      }, 1000);
    }
    return () => {
      if (time) clearTimeout(time);
    }
  }, [centerMap]);

  const getHistoryPositions = (itemSelectedToSearch) => {
    setDataHistory([]);
    if (!itemSelectedToSearch?.machine?.id) {
      return;
    }
    setIsLoading(true);
    Fetch.get(
      `/travel/fleet/historytravelposition?idMachine=${itemSelectedToSearch?.machine?.id}&idTravel=${itemSelectedToSearch?.id}`
    )
      .then((response) => {
        if (response.data?.length) {
          const latLonValid = response.data.filter((item) => item[1] !== null && item[2] !== null &&
          item[1] !== undefined && item[2] !== undefined
        );
          setDataHistory(latLonValid)
          setCenterMap(true);
          setCourse(
            latLonValid.length > 1
              ? getAngleCourse(
                latLonValid[0].slice(1, 3),
                latLonValid[1].slice(1, 3)
              )
              : 0
          );
        } else {
          setDataHistory([])
        }

        setIsLoading(false);

      })
      .catch((e) => {
        setDataHistory([]);
        setIsLoading(false);
      });
  };

  if (!props.travelDetailsSelected) return <></>;

  const getCenter = (route) => {
    if (!route?.length) return undefined;

    if (route.length > 4) {
      const half = parseInt(route?.length / 2);
      return getLatLonNormalize(route[half]?.slice(1, 3));
    }

    return getLatLonNormalize(route[0]?.slice(1, 3));
  };

  const getAngleCourse = (position1, position2) => {
    return angle360(position2[0], position2[1], position1[0], position1[1]);
  };

  const center = getCenter(dataHistory);

  return (
    <>
      {dataHistory?.length > 1 && (
        <>
          {isPositionValid(getLatLonNormalize(dataHistory[0]?.slice(1, 3))) &&
            <Marker
              key={`g_tr_f_${props.travelDetailsSelected?.machine?.id}`}
              position={getLatLonNormalize(dataHistory[0]?.slice(1, 3))}
              icon={
                new DivIcon({
                  className: !!props.travelDetailsSelected?.portPointEnd
                    ? "leaflet-div-icon-img adjust-pin-start"
                    : "leaflet-div-icon-img",
                  iconSize: [25, 25],
                  html: !!props.travelDetailsSelected?.portPointEnd
                    ? `<svg style="background-color:${theme.colorSuccess500};display: flex;padding: 2px;border-radius: 50%;" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" class="eva eva-flag eva-animation eva-icon-hover-zoom" fill="#fff"><g data-name="Layer 2"><g data-name="flag"><polyline points="24 24 0 24 0 0" opacity="0"></polyline><path d="M19.27 4.68a1.79 1.79 0 0 0-1.6-.25 7.53 7.53 0 0 1-2.17.28 8.54 8.54 0 0 1-3.13-.78A10.15 10.15 0 0 0 8.5 3c-2.89 0-4 1-4.2 1.14a1 1 0 0 0-.3.72V20a1 1 0 0 0 2 0v-4.3a6.28 6.28 0 0 1 2.5-.41 8.54 8.54 0 0 1 3.13.78 10.15 10.15 0 0 0 3.87.93 7.66 7.66 0 0 0 3.5-.7 1.74 1.74 0 0 0 1-1.55V6.11a1.77 1.77 0 0 0-.73-1.43z"></path></g></g></svg>`
                    : `<svg aria-hidden="true" style="transform:rotate(${course - 45
                    }deg)" focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${props.travelDetailsSelected?.modelMachine?.color ||
                    "currentColor"
                    }" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`,
                })
              }
            />}

          {isPositionValid(getLatLonNormalize(
            dataHistory[dataHistory?.length - 1]?.slice(1, 3)
          )) && <Marker
              key={`g_tr_s_${props.travelDetailsSelected?.machine?.id}`}
              position={getLatLonNormalize(
                dataHistory[dataHistory?.length - 1]?.slice(1, 3)
              )}
              icon={
                new DivIcon({
                  className: "leaflet-div-icon-img adjust-pin-start",
                  iconSize: [22, 22],
                  html: `<div style="background-color:${theme.colorPrimary500};display: flex;padding: 2px;border-radius: 50%;"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" class="eva eva-radio-button-on-outline eva-animation eva-icon-hover-zoom" fill="#fff"><g data-name="Layer 2"><g data-name="radio-button-on"><rect width="24" height="24" opacity="0"></rect><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z"></path></g></g></svg></div>`,
                })
              }
            />}
        </>
      )}
      {centerMap &&
      !!center?.length &&
      center.every(x => x !== null && x !== undefined) && <ChangeView zoom={6} center={center} />}

      {!!dataHistory?.length && (
        <>
          <GradientRoute
            key={`g_travel_${props.travelDetailsSelected?.machine?.id}`}
            data={dataHistory}
          />
        </>
      )}
      {props.eventTimelineSelect && (
        <EventsShipRoute
          key={nanoid(4)}
          eventTimelineSelect={props.eventTimelineSelect}
          routeHistory={dataHistory}
        />
      )}
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default ShipTravelMarker;
