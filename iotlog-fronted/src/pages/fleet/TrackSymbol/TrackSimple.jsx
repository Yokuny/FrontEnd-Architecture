import React from 'react'
import { Marker, useMap } from "react-leaflet";
import { DivIcon } from 'leaflet';
import { AISTrackSymbol } from "./Ais/AisTrackSymbol";

const TrackSimple = (props) => {

  const { latitude,
    longitude,
    trueHeading,
    cog,
    sog,
    aisDimensions,
    color,
    size = 24,
    fullColor = false
  } = props;

  const markerRef = React.useRef();
  const map = useMap()

  React.useEffect(() => {

    const instance =
      new AISTrackSymbol({
        latitude,
        longitude,
        trueHeading,
        cog,
        sog,
      }, {
        shipStaticData: {
          color,
          fullColor,
          type: 81,
          dimension: aisDimensions ? {
            A: aisDimensions.distanceToBow,
            B: aisDimensions.distanceToStern,
            C: aisDimensions.distanceToStarboard,
            D: aisDimensions.distanceToPortSide
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
        size
      })

    instance.on("click", () => {
      if (markerRef.current)
        markerRef.current.openPopup();
    });

    instance.addTo(map);

    return () => {
      if (instance)
        map.removeLayer(instance);
    }
  }, [])


  return <>
    <Marker
      ref={markerRef}
      position={{
        lat: latitude,
        lng: longitude
      }}
      icon={new DivIcon({ className: "icon-no-show", iconSize: [0, 0], })}>
      {props.children}
    </Marker>
  </>;
};

export default TrackSimple;
