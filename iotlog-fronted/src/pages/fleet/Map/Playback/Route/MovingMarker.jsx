
import { useEffect, useState } from "react";
import L, { DivIcon } from "leaflet";
//import "leaflet.marker-motion/src/MarkerMotion";
import "./MarkerMotion.js";
import { useMap } from "react-leaflet";
import { connect } from "react-redux";
import { setPausePlayback, setTimePlayback } from "../../../../../actions";

const MovingMarker = ({ route, color, isPlaying, speed, setStopPlayback, setTimePlayback }) => {
  const [marker, setMarker] = useState(null);

  const map = useMap();

  const icon = new DivIcon({
    className: "leaflet-div-icon-img",
    iconSize: [25, 25],
    html: `<svg aria-hidden="true" style="
             transform:rotate(-45deg)";
             display: flex; border-radius: 50%;
             focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${color || "currentColor"}" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`
  });

  useEffect(() => {
    if (marker) {
      if (isPlaying) {
        if (marker.isEnded()) {
          marker.reset();
        }
        marker.start();
      }
      else
        marker.pause();
    }
  }, [isPlaying])

  useEffect(() => {
    if (marker) {
      marker.setSpeed(speed);
    }
  }, [speed])

  useEffect(() => {
    const markerRef = L.markerMotion(route, speed, {
      icon,
      rotation: true,
      autoplay: false,
      loop: false
    }).addTo(map);

    markerRef.on('motion.end', () => {
      setStopPlayback();
    });
    markerRef.on('motion.segment', (e) => {
      setTimePlayback(route[e.index][2] * 1000)
    });

    setMarker(markerRef);

    return () => {
      map.removeLayer(markerRef);
    };
  }, [map]);

  return null;
};

const mapStateToProps = (state) => ({
  isPlaying: state.map.playback.isPlaying,
  speed: state.map.playback.speed,
});

const mapDispatchToProps = (dispatch) => ({
  setStopPlayback: () => {
    dispatch(setPausePlayback());
  },
    setTimePlayback: (time) => {
      dispatch(setTimePlayback(time));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(MovingMarker);