import { EvaIcon } from "@paljs/ui/Icon";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { Tooltip } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { useTheme } from "styled-components";
import {
  setMachineDetailsSelected,
  setIsShowList,
  setTravelDetailsSelected,
  setFilterPortActivity,
} from "../../../actions";

const ButtonToogleSidebar = (props) => {
  const theme = useTheme();

  const onClose = () => {
    if (props.machineDetailsSelected) {
      props.setMachineDetailsSelected(undefined);
      const request = paramsQuery.get("request");
      if (request) {
        window.location.href = `${window.location.origin}/fleet-manager`;
      }
      return;
    }
    if (props.travelDetailsSelected) {
      props.setTravelDetailsSelected(undefined);
      const idVoyage = paramsQuery.get("idVoyage");
      if (idVoyage) {
        window.location.href = `${window.location.origin}/fleet-manager`;
      }
      return;
    }
    props.setIsShowList(false);
    props.setFilterPortActivity(undefined);
  };

  const onOpen = () => {
    props.setIsShowList(true);
  };

  let paramsQuery = new URL(window.location.href).searchParams;

  const isShowTravelOrMachineDetails = !!props.machineDetailsSelected || !!props.travelDetailsSelected;

  const getButtonStyle = (status) => ({
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
    background:
      status === "Danger" ? theme.colorDanger500 : status === "Info" ? theme.colorInfo500 : theme.backgroundBasicColor1,
    color: status === "Danger" || status === "Info" ? theme.textControlColor : theme.colorInfo500,
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: `0 6px 12px ${theme.shadowColor || "rgba(0, 0, 0, 0.15)"}`,
    },
  });

  return (
    <>
      <div id="openListMap" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {((!!props.isShowList && !isShowTravelOrMachineDetails) || isShowTravelOrMachineDetails) && (
          <Button size="Medium" status="Danger" style={getButtonStyle("Danger")} onClick={onClose}>
            <EvaIcon
              name="close-outline"
              options={{
                height: 20,
                width: 20,
                fill: theme.textControlColor,
              }}
            />
          </Button>
        )}

        {!props.isShowList && (
          <Tooltip
            className="toottip-open-right"
            trigger="hint"
            placement="right"
            content={<FormattedMessage id="open.list" />}
            eventListener="#openListMap">
            <Button size="Medium" status="Info" style={getButtonStyle("Info")} onClick={onOpen}>
              <EvaIcon
                name="menu-arrow-outline"
                options={{
                  height: 20,
                  width: 20,
                  animation: { hover: true, type: "pulse" },
                  fill: theme.textControlColor,
                }}
              />
            </Button>
          </Tooltip>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  travelDetailsSelected: state.fleet.travelDetailsSelected,
  isShowList: state.fleet.isShowList,
});

const mapDispatchToProps = (dispatch) => ({
  setMachineDetailsSelected: (machineDetails) => {
    dispatch(setMachineDetailsSelected(machineDetails));
  },
  setTravelDetailsSelected: (travel) => {
    dispatch(setTravelDetailsSelected(travel));
  },
  setIsShowList: (isShow) => {
    dispatch(setIsShowList(isShow));
  },
  setFilterPortActivity: (filter) => {
    dispatch(setFilterPortActivity(filter));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonToogleSidebar);
