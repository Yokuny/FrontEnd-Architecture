import React from "react";
import styled, { css } from "styled-components";
import { connect } from "react-redux";
import { Spinner } from "@paljs/ui";
import cryptoJs from "crypto-js";
import ListPoints from "../Wind/Markers/ListPoints";
import FenceWind from "../Wind/Fences/FenceWind";
import { useQueryMap } from "../Map/UrlQueryMap";
import { useQueryFrame } from "./useQueryFrame";
import PlatformWind from "../Wind/Plataforms/PlatformWind";

const _ad_d = (tokenDecode) => {
  try {
    return cryptoJs.AES.decrypt(
      tokenDecode.payload,
      `key@${tokenDecode.request}zdY`
    ).toString(cryptoJs.enc.Utf8);
  } catch {
    return "";
  }
};

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
      top: 95px !important;
      left: -50px !important;
      border-radius: 4px;
    }

    #embed-zoom {
      visibility: hidden;
    }

    section {
      visibility: hidden;
    }

    #mobile-ovr-select {
      z-index: 999;
      top: 50px !important;
      height: 40px !important;
      font-family: ${theme.fontFamilyPrimary};
      font-weight: bold;
      border-radius: 6px !important;
      line-height: 1.3 !important;
    }

    #mobile-ovr-select::before {
      width: 37px !important;
      height: 40px !important;
      border-radius: 6px !important;
      line-height: 1.8 !important;
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

    .plugin-content {
      top: 105px !important;
    }

    #progress-bar {
      z-index: 1001;
    }

    .timecode .main-timecode {
      z-index: 1001;
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

const WindMapFrame = (props) => {
  useScript("https://unpkg.com/leaflet@1.4.0/dist/leaflet.js");
  useScript("https://api.windy.com/assets/map-forecast/libBoot.js");

  const [isReady, setIsReady] = React.useState(false);

  const { center, zoom } = useQueryMap();
  const { nauticalChart, viewFence, viewPlatform, idEnterprise } =
    useQueryFrame();

  React.useEffect(() => {
    initializeMap();
    return () => {
      window._lmap = undefined;
      window.windyInit = undefined;
      window.windYInitialized = false;
    };
  }, []);

  React.useLayoutEffect(() => {
    if (isReady && window._lmap) window._lmap.invalidateSize();
  }, [props.isShowList, isReady]);

  const initializeMap = () => {
    const options = {
      key: _ad_d(props.token),
      lat: center[0],
      lon: center[1],
      zoom,
    };

    setTimeout(() => {
      if (window.windyInit) {
        window.windyInit(options, (windyAPI) => {
          const { picker, map, utils, broadcast, store } = windyAPI;

          function onMapClick(e) {
            const { lat, lng } = e.latlng;
            broadcast.emit("rqstOpen", "picker", { lat: lat, lon: lng });
          }
          map.on("click", onMapClick);

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
        <ContentDiv id="windy"></ContentDiv>
      </div>

      {!isReady ? (
        <Spinner size="Medium" />
      ) : (
        <>
          <ListPoints machines={props.machines} />
          {viewFence && <FenceWind idEnterprise={idEnterprise} />}
          {viewPlatform && <PlatformWind idEnterprise={idEnterprise} />}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  isShowList: state.fleet.isShowList,
});

export default connect(mapStateToProps, undefined)(WindMapFrame);
