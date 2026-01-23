import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { Button, EvaIcon, Tooltip } from "@paljs/ui";
import { setAssetVoyageSelected, setMachineCamerasSelected, setMachineConsume, setMachineContactSelected, setMachineCrew, setMachineDetailsSelected, setMachineInfoSelected, setRouteBack, setTimelineSelected } from "../../../../actions";
import { FormattedMessage } from "react-intl";
import { TextSpan } from "../../../../components";
import { useNavigate } from "react-router-dom";

const ButtonStyled = styled(Button)`
  ${({ theme }) => css`
    /* background-color: ${theme.backgroundBasicColor2}; */
  `}
`

const ContentMenuLeft = styled.div`
${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor2};
  `}
  position: absolute;
  left: -58px;
  top: -16px;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`

const ButtonsSider = (props) => {
  const { machineDetails } = props;

  const navigator = useNavigate()

  const onOpenCrew = () => {
    props.setMachineCrew(machineDetails)
  }

  const onOpenRouteBack = () => {
    props.setRouteBack(machineDetails)
  }

  const onOpenInfo = () => {
    props.setMachineInfoSelected(machineDetails)
  }

  const onOpenContacts = () => {
    props.setMachineContactSelected(machineDetails)
  }

  const onOpenCameras = () => {
    props.setMachineCamerasSelected(machineDetails)
  }

  const onOpenAssetVoyage = () => {
    props.setAssetVoyageSelected(machineDetails);
  }

  const onOpenPanel = () => {
    navigator(`/panel-default-view?idMachine=${machineDetails.machine.id}&name=${machineDetails.machine.name}`);
  }

  const hasPermissionViewConsumeDetails = props.items?.some(
    (x) => x === "/details-consume-fleet"
  );

  const hasPermissionViewCrew = props.items?.some(
    (x) => x === "/list-crew"
  );

  const hasPermissionViewRoutePlayback = props.items?.some(
    (x) => x === "/route-playback"
  );

  const hasPermissionViewPanel = props.items?.some(
    (x) => x === "/panel-default-view"
  );

  const hasPermissionVoyages = props.items?.some(
    (x) => x === "/list-travel"
  );

  return (<>
    <ContentMenuLeft
      className="p-2"
    >
      <Tooltip
        className="toottip-open-right"
        trigger="hint"
        placement="left"
        content={<FormattedMessage id="open.info" />}
        eventListener="#openInfoAsset"
      >
        <ButtonStyled size="Tiny"
          status={props.machineInfoSelected ? "Primary" : "Basic"}
          onClick={(e) => {
            e.preventDefault();
            onOpenInfo();
          }}>
          <EvaIcon
            name="info-outline"
          />
        </ButtonStyled>
      </Tooltip>
      <Tooltip
        className="toottip-open-right"
        trigger="hint"
        placement="left"
        content={<FormattedMessage id="contacts" />}
        eventListener="#openContacts"
      >
        <ButtonStyled size="Tiny" className="mt-2"
          status={props.machineContactSelected ? "Primary" : "Basic"}
          onClick={(e) => {
            e.preventDefault();
            onOpenContacts();
          }}>
          <EvaIcon
            name="phone-outline"
          />
        </ButtonStyled>
      </Tooltip>
      {hasPermissionViewCrew &&
        <Tooltip
          className="toottip-open-right"
          trigger="hint"
          placement="left"
          content={<FormattedMessage id="crew" />}
          eventListener="#openCrew"
        >
          <ButtonStyled size="Tiny" className="mt-2" status="Basic"
            onClick={(e) => {
              e.preventDefault();
              onOpenCrew();
            }}>
            <EvaIcon
              name="people-outline"
            />
          </ButtonStyled>
        </Tooltip>
      }

      {hasPermissionViewRoutePlayback &&
        <Tooltip
          className="toottip-open-right"
          trigger="hint"
          placement="left"
          content={<TextSpan>Route back</TextSpan>}
          eventListener="#openRouteBack"
        >
          <ButtonStyled size="Tiny" className="mt-2" status="Basic"
            onClick={(e) => {
              e.preventDefault();
              onOpenRouteBack();
            }}
          >
            <EvaIcon
              name="play-circle-outline"
            />
          </ButtonStyled>
        </Tooltip>}

      <Tooltip
        className="toottip-open-right"
        trigger="hint"
        placement="left"
        content={<TextSpan><FormattedMessage id="camera" /></TextSpan>}
        eventListener="#openCameras"
      >
        <ButtonStyled size="Tiny" className="mt-2" status={props.machineCamerasSelected ? "Primary" : "Basic"}
          onClick={(e) => {
            e.preventDefault();
            onOpenCameras();
          }}
        >
          <EvaIcon
            name="camera-outline"
          />
        </ButtonStyled>
      </Tooltip>

      {hasPermissionViewPanel &&
        <Tooltip
          className="toottip-open-right"
          trigger="hint"
          placement="left"
          content={<FormattedMessage id="panel" />}
          eventListener="#openPanel"
        >
          <ButtonStyled size="Tiny" className="mt-2" status="Basic"
            onClick={(e) => {
              e.preventDefault();
              onOpenPanel();
            }}
          >
            <EvaIcon
              name="wifi-outline"
            />
          </ButtonStyled>
        </Tooltip>}
      {hasPermissionVoyages &&
        <Tooltip
          className="toottip-open-right"
          trigger="hint"
          placement="left"
          content={<FormattedMessage id="travel" />}
          eventListener="#openVoyages"
        >
          <ButtonStyled size="Tiny" className="mt-2" status="Basic"
            onClick={(e) => {
              e.preventDefault();
              onOpenAssetVoyage();
            }}
          >
            <EvaIcon
              name="cube-outline"
            />
          </ButtonStyled>
        </Tooltip>}

    </ContentMenuLeft>
  </>
  )
}

const mapStateToProps = (state) => ({
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  machineInfoSelected: state.fleet.machineInfoSelected,
  machineContactSelected: state.fleet.machineContactSelected,
  machineCamerasSelected: state.fleet.machineCamerasSelected,
  items: state.menu.items,
});

const mapDispatchToProps = (dispatch) => ({
  setMachineDetailsSelected: (machineDetails) => {
    dispatch(setMachineDetailsSelected(machineDetails));
  },
  setTimelineSelected: (eventTimelineSelect) => {
    dispatch(setTimelineSelected(eventTimelineSelect))
  },
  setMachineConsume: (machineConsumptionSelected) => {
    dispatch(setMachineConsume(machineConsumptionSelected))
  },
  setMachineCrew: (machineCrew) => {
    dispatch(setMachineCrew(machineCrew));
  },
  setRouteBack: (routeBackSelected) => {
    dispatch(setRouteBack(routeBackSelected));
  },
  setMachineInfoSelected: (machineInfoSelected) => {
    dispatch(setMachineInfoSelected(machineInfoSelected))
  },
  setMachineContactSelected: (machineContactSelected) => {
    dispatch(setMachineContactSelected(machineContactSelected))
  },
  setMachineCamerasSelected: (machineCamerasSelected) => {
    dispatch(setMachineCamerasSelected(machineCamerasSelected))
  },
  setAssetVoyageSelected: (assetVoyageSelected) => {
    dispatch(setAssetVoyageSelected(assetVoyageSelected));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonsSider);
