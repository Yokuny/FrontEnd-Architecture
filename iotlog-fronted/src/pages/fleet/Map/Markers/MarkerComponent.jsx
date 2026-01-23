import { DivIcon, Icon } from "leaflet";
import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import { TextSpan } from "../../../../components";
import ContentPopUp from "./ContentPopUp";
import { isPositionValid } from "../../../../components/Utils";
import { getStatusIcon } from "../../Status/Base";

const MarkerComponent = (props) => {
  const { machinePropsDetails, positionData, heading } = props;

  const theme = useTheme();

  if (!isPositionValid(positionData?.position)) {
    return <></>;
  }

  const getStatus = (statusMachine) => {
    const statusFinded = statusMachine?.find(x => x.idMachine === machinePropsDetails?.machine?.id)?.statusNavigation;
    if (!statusFinded) {
      return machinePropsDetails?.modelMachine?.color
    }

    return getStatusIcon(statusFinded, theme)?.bgColor;
  }

  const color = props?.isNavigationIndicator
  ? getStatus(props.statusMachine)
  : (machinePropsDetails?.modelMachine?.color || "currentColor")

  return (
    <>
      <Marker
        position={positionData?.position}
        icon={
          !!machinePropsDetails?.modelMachine?.icon?.url
            ? new Icon({
              iconUrl: machinePropsDetails?.modelMachine?.icon?.url,
              iconSize: [40, 40],
              className: "pin2",
            })
            : new DivIcon({
              className: "leaflet-div-icon-img",
              iconSize: [25, 25],
              html: `<svg aria-hidden="true" style="transform:rotate(${heading}deg)" focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${color}" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`,
            })
        }
      >

        <ContentPopUp
          positionData={positionData}
          machinePropsDetails={machinePropsDetails}
        />

        {((props.showName && machinePropsDetails?.machine?.name) ||
          (props.showCode && machinePropsDetails?.machine?.code)) && (
            <Tooltip
              direction="top"
              offset={[0, -7]}
              opacity={1}
              permanent
              position={positionData?.position}
            >
              <TextSpan apparence="s2">
                {!!props.showCode ? machinePropsDetails?.machine?.code : ''}
                {!!props.showName &&
                  `${!!props.showCode && machinePropsDetails?.machine?.code ? " - " : " "}${machinePropsDetails?.machine?.name
                  }`}
              </TextSpan>
            </Tooltip>
          )}
      </Marker>
    </>
  );
};

const mapStateToProps = (state) => ({
  showCode: state.map.showCode,
  showName: state.map.showName,
  isNavigationIndicator: state.map.isNavigationIndicator,
  statusMachine: state.fleet.statusMachine
});


export default connect(mapStateToProps, undefined)(MarkerComponent);
