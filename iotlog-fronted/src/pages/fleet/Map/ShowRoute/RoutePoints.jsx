import { DivIcon } from "leaflet";
import { Marker } from "react-leaflet";
import { useTheme } from "styled-components";
import { nanoid } from "nanoid";
import { angle360, isPositionValid } from "../../../../components/Utils";
import PopUpItemShowRouteDetails from "./PopUpItemShowRouteDetails";

export default function RoutePoints(props) {
  const {
    routeHistory,
    listSelectedPoints,
    isShowPoints,
    isShowSequencePoints,
  } = props;
  const theme = useTheme();


  const getAngleAllRest = (positionNow, i, list) => {
    const listOldNormalized = list[i - 1].slice(1, 3);
    return angle360(
      positionNow[0],
      positionNow[1],
      listOldNormalized[0],
      listOldNormalized[1]
    );
  };

  const getAngleFirst = (positionNow) => {
    const listFirstNormalized = routeHistory[0].slice(1, 3);
    return angle360(
      positionNow[0],
      positionNow[1],
      listFirstNormalized[0],
      listFirstNormalized[1]
    );
  };

  if (!isShowPoints && !listSelectedPoints?.length) {
    return <></>;
  }

  const totalHistory = routeHistory?.length;

  const renderMarker = (x, i, angle, positionNow, itemSelected) => {
    return (
      <>
        {isPositionValid(positionNow) && <Marker
          key={nanoid(5)}
          position={positionNow}
          icon={
            new DivIcon({
              className: "leaflet-div-icon-img",
              iconSize: itemSelected ? [20,20] : [18,18],
              html:
                i < totalHistory - 2
                  ? `<svg aria-hidden="true" style="
                   transform:rotate(${!angle ? -45 : angle - 45}deg)";
                   display: flex; border-radius: 50%;
                   focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${itemSelected
                    ? theme.colorPrimary600
                    : props.item?.modelMachine?.color || "currentColor"
                  }" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`
                  : `<div style="background-color:${theme.colorPrimary500};display: flex;padding: 2px;border-radius: 50%;"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" class="eva eva-radio-button-on-outline eva-animation eva-icon-hover-zoom" fill="#fff"><g data-name="Layer 2"><g data-name="radio-button-on"><rect width="24" height="24" opacity="0"></rect><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z"></path></g></g></svg></div>`,
            })
          }
        >
          <PopUpItemShowRouteDetails item={x} />
        </Marker>}
        {isShowSequencePoints &&
        isPositionValid(positionNow) &&
        (
          <Marker
            key={nanoid(5)}
            position={positionNow}
            icon={
              new DivIcon({
                className: "",
                iconSize: [24, 38],
                html: `<span style="color: #fff">${i + 2}</span>`,
              })
            }
          >
            <PopUpItemShowRouteDetails item={x} />
          </Marker>
        )}
      </>
    );
  };

  if (!isShowPoints && !!listSelectedPoints?.length) {
    return listSelectedPoints.map((x) => {
      const indexSelected = routeHistory
        ?.filter((y, i) => i > 0)
        ?.findIndex(
          (y) => y[0] === x[0]
        );

      if (indexSelected < 0) return null

      const positionNow = x?.slice(1, 3);

      const angle =
        indexSelected > 0
          ? getAngleAllRest(positionNow, indexSelected + 1, routeHistory)
          : getAngleFirst(positionNow);

      return renderMarker(
        routeHistory[indexSelected],
        indexSelected,
        angle,
        positionNow,
        true
      );
    }).filter(x => !!x);
  }

  return (
    <>
      {routeHistory
        ?.filter((x, i) => i > 0 && x[1] !== null && x[2] !== null)
        ?.map((x, i, list) => {
          const positionNow = x.slice(1, 3);

          const angle =
            i > 0
              ? getAngleAllRest(positionNow, i, list)
              : getAngleFirst(positionNow);

          const itemSelected = listSelectedPoints?.some(
            (y) => y[0] === x[0]
          );

          return renderMarker(x, i, angle, positionNow, itemSelected);
        })}
    </>
  );
}
