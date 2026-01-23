import { Button, EvaIcon } from '@paljs/ui'
import React from "react";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import ListVessels from "./ListVessels";
import { resetStateFleet, setShowAISVessels } from "../../../actions";
import AISVessels from "./AISVessels";
import TrackingService from "../../../services/TrackingService";

function SearchThirdFleet(props) {
  const [isShowSearch, setIsShowSearch] = React.useState(false);
  const theme = useTheme();

  const { resetStateFleet } = props;

  const getButtonStyle = (status, isActive = false) => ({
    padding: 0,
    boxShadow: `0px 2px 8px ${theme.shadowColor || "rgba(0, 0, 0, 0.05)"}`,
    border: `1px solid ${theme.borderBasicColor3 || theme.backgroundBasicColor3}`,
    borderRadius: "0.4rem",
    height: "35px",
    minWidth: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    background:
      status === "Danger"
        ? theme.colorDanger500
        : status === "Primary" || isActive
        ? theme.colorPrimary500
        : theme.backgroundBasicColor1,
    color: status === "Danger" || status === "Primary" || isActive ? theme.textControlColor : theme.colorInfo500,
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: `0 6px 12px ${theme.shadowColor || "rgba(0, 0, 0, 0.15)"}`,
    },
  });

  const onClose = () => {
    resetStateFleet();
    setIsShowSearch(false);
  };

  React.useEffect(() => {
    if (!!props.isShowAIS) {
      saveTracking();
    }
  }, [props.isShowAIS]);

  const saveTracking = () => {
    TrackingService.saveTracking({
      pathfull: "/ais-global",
      pathname: "/ais-global",
      search: "",
    }).then(() => {});
  };

  const hasPermissionAIS = props.items?.some((x) => x === "/ais-global");

  if (!hasPermissionAIS) {
    return <></>;
  }

  return (
    <>
      {isShowSearch ? (
        <>
          <ListVessels />
          <Button size="Medium" status="Danger" style={getButtonStyle("Danger")} onClick={() => onClose()}>
            <EvaIcon
              name="close-outline"
              options={{
                height: 20,
                width: 20,
                fill: theme.textControlColor,
              }}
            />
          </Button>
        </>
      ) : (
        <Button size="Medium" status="Control" style={getButtonStyle("Control")} onClick={() => setIsShowSearch(true)}>
          <EvaIcon
            name="search-outline"
            options={{
              height: 20,
              width: 20,
              fill: theme.colorInfo500,
            }}
          />
        </Button>
      )}
      <Button
        size="Medium"
        style={getButtonStyle(props.isShowAIS ? "Primary" : "Control", props.isShowAIS)}
        status={props.isShowAIS ? "Primary" : "Control"}
        onClick={() => props.setShowAISVessels(!props.isShowAIS)}>
        AIS
      </Button>
      {props.isShowAIS && <AISVessels />}
    </>
  );
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
  isShowAIS: state.map.isShowAIS
});


const mapDispatchToProps = (dispatch) => ({
  resetStateFleet: () => {
    dispatch(resetStateFleet());
  },
  setShowAISVessels: (isShow) => {
    dispatch(setShowAISVessels(isShow));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchThirdFleet)
