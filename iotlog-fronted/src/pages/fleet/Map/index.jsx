import React from "react";
import { connect } from "react-redux";
import Wind from "../Wind";
import FullMap from "./FullMap";

const Map = (props) => {
  const map = localStorage.getItem("map_tech")
  return (
    <>
      {!!(props.mapTech === "weather" || map === "weather") ? (
        <Wind key="windy_map" />
      ) : (
        <FullMap key="fully_map" />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  mapTech: state.map.mapTech,
});

export default connect(mapStateToProps, undefined)(Map);
