import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Col,
  EvaIcon,
  Row
} from "@paljs/ui";
import { nanoid } from "nanoid";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { TileLayer, useMap } from "react-leaflet";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import {
  setIsColorStatusFleet,
  setMapTech,
  setMapTheme,
  setShowCode,
  setShowName,
  setShowNameFence,
} from "../../../actions";
import { Divide, LabelIcon, TextSpan } from "../../../components";
import { Wave } from "../../../components/Icons";
import Fences from "./Fences";
import Overlay from "../../../components/Overlay";
import TrackingService from "../../../services/TrackingService";
import NauticalNAVMap from "./Nautical/NauticalNAV";
import Platform from "./Platform";
// import NauticalChartWorld from "./Nautical/NauticalChartWorld";
import { setIsNavigationIndicator, setIsOperationIndicator } from "../../../actions/map.actions";
import ListBouys from "./Bouys/ListBouys";
import NauticalCMAP from "./Nautical/NauticalCMAP";
import NauticalCMAPDark from "./Nautical/NauticalCMAPDark";
import NauticalNavtor from "./Nautical/NauticalNavtor";

const Content = styled.div`
  .overlay-pane {
    top: 0px !important;
  }
`;

const OptionsMap = (props) => {
  const intl = useIntl();
  const map = useMap();
  const theme = useTheme();

  const getButtonStyle = (status = "Control", isActive = false) => ({
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
      isActive || status === "Primary"
        ? theme.colorPrimary500
        : status === "Info"
        ? theme.colorInfo500
        : theme.backgroundBasicColor1,
    color: isActive || status === "Primary" || status === "Info" ? theme.textControlColor : theme.colorInfo500,
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: `0 6px 12px ${theme.shadowColor || "rgba(0, 0, 0, 0.15)"}`,
    },
  });

  const [isShowFences, setIsShowFences] = React.useState(!!localStorage.getItem("fences_show"));
  const [isShowPlatform, setIsShowPlatform] = React.useState(!!localStorage.getItem("platform_show"));
  const [isShowBouys, setIsShowBouys] = React.useState(!!localStorage.getItem("bouys_show"));
  const [isShowVesselNearBouys, setIsShowVesselNearBouys] = React.useState(
    !!localStorage.getItem("vessel_near_buoys_show")
  );

  const [showNautical, setShowNautical] = React.useState({
    ecc: !!localStorage.getItem("nautical_ecc"),
    chart_world: !!localStorage.getItem("nautical_chart_world"),
    nav: !!localStorage.getItem("nautical_nav"),
    cmap: !!localStorage.getItem("nautical_cmap"),
    cmap_dark: !!localStorage.getItem("nautical_cmap_dark"),
    navtor: !!localStorage.getItem("nautical_navtor"),
  });

  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setIsReady(true);
    props.setShowName(localStorage.getItem("map_show_name") === "true");
  }, []);

  React.useEffect(() => {
    let time;
    if (props.isRegionActive) {
      time = setTimeout(() => {
        map.invalidateSize();
      }, 3000);
    }

    return () => {
      if (time) clearTimeout(time);
    };
  }, [props.isRegionActive]);

  React.useEffect(() => {
    if (isReady) map.invalidateSize();
  }, [props.isShowList, props.travelDetailsSelected, props.machineDetailsSelected]);

  const optionsLayer = [
    {
      value: "default",
      label: intl.formatMessage({ id: "default" }),
      atribuiton: 'IoTLog &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      value: "smoothdark",
      label: intl.formatMessage({ id: "smooth.dark" }),
      atribuiton:
        'IoTLog &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    },
    {
      value: "earth",
      label: intl.formatMessage({ id: "earth" }),
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      minZoom: 1,
      maxZoom: 17,
    },
    {
      value: "rivers",
      label: intl.formatMessage({ id: "rivers" }),
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
    },
    {
      value: "simple",
      label: intl.formatMessage({ id: "simple" }),
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png",
      attribution: `IoTLog &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`,
    },
    {
      value: "premium",
      label: "Premium",
      url: `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAP_TILER}`,
      atribuiton: "IoTLog &copy; Maptiler",
    },
  ];

  const tile = optionsLayer?.find((x) => x.value === props.mapTheme);

  const hasPermissionViewPlatform = props.items?.some((x) => x === "/view-platform-map");

  const hasPermissionNauticalCMap = props.items?.some((x) => x === "/nautical-cmap");

  const hasPermissionNauticalCMapDark = props.items?.some((x) => x === "/nautical-cmap-dark");

  const hasPermissionNauticalNavtor = props.items?.some((x) => x === "/nautical-navtor");

  const hasPermissionViewBouy = props.items?.some((x) => x === "/view-bouy-fleet");

  const hasPermissionViewVesselsNearBuoy = props.items?.some((x) => x === "/view-vessels-near-buoy");

  const hasPermissionStatusNavigation = props.items?.some((x) => x === "/status-navigation");

  const hasPermissionStatusOperation = props.items?.some((x) => x === "/status-operation");

  const getItem = (name) => {
    switch (name) {
      case "ecc":
        return "SHOW_NAUTICAL_CHART_ENC";
      case "nav":
        return "SHOW_NAUTICAL_CHART_NAV";
      case "chart_world":
        return "SHOW_NAUTICAL_CHART_WORLD";
      case "cmap":
        return "SHOW_NAUTICAL_CHART_CMAP";
      case "cmap_dark":
        return "SHOW_NAUTICAL_CHART_CMAP_DARK";
      default:
        return "SHOW_NAUTICAL";
    }
  };

  const onChangeViewNautical = (prop) => {
    const newNautical = { ...showNautical };
    if (!newNautical[prop]) {
      TrackingService.saveTracking({
        pathname: window.location.pathname,
        action: getItem(prop),
      });
    }

    const fields = Object.keys(newNautical)?.filter((x) => x !== prop);
    fields.forEach((x) => {
      newNautical[x] = false;
      localStorage.setItem(`nautical_${x}`, "");
    });
    newNautical[prop] = !newNautical[prop];
    localStorage.setItem(`nautical_${prop}`, newNautical[prop] ? "true" : "");
    setShowNautical(newNautical);
  };

  const onChangeShowPlatforms = () => {
    if (!isShowPlatform)
      TrackingService.saveTracking({
        pathname: window.location.pathname,
        action: "SHOW_ALL_PLATFORMS",
      });
    localStorage.setItem("platform_show", !isShowPlatform ? "true" : "");
    setIsShowPlatform(!isShowPlatform);
  };

  const onChangeShowBouys = () => {
    if (!isShowBouys)
      TrackingService.saveTracking({
        pathname: window.location.pathname,
        action: "SHOW_ALL_BOUYS",
      });
    localStorage.setItem("bouys_show", !isShowPlatform ? "true" : "");
    setIsShowBouys(!isShowBouys);
  };

  const onChangeShowFences = () => {
    if (!isShowFences)
      TrackingService.saveTracking({
        pathname: window.location.pathname,
        action: "SHOW_ALL_FENCES",
      });
    localStorage.setItem("fences_show", !isShowFences ? "true" : "");
    setIsShowFences(!isShowFences);
  };

  const onActiveWind = () => {
    TrackingService.saveTracking({
      pathname: window.location.pathname,
      action: "WIND_MAP",
    });
    props.setMapTech("weather");
  };

  return (
    <>
      {!!tile && (
        <TileLayer
          key={tile.value}
          attribution={tile.atribuiton}
          url={tile.url}
          minZoom={tile.minZoom}
          maxZoom={tile.maxZoom}
        />
      )}

      {isShowFences && <Fences />}
      {isShowPlatform && <Platform />}
      {isShowBouys && <ListBouys isShowVesselsNear={isShowVesselNearBouys} />}

      <Content>
        {!props.noShowWindy && (
          <div className="mb-2">
            <Button size="Medium" status="Control" style={getButtonStyle("Control")} onClick={() => onActiveWind()}>
              <Wave style={{ height: 20, width: 20, fill: theme.colorInfo500 }} />
            </Button>
          </div>
        )}

        <Overlay
          className="inline-block"
          trigger="click"
          placement="left"
          target={
            <Button size="Medium" status="Control" style={getButtonStyle("Control")}>
              <EvaIcon
                name="settings-outline"
                options={{
                  height: 20,
                  width: 20,
                  fill: theme.colorInfo500,
                }}
              />
            </Button>
          }>
          <Card style={{ marginBottom: 0, maxWidth: 280, borderRadius: "18px", padding: ".5rem .2rem" }}>
            <CardHeader>
              <TextSpan apparence="s1">
                <FormattedMessage id="options" />
              </TextSpan>
            </CardHeader>
            <CardBody style={{ padding: 0 }}>
              <Row style={{ margin: 0 }}>
                <Col breakPoint={{ md: 12 }} className="mt-1 mb-1">
                  <LabelIcon iconName="globe-2-outline" title={<FormattedMessage id="map" />} />
                </Col>
                <Row style={{ margin: 0 }} className="pl-2 pr-2 mb-2">
                  {optionsLayer.map((x, i) => (
                    <Col key={`opts-map-theme-${i}`} breakPoint={x.value === "weather" ? { md: 12 } : { md: 6 }}>
                      <Checkbox checked={props.mapTheme === x.value} onChange={() => props.setMapTheme(x.value)}>
                        <TextSpan apparence="s2">{x.label}</TextSpan>
                      </Checkbox>
                    </Col>
                  ))}
                </Row>

                <Divide style={{ width: "100%" }} />
                <div className="pl-2 mt-1 mb-2">
                  <LabelIcon iconName="layers-outline" title={<FormattedMessage id="details" />} />
                  {hasPermissionNauticalNavtor && (
                    <Col breakPoint={{ md: 12 }}>
                      <Checkbox checked={showNautical?.navtor} onChange={() => onChangeViewNautical("navtor")}>
                        <TextSpan apparence="s2">
                          <FormattedMessage id="nautical.chart" /> - Navtor
                        </TextSpan>
                      </Checkbox>
                    </Col>
                  )}
                  {hasPermissionNauticalCMap && (
                    <Col breakPoint={{ md: 12 }}>
                      <Checkbox checked={showNautical?.cmap} onChange={() => onChangeViewNautical("cmap")}>
                        <TextSpan apparence="s2">
                          <FormattedMessage id="nautical.chart" /> - C-MAP
                        </TextSpan>
                      </Checkbox>
                    </Col>
                  )}
                  {hasPermissionNauticalCMap && (
                    <Col breakPoint={{ md: 12 }}>
                      <Checkbox
                        checked={showNautical?.cmap_relief}
                        onChange={() => onChangeViewNautical("cmap_relief")}>
                        <TextSpan apparence="s2">
                          <FormattedMessage id="nautical.chart" /> - C-MAP Relief
                        </TextSpan>
                      </Checkbox>
                    </Col>
                  )}
                  {hasPermissionNauticalCMapDark && (
                    <Col breakPoint={{ md: 12 }}>
                      <Checkbox checked={showNautical?.cmap_dark} onChange={() => onChangeViewNautical("cmap_dark")}>
                        <TextSpan apparence="s2">
                          <FormattedMessage id="nautical.chart" /> - C-MAP Night
                        </TextSpan>
                      </Checkbox>
                    </Col>
                  )}
                  <Col breakPoint={{ md: 12 }}>
                    <Checkbox checked={showNautical?.nav} onChange={() => onChangeViewNautical("nav")}>
                      <TextSpan apparence="s2">
                        <FormattedMessage id="nautical.chart" /> - NAV
                      </TextSpan>
                    </Checkbox>
                  </Col>
                  {/* <Col breakPoint={{ md: 12 }}>
                    <Checkbox
                      checked={showNautical?.ecc}
                      onChange={() => onChangeViewNautical("ecc")}
                    >
                      <TextSpan apparence="s2">
                        <FormattedMessage id="nautical.chart" /> - Brasil
                      </TextSpan>
                    </Checkbox>
                  </Col> */}
                  <Col breakPoint={{ md: 12 }}>
                    <Checkbox checked={isShowFences} onChange={() => onChangeShowFences()}>
                      <TextSpan apparence="s2">
                        <FormattedMessage id="geofences" />
                      </TextSpan>
                    </Checkbox>
                  </Col>
                  {hasPermissionViewPlatform && (
                    <Col breakPoint={{ md: 12 }}>
                      <Checkbox checked={isShowPlatform} onChange={() => onChangeShowPlatforms()}>
                        <TextSpan apparence="s2">
                          <FormattedMessage id="platforms" />
                        </TextSpan>
                      </Checkbox>
                    </Col>
                  )}
                  {hasPermissionViewBouy && (
                    <>
                      <Col breakPoint={{ md: 12 }}>
                        <Checkbox checked={isShowBouys} onChange={() => onChangeShowBouys()}>
                          <TextSpan apparence="s2">
                            <FormattedMessage id="monobuoys" />
                          </TextSpan>
                        </Checkbox>
                      </Col>
                      {isShowBouys && hasPermissionViewVesselsNearBuoy && (
                        <Col breakPoint={{ md: 12 }}>
                          <Checkbox
                            checked={isShowVesselNearBouys}
                            onChange={() => setIsShowVesselNearBouys((prev) => !prev)}>
                            <TextSpan apparence="s2">
                              <FormattedMessage id="vessels.near.buoy" />
                            </TextSpan>
                          </Checkbox>
                        </Col>
                      )}
                    </>
                  )}
                </div>

                <Divide style={{ width: "100%" }} />
                <div className="pl-2 mt-1 mb-3">
                  <LabelIcon iconName="eye-outline" title={<FormattedMessage id="description" />} />
                  <Col breakPoint={{ md: 12 }}>
                    <Checkbox checked={props.showCode} onChange={() => props.setShowCode(!props.showCode)}>
                      <TextSpan apparence="s2">
                        <FormattedMessage id="code" />
                      </TextSpan>
                    </Checkbox>
                  </Col>
                  <Col breakPoint={{ md: 12 }}>
                    <Checkbox checked={props.showName} onChange={() => props.setShowName(!props.showName)}>
                      <TextSpan apparence="s2">
                        <FormattedMessage id="name" />
                      </TextSpan>
                    </Checkbox>
                  </Col>
                  <Col breakPoint={{ md: 12 }}>
                    <Checkbox
                      checked={props.showNameFence}
                      onChange={() => props.setShowNameFence(!props.showNameFence)}>
                      <TextSpan apparence="s2">
                        <FormattedMessage id="details.geofence" />
                      </TextSpan>
                    </Checkbox>
                  </Col>
                </div>
                <Divide style={{ width: "100%" }} />
                <div className="pl-2 mt-1 mb-2">
                  <LabelIcon iconName="pantone-outline" title={<FormattedMessage id="fleet" />} />
                  {hasPermissionStatusNavigation && (
                    <Col>
                      <Checkbox
                        checked={props.isNavigationIndicator}
                        onChange={() => props.setIsNavigationIndicator(!props.isNavigationIndicator)}>
                        <TextSpan apparence="s2">
                          <FormattedMessage id="view.status.navigation" />
                        </TextSpan>
                      </Checkbox>
                    </Col>
                  )}
                  {hasPermissionStatusOperation && (
                    <Col>
                      <Checkbox
                        checked={props.isOperationIndicator}
                        onChange={() => props.setIsOperationIndicator(!props.isOperationIndicator)}>
                        <TextSpan apparence="s2">
                          <FormattedMessage id="view.status.operation" />
                        </TextSpan>
                      </Checkbox>
                    </Col>
                  )}
                </div>
              </Row>
            </CardBody>
          </Card>
        </Overlay>
      </Content>
      {showNautical?.navtor && <NauticalNavtor key={nanoid(5)} />}
      {showNautical?.nav && <NauticalNAVMap key={nanoid(5)} />}
      {/* import NauticalECCMap from "./Nautical/NauticalECCMap";
      {showNautical?.ecc && <NauticalECCMap key={nanoid(5)} />} */}
      {hasPermissionNauticalCMapDark && showNautical?.cmap_dark && <NauticalCMAPDark key={nanoid(5)} />}
      {hasPermissionNauticalCMap && showNautical?.cmap && <NauticalCMAP key={nanoid(5)} />}
      {hasPermissionNauticalCMap && showNautical?.cmap_relief && <NauticalCMAP isRelief key={nanoid(5)} />}
    </>
  );
};

const mapStateToProps = (state) => ({
  showCode: state.map.showCode,
  showName: state.map.showName,
  showNameFence: state.map.showNameFence,
  mapTech: state.map.mapTech,
  isShowList: state.fleet.isShowList,
  mapTheme: state.map.mapTheme,
  items: state.menu.items,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  travelDetailsSelected: state.fleet.travelDetailsSelected,
  isColorStatusFleet: state.map.isColorStatusFleet,
  isNavigationIndicator: state.map.isNavigationIndicator,
  isOperationIndicator: state.map.isOperationIndicator,
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
  setMapTheme: (mapTheme) => {
    dispatch(setMapTheme(mapTheme));
  },
  setIsColorStatusFleet: (isColorStatusFleet) => {
    dispatch(setIsColorStatusFleet(isColorStatusFleet));
  },
  setIsNavigationIndicator: (isNavigationIndicator) => {
    dispatch(setIsNavigationIndicator(isNavigationIndicator));
  },
  setIsOperationIndicator: (isOperationIndicator) => {
    dispatch(setIsOperationIndicator(isOperationIndicator));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionsMap);
