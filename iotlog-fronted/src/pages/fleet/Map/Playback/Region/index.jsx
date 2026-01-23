import React from "react";
import { Button } from "@paljs/ui";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import { Route2 } from "../../../../../components/Icons";
import FleetRegion from "./FleetRegion";
import { setIsRegionPlayback } from "../../../../../actions";

function PlaybackRegion(props) {
  const theme = useTheme();
  const hasPermissionViewRoutePlayback = props.items?.some((x) => x === "/route-playback");

  const getButtonStyle = (isActive = false) => ({
    padding: 0,
    boxShadow: `0px 2px 8px ${theme.shadowColor || "rgba(0, 0, 0, 0.05)"}`,
    border: `1px solid ${theme.borderBasicColor3 || theme.backgroundBasicColor3}`,
    borderRadius: "0.4rem",
    height: "35px",
    width: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    background: isActive ? theme.colorInfo500 : theme.backgroundBasicColor1,
    color: isActive ? theme.textControlColor : theme.colorInfo500,
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: `0 6px 12px ${theme.shadowColor || "rgba(0, 0, 0, 0.15)"}`,
    },
  });

  return (
    <>
      {hasPermissionViewRoutePlayback && (
        <>
          <Button
            size="Medium"
            status={props.isPlaybackRegion ? "Info" : "Control"}
            style={getButtonStyle(props.isPlaybackRegion)}
            onClick={(e) => props.setIsRegionPlayback(!props.isPlaybackRegion)}>
            <Route2
              style={{
                height: 20,
                width: 20,
                fill: props.isPlaybackRegion ? theme.textControlColor : theme.colorInfo500,
              }}
            />
          </Button>
          <FleetRegion />
        </>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  isPlaybackRegion: state.map.isPlaybackRegion,
  items: state.menu.items,
});

const mapDispatchToProps = (dispatch) => ({
  setIsRegionPlayback: (isPlaybackRegion) => {
    dispatch(setIsRegionPlayback(isPlaybackRegion));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackRegion);
