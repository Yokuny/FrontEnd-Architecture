import { DivIcon } from "leaflet";
import React from "react";
import { Marker, useMap } from "react-leaflet";
import { connect } from "react-redux";
import { setItemHistoryConsume } from "../../../../actions";
import { angle360, isPositionValid, sortByDistanceArray } from "../../../../components/Utils";
import { POSITION_DATA_CONSUME } from "../Constants";

const MarkerConsume = (props) => {

  const { routeConsumption, machineConsumptionSelected, courses } = props;

  const [latLonMarker, setLatLonMarker] = React.useState({
    position: undefined,
    course: 0,
  });

  const map = useMap();

  React.useEffect(() => {
    window._MOVE_MOUSE_D = false;

    map.addEventListener("mousemove", (e) => {
      if (!window._MOVE_MOUSE_D || isNaN(e.latlng.lat) || isNaN(e.latlng.lng)) {
        return;
      }
      const distances = sortByDistanceArray(routeConsumption, e.latlng)
      const mostNear = distances[0];
      const firstCourse = routeConsumption?.find(x => x[POSITION_DATA_CONSUME.DATE] < mostNear[POSITION_DATA_CONSUME.DATE])
      if (mostNear?.length) {
        setLatLonMarker({
          position: { lat: mostNear[POSITION_DATA_CONSUME.LAT], lng: mostNear[POSITION_DATA_CONSUME.LON] },
          course: !!mostNear[POSITION_DATA_CONSUME.COURSE] || distances?.length <= 1
            ? mostNear[POSITION_DATA_CONSUME.COURSE]
            : getAngleCourse(
              mostNear.slice(POSITION_DATA_CONSUME.LAT, POSITION_DATA_CONSUME.LON + 1),
              firstCourse.slice(POSITION_DATA_CONSUME.LAT, POSITION_DATA_CONSUME.LON + 1),
            ),
        });
        props.setItemHistoryConsume(mostNear);
      }
    });
    return () => {
      window._MOVE_MOUSE_D = false;
      map.removeEventListener("mousemove");
      props.setItemHistoryConsume(undefined)
    };
  }, []);

  const getAngleCourse = (position1, position2) => {
    return angle360(position2[0], position2[1], position1[0], position1[1]);
  };

  const lastCourse = courses?.find(
    (x) => x.idMachine === machineConsumptionSelected?.machine?.id
  )?.course;

  return (
    <>
      {isPositionValid(latLonMarker?.position) ? (
        <Marker
          position={latLonMarker.position}
          eventHandlers={{
            click: e => {
              window._MOVE_MOUSE_D = !window._MOVE_MOUSE_D;
            }
          }}
          icon={
            new DivIcon({
              className: "leaflet-div-icon-img",
              iconSize: [25,25],
              html: `<svg aria-hidden="true" style="transform:rotate(${latLonMarker.course - 45
                }deg)" focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${machineConsumptionSelected?.modelMachine?.color || "currentColor"
                }" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`,
            })
          }
        />
      ) : (
        <Marker
          position={routeConsumption[routeConsumption?.length - 1]?.slice(POSITION_DATA_CONSUME.LAT, POSITION_DATA_CONSUME.LON + 1)}
          eventHandlers={{
            click: e => {
              window._MOVE_MOUSE_D = !window._MOVE_MOUSE_D;
            }
          }}
          icon={
            new DivIcon({
              className: "leaflet-div-icon-img",
              iconSize: [25,25],
              html: `<svg aria-hidden="true" style="transform:rotate(${lastCourse - 45
                }deg)" focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${props.machineConsumptionSelected?.modelMachine?.color || "currentColor"
                }" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`,
            })
          }
        />
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  machineConsumptionSelected: state.fleet.machineConsumptionSelected,
  courses: state.fleet.courses,
  routeConsumption: state.fleet.routeConsumption,
});

const mapDispatchToProps = (dispatch) => ({
  setItemHistoryConsume: (itemHistoryConsume) => {
    dispatch(setItemHistoryConsume(itemHistoryConsume));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarkerConsume);
