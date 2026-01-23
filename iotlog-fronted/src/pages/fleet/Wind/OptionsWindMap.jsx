import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Col,
  EvaIcon,
  Popover,
  Row,
} from "@paljs/ui";
import { nanoid } from "nanoid";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import {
  setMapTech,
  setShowCode,
  setShowName,
  setShowNameFence,
} from "../../../actions";
import { Divide, LabelIcon, TextSpan } from "../../../components";
import TrackingService from "../../../services/TrackingService";
import FenceWind from "./Fences/FenceWind";
import PlatformWind from "./Plataforms/PlatformWind";

const EvaIconSize = styled(EvaIcon)`
  height: 20px;
  width: 20px;
`;

const ButtonsContainer = styled.div`
  position: absolute;
  top: 5rem;
  right: 10px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: ${(props) => props.theme.backgroundBasicColor1}dd;
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.borderBasicColor3 || props.theme.backgroundBasicColor3};

  @media (max-width: 768px) {
    padding: 8px;
    gap: 4px;
  }
`;

const OptionsWindMap = (props) => {
  const [mapWeather, setMapWeather] = React.useState("weather");
  const [isReady, setIsReady] = React.useState(false);
  const [isShowFences, setIsShowFences] = React.useState(
    !!localStorage.getItem("fences_show")
  );
  const [isShowPlatform, setIsShowPlatform] = React.useState(
    !!localStorage.getItem("platform_show")
  );

  const theme = useTheme();

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

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  React.useEffect(() => {
    let time;
    if (!mapWeather) {
      window.L = {};
      time = setTimeout(() => {
        props.setMapTech("");
      }, 1000);
    }
    return () => {
      if (time) clearTimeout(time);
    }
  }, [mapWeather]);

  if (!isReady) {
    return <></>;
  }

  const onChangeShowPlatforms = () => {
    if (!isShowPlatform)
      TrackingService.saveTracking({
        pathname: window.location.pathname,
        action: "SHOW_ALL_PLATFORMS",
      });
    localStorage.setItem("platform_show", !isShowPlatform ? "true" : "");
    setIsShowPlatform(!isShowPlatform);
  };

  const onChangeShowFences = () => {
    if (!isShowFences)
      TrackingService.saveTracking({
        pathname: window.location.pathname,
        action: "SHOW_ALL_FENCES",
      });
    localStorage.setItem("fences_show", isShowFences ? "true" : "");
    setIsShowFences(!isShowFences);
  };

  const hasPermissionViewPlatform = props.items?.some(
    (x) => x === "/view-platform-map"
  );

  return (
    <>
      {isShowFences && <FenceWind key={nanoid()} />}
      {isShowPlatform && <PlatformWind />}
      <ButtonsContainer theme={theme}>
        <Button
          size="Medium"
          status="Control"
          style={getButtonStyle(false)}
          onClick={() => props.setMapTech("")}
        >
          <EvaIconSize name="map-outline" />
        </Button>
        
        <Popover
          trigger="click"
          placement="left"
          overlay={
            <>
              <Card style={{ marginTop: 0, marginBottom: 0, maxWidth: 280 }}>
                <CardHeader>
                  <TextSpan apparence="s1">
                    <FormattedMessage id="options" />
                  </TextSpan>
                </CardHeader>
                <CardBody style={{ padding: 0 }}>
                  <Row style={{ margin: 0 }}>
                    <div className="pl-2 mt-1 mb-2">
                      <LabelIcon
                        iconName="layers-outline"
                        title={<FormattedMessage id="details" />}
                      />
                      <Col breakPoint={{ md: 12 }}>
                        <Checkbox
                          checked={isShowFences}
                          onChange={() => onChangeShowFences()}
                        >
                          <TextSpan apparence="s2">
                            <FormattedMessage id="geofences" />
                          </TextSpan>
                        </Checkbox>
                      </Col>
                      {hasPermissionViewPlatform && (
                        <Col breakPoint={{ md: 12 }}>
                          <Checkbox
                            checked={isShowPlatform}
                            onChange={() => onChangeShowPlatforms()}
                          >
                            <TextSpan apparence="s2">
                              <FormattedMessage id="platforms" />
                            </TextSpan>
                          </Checkbox>
                        </Col>
                      )}
                    </div>

                    <Divide style={{ width: "100%" }} />
                    <div className="pl-2 mt-1 mb-3">
                      <LabelIcon
                        iconName="eye-outline"
                        title={<FormattedMessage id="description" />}
                      />
                      <Col breakPoint={{ md: 12 }}>
                        <Checkbox
                          checked={props.showCode}
                          onChange={() => props.setShowCode(!props.showCode)}
                        >
                          <TextSpan apparence="s2">
                            <FormattedMessage id="code" />
                          </TextSpan>
                        </Checkbox>
                      </Col>
                      <Col breakPoint={{ md: 12 }}>
                        <Checkbox
                          checked={props.showName}
                          onChange={() => props.setShowName(!props.showName)}
                        >
                          <TextSpan apparence="s2">
                            <FormattedMessage id="name" />
                          </TextSpan>
                        </Checkbox>
                      </Col>
                      <Col breakPoint={{ md: 12 }}>
                        <Checkbox
                          checked={props.showNameFence}
                          onChange={() =>
                            props.setShowNameFence(!props.showNameFence)
                          }
                        >
                          <TextSpan apparence="s2">
                            <FormattedMessage id="details.geofence" />
                          </TextSpan>
                        </Checkbox>
                      </Col>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </>
          }
        >
          <Button size="Medium" status="Control" style={getButtonStyle(false)}>
            <EvaIconSize name="settings-outline" />
          </Button>
        </Popover>
      </ButtonsContainer>
    </>
  );
};

const mapStateToProps = (state) => ({
  showCode: state.map.showCode,
  showName: state.map.showName,
  mapTech: state.map.mapTech,
  showNameFence: state.map.showNameFence,
  items: state.menu.items,
});

const mapDispatchToProps = (dispatch) => ({
  setShowCode: (show) => {
    dispatch(setShowCode(show));
  },
  setShowName: (show) => {
    dispatch(setShowName(show));
  },
  setMapTech: (mapTech) => {
    dispatch(setMapTech(mapTech));
  },
  setShowNameFence: (showNameFence) => {
    dispatch(setShowNameFence(showNameFence));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionsWindMap);
