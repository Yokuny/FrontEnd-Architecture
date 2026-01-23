import { DivIcon } from "leaflet";
import React from "react";
import { Marker, useMap } from "react-leaflet";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import { Fetch, SpinnerFull } from "../../../components";
import { angle360, getLatLonNormalize } from "../../../components/Utils";
import GradientRoute from "../../fleet/Map/ShowRoute/GradientRoute";

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const VoyageRoute = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [dataPoints, setDataPoints] = React.useState([]);
  const [course, setCourse] = React.useState([]);
  const [centerMap, setCenterMap] = React.useState(false);
  const theme = useTheme();

  React.useLayoutEffect(() => {
    if (props.integrationVoyageSelect) {
      getHistoryPositions(props.integrationVoyageSelect);
    }
  }, [props.integrationVoyageSelect]);

  React.useLayoutEffect(() => {
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

  const getHistoryPositions = (integrationVoyageSelect) => {
    setDataPoints([]);
    setIsLoading(true);
    Fetch.get(
      `/voyageintegration/route?idVoyage=${integrationVoyageSelect.idVoyage}`
    )
      .then((response) => {
        if (response.data?.length) {
          setDataPoints(response.data)
          setCenterMap(true);
          setCourse(
            response.data.length > 1
              ? getAngleCourse(
                response.data[0].slice(1, 3),
                response.data[1].slice(1, 3)
              )
              : 0
          );

        } else {
          setDataPoints([])
        }

        setIsLoading(false);
      })
      .catch((e) => {
        setDataPoints([]);
        setIsLoading(false);
      });
  };

  if (!props.integrationVoyageSelect) return <></>;

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

  const getFilteredPoints = (dataPoints) => {
    if (props.kickVoyageFilter) {
      const departureUnix = parseInt(new Date(props.kickVoyageFilter.dateTimeDeparture).getTime() / 1000);
      const arrival = parseInt(new Date(props.kickVoyageFilter.dateTimeArrival).getTime() / 1000);
      return dataPoints?.filter(x => x[0] >= departureUnix && x[0] <= arrival)
    }
    return dataPoints;
  }

  const dataHistory = getFilteredPoints(dataPoints)

  const center = getCenter(dataHistory);

  return (
    <>
      {dataHistory?.length > 1 && (
        <>
          <Marker
            key={`g_tr_f_${props.integrationVoyageSelect?.id}`}
            position={getLatLonNormalize(dataHistory[0]?.slice(1, 3))}
            icon={
              new DivIcon({
                className: "leaflet-div-icon-img adjust-pin-start",
                iconSize: [25,25],
                html: `<svg style="background-color:${theme.colorSuccess500};display: flex;padding: 2px;border-radius: 50%;" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" class="eva eva-flag eva-animation eva-icon-hover-zoom" fill="#fff"><g data-name="Layer 2"><g data-name="flag"><polyline points="24 24 0 24 0 0" opacity="0"></polyline><path d="M19.27 4.68a1.79 1.79 0 0 0-1.6-.25 7.53 7.53 0 0 1-2.17.28 8.54 8.54 0 0 1-3.13-.78A10.15 10.15 0 0 0 8.5 3c-2.89 0-4 1-4.2 1.14a1 1 0 0 0-.3.72V20a1 1 0 0 0 2 0v-4.3a6.28 6.28 0 0 1 2.5-.41 8.54 8.54 0 0 1 3.13.78 10.15 10.15 0 0 0 3.87.93 7.66 7.66 0 0 0 3.5-.7 1.74 1.74 0 0 0 1-1.55V6.11a1.77 1.77 0 0 0-.73-1.43z"></path></g></g></svg>`
              })
            }
          />

          <Marker
            key={`g_tr_s_${props.integrationVoyageSelect?.id}`}
            position={getLatLonNormalize(
              dataHistory[dataHistory?.length - 1]?.slice(1, 3)
            )}
            icon={
              new DivIcon({
                className: "leaflet-div-icon-img adjust-pin-start",
                iconSize: [22,22],
                html: `<div style="background-color:${theme.colorPrimary500};display: flex;padding: 2px;border-radius: 50%;"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" class="eva eva-radio-button-on-outline eva-animation eva-icon-hover-zoom" fill="#fff"><g data-name="Layer 2"><g data-name="radio-button-on"><rect width="24" height="24" opacity="0"></rect><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z"></path></g></g></svg></div>`,
              })
            }
          />
        </>
      )}
      {centerMap && center && <ChangeView zoom={6} center={center} />}

      {!!dataHistory?.length && (
        <>
          <GradientRoute
            key={`g_travel_${props.integrationVoyageSelect?.idMachine}`}
            data={dataHistory}
            lastPosition={
              dataHistory[0].slice(1, 3)
            }
          />
        </>
      )}

      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  integrationVoyageSelect: state.voyage.integrationVoyageSelect,
  kickVoyageFilter: state.voyage.kickVoyageFilter,
});

export default connect(mapStateToProps, undefined)(VoyageRoute);
