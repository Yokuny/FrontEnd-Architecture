import React from "react";
import styled, { css, useTheme } from "styled-components";
import { connect } from "react-redux";
import { Spinner } from "@paljs/ui";
import cryptoJs from "crypto-js";
import EnterpriseLogoMap from "../Map/EnterpriseLogoMap";
import ListPoints from "./Markers/ListPoints";
import OptionsWindMap from "./OptionsWindMap";
import ShowRoute from "./ShowRoute";
import ButtonToogleSidebar from "../Details/ButtonToogleSidebar";
import { useQueryMap } from "../Map/UrlQueryMap";
import LeafletNmScale from "./../Map/Scale/LeafletNmScale";
import { getPointsDetailsFleet } from "../../../actions";

const _ad_d = (tokenDecode) => {
  try {
    return cryptoJs.AES.decrypt(tokenDecode.payload, `key@${tokenDecode.request}zdY`).toString(cryptoJs.enc.Utf8);
  } catch {
    return "";
  }
};

const LeftButtonsContainer = styled.div`
  position: absolute;
  top: 5rem;
  left: ${(props) => (props.isShowList ? "calc(5rem + 320px)" : "5rem")};
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: ${(props) => props.theme.backgroundBasicColor1}dd;
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.borderBasicColor3 || props.theme.backgroundBasicColor3};
  transition: left 0.3s ease;

  @media (max-width: 768px) {
    padding: 8px;
    gap: 4px;
    left: ${(props) => (props.isShowList ? "calc(5rem + 280px)" : "5rem")};
  }
`;

const ContentDiv = styled.div`
  width: 100%;
  height: 100%;
  ${({ theme }) => css`
    .timecode {
      font-family: ${theme.fontFamilyPrimary} !important;
    }

    .closing-x {
      background-color: ${theme.textDangerColor} !important;
      color: #fff !important;
    }

    #embed-zoom {
      visibility: hidden;
    }

    section {
      visibility: hidden;
    }

    #mobile-ovr-select {
      z-index: 999;
    }

    .plugin-mobile-rhpane .plugin-content {
      margin-top: 5rem !important;
      border-radius: 4px;
    }

    .closing-x  {
      margin-top: 5rem !important;
    }

    #plugin-menu {
      z-index: 1000;
    }

    #layers-levels {
      z-index: 1001;
    }

    #bottom {
      z-index: 999;
    }

    #logo-wrapper {
      visibility: hidden;
    }

    .build-info {
      visibility: hidden;
    }

    a {
      text-decoration: none;
    }

    #plugin-menu .plugin-content::before {
      visibility: hidden;
    }

    #plugin-menu .plugin-content #layers-levels::before {
      visibility: hidden;
    }

    #plugin-menu .plugin-content #product-switch-mobile::before {
      visibility: hidden;
    }

    #progress-bar {
      z-index: 1001;
    }

    .timecode .main-timecode {
      z-index: 1001;
    }

    .leaflet-control-container {
      display: flex !important;
      z-index: 999;
    }

    .leaflet-container {
      font-family: ${theme.fontFamilyPrimary} !important;
    }

    .leaflet-control-scale-line:not(:first-child) {
      border-top: none !important;
      margin-top: 3px !important;
      border-bottom: 2px solid #2272b3 !important;
    }

    .leaflet-control-scale-line {
      border-left: 2px solid #2272b3 !important;
      border-bottom: 2px solid #2272b3 !important;
      border-right: 2px solid #2272b3 !important;
      color: rgb(34, 43, 69) !important;
    }

    .leaflet-control-scale {
      display: flex;
      flex-direction: column;
      align-items: end;
      bottom: 45px;
    }

    .leaflet-popup-content-wrapper {
      border-radius: 4px !important;
      min-width: 220px;
    }

    #mobile-ovr-select {
      z-index: 999;
      top: 170px !important;
      right: 20px !important;
      font-family: ${theme.fontFamilyPrimary};
      line-height: 1.3 !important;
      transform: none !important;
      padding: 0px !important;
      color: #fff !important;
      background-color: transparent !important;
      margin-top: 12px !important;
    }

    #mobile-ovr-select::before {
      width: 35px !important;
      height: 35px !important;
      border-radius: 0.25rem !important;
      line-height: 1.7 !important;
      background-color: ${theme.colorInfo500} !important;
      box-shadow: none !important;
      font-size: 21px !important;
    }

    #mobile-ovr-select span {
      display: none;
    }

    .play-pause {
      border-radius: 0.25rem !important;
      color: ${theme.colorInfo600} !important;
    }

    #windy .timecode .box {
      font-family: ${theme.fontFamilyPrimary};
    }

    .button-styled {
      letter-spacing: 0.4px;
      transition: none;
      --webkit-appearance: none;
      --moz-appearance: none;
      text-align: center;
      text-decoration: none;
      white-space: nowrap;
      vertical-align: middle;
      user-select: none;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      font-weight: 700;
      font-size: 0.625rem;
      line-height: 0.75rem;
      border-radius: 0.25rem;
      border-style: solid;
      border-width: 0.0625rem;
      text-transform: uppercase;
      padding: 0.3125rem 0.625rem;
      background-color: #3366ff;
      border-color: #3366ff;
      color: #ffffff;
    }
  `}
`;

const useScript = (url) => {
  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = url;
    // script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

const Wind = (props) => {
  useScript("https://unpkg.com/leaflet@1.4.0/dist/leaflet.js");
  useScript("https://api.windy.com/assets/map-forecast/libBoot.js");

  const [isReady, setIsReady] = React.useState(false);
  const theme = useTheme();

  const { center, zoom } = useQueryMap();

  React.useEffect(() => {
    let time = initializeMap();
    return () => {
      window._lmap = undefined;
      window.windyInit = undefined;
      window.windYInitialized = false;
      if (time) clearTimeout(time);
    };
  }, []);

  React.useEffect(() => {
    if (isReady && window._lmap) window._lmap.invalidateSize();
    if (props.machines?.length && !props.positions?.length && isReady) {
      const machineIds = props.machines.map((m) => m.machine?.id).filter(Boolean);
      if (machineIds.length) {
        props.getPointsDetailsFleet(machineIds);
      }
    }
  }, [props.isShowList, props.machines, isReady]);

  const initializeMap = () => {
    const options = {
      key: _ad_d(props.token),
      lat: center[0],
      lon: center[1],
      zoom,
    };

    return setTimeout(() => {
      if (window.windyInit) {
        window.windyInit(options, (windyAPI) => {
          const { picker, map, utils, broadcast, store } = windyAPI;

          function onMapClick(e) {
            const { lat, lng } = e.latlng;
            broadcast.emit("rqstOpen", "picker", { lat: lat, lon: lng });
          }
          map.on("click", onMapClick);
          const scaleControl = new LeafletNmScale({
            position: "bottomright",
            metric: true,
            nautical: true,
            imperial: false,
          });
          scaleControl.addTo(map);
          window._lmap = map;

          window.windYInitialized = true;
          setIsReady(true);
        });
      }
    }, 5000);
  };

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <ContentDiv id="windy" />

        <LeftButtonsContainer theme={theme} isShowList={props.isShowList}>
          <ButtonToogleSidebar />
        </LeftButtonsContainer>
      </div>

      {!isReady ? (
        <Spinner />
      ) : (
        <>
          <ListPoints machines={props.machines} />
          <ShowRoute />
          <OptionsWindMap />
        </>
      )}
      <EnterpriseLogoMap preferenceDark />
    </>
  );
};

const mapStateToProps = (state) => ({
  isShowList: state.fleet.isShowList,
  positions: state.fleet.positions,
});

const mapDispatchToProps = (dispatch) => ({
  getPointsDetailsFleet: (idMachines) => {
    dispatch(getPointsDetailsFleet(idMachines));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Wind);
