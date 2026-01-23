import React from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";
import { DivIcon } from "leaflet";
import { AISTrackSymbol } from "./Ais/AisTrackSymbol";
import ContentPopUp from "../Map/Markers/ContentPopUp";
import { TextSpan } from "../../../components";
import "./tooltip.css";
import { markerList } from "../Map/Markers/tooltiplayout";

const TrackSymbolMarker = (props) => {
  const { dataItem, machinePropsDetails, color } = props;

  const markerRef = React.useRef();
  const map = useMap();

  React.useEffect(() => {
    const aisDimensions = machinePropsDetails?.ais
      ? machinePropsDetails?.ais
      : machinePropsDetails.machine?.dataSheet?.aisDimensions;

    const instance = new AISTrackSymbol(
      {
        latitude: dataItem.coordinate[0],
        longitude: dataItem.coordinate[1],
        trueHeading: dataItem.heading,
        cog: dataItem.course,
        sog: dataItem.speed,
      },
      {
        shipStaticData: {
          color,
          type: 81,
          dimension: aisDimensions
            ? {
              A: aisDimensions.distanceToBow,
              B: aisDimensions.distanceToStern,
              C: aisDimensions.distanceToStarboard,
              D: aisDimensions.distanceToPortSide,
            }
            : {
              A: 120, // loa
              B: 30, // stern
              C: 21, // startboard
              D: 11, // port side
            },
          fixType: 1,
          dte: true,
        },
      }
    );

    instance.on("click", () => {
      if (markerRef.current) markerRef.current.openPopup();
    });

    instance.addTo(map);

    return () => {
      if (instance) map.removeLayer(instance);
    };
  }, []);


  React.useEffect(() => {
    if(markerRef.current){
      const existingIndex = markerList.findIndex(marker => marker.options.title === markerRef.current.options.title);
      if (existingIndex !== -1) {
        markerList[existingIndex] = markerRef.current;
      } else {
        markerList.push(markerRef.current);
      }
    }
  }, [markerRef])

  return (
    <>
      <Marker
        title={machinePropsDetails.machine.id}
        ref={markerRef}
        position={dataItem.coordinate}
        icon={new DivIcon({ className: "icon-no-show", iconSize: [0, 0] })}
      >
        <ContentPopUp
          positionData={{
            position: dataItem.coordinate,
            date: dataItem.date,
          }}
          machinePropsDetails={machinePropsDetails}
        />
        {((props.showName && machinePropsDetails?.machine?.name) ||
          (props.showCode && machinePropsDetails?.machine?.code)) && (
            <Tooltip
              className="custom-tooltip"
              direction="auto"
              offset={[0, -7]}
              opacity={1}
              permanent
              position={dataItem.coordinate}
            >
              <TextSpan apparence="s2">
                {!!props.showCode ? machinePropsDetails?.machine?.code : ""}
                {!!props.showName &&
                  `${
                    !!props.showCode && machinePropsDetails?.machine?.code
                    ? " - "
                    : " "
                  }${machinePropsDetails?.machine?.name}`}
              </TextSpan>
            </Tooltip>
          )}
      </Marker>
    </>
  );
};

export default TrackSymbolMarker;
