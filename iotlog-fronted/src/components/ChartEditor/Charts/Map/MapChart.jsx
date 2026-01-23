import React, { useState, useMemo, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Button, EvaIcon, Spinner } from "@paljs/ui";
import styled from "styled-components";
import { ContentChart } from "../../Utils";
import { FilterData } from "../../../FilterData";
import MarkerMap from "./MarkerMap";
import { getLatLonNormalize } from "../../../Utils";
import AjustSize from "./AjustSize";
import { useThemeSelected } from "../../../Hooks/Theme";
import { useIntl } from "react-intl";
import { connect } from "react-redux";

const ContentMap = styled.div`
  .leaflet-top .leaflet-control {
    margin-top: 10px;
  }
`;

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function GetZoom({ onChangeZoom }) {
  const mapEvents = useMapEvents({
    zoomend: () => {
      onChangeZoom(mapEvents.getZoom());
    },
  });

  return null;
}

const MapChart = ({
  dataValuesMap: { routers },
  data,
  headings,
  isLoadingFilter,
  isLoading,
  onApply,
  mapTheme,
  isFiltered,
  id
}) => {
  const intl = useIntl();
  const [zoomSelected, setZoomSelected] = useState();
  const [isKeepCenter, setIsKeepCenter] = useState(true);
  const [isShowSeaMark, setIsShowSeaMark] = useState(false);
  const { isDark } = useThemeSelected();

  const zoom = zoomSelected || (data?.zoomInit ?? 2);

  // Use useMemo to avoid recalculating on every render
  const { positionsValid, coordinatesValid, centerInit } = useMemo(() => {
    const positions = routers
      ?.filter((x) => x?.length && x[2] !== undefined && x[3] !== undefined)
      ?.map((x) => ({ value: [x[2], x[3]], date: new Date(x[1] * 1000) })) || [];

    const coordinates = positions.map((x) =>
      getLatLonNormalize(x.value, data?.sizeDecimals)
    );

    const center = coordinates?.length && coordinates.slice(-1)[0].length === 2
      ? coordinates.slice(-1)[0]
      : [-26.266658, -45.25586];

    return {
      positionsValid: positions,
      coordinatesValid: coordinates,
      centerInit: center
    };
  }, [routers, data?.sizeDecimals]);

  const optionsLayer = useMemo(() => [
    {
      value: "default",
      label: intl.formatMessage({ id: "default" }),
      atribuiton:
        'IoTLog &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
  ], [intl]);

  const url = useMemo(() => {
    const tile = optionsLayer?.find((x) => x.value === mapTheme);
    return tile?.url
      ? tile.url
      : isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : data?.typeMap?.url ?? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  }, [optionsLayer, mapTheme, isDark, data?.typeMap?.url]);

  const toggleKeepCenter = useCallback(() => setIsKeepCenter(prev => !prev), []);
  const toggleSeaMark = useCallback(() => setIsShowSeaMark(prev => !prev), []);

  const onChangeZoom = useCallback((z) => setZoomSelected(z), []);

  return (
    <ContentChart className="card-shadow" key={data.id}>
      <ContentMap className="map flex-row">
        {centerInit?.length === 2 && (
          <MapContainer
            style={{ width: "100%", height: "100%", borderRadius: "3px" }}
            center={centerInit}
            zoom={zoom}
            scrollWheelZoom={true}
            key={data.id}
          >
            {isKeepCenter && <ChangeView center={centerInit} zoom={zoom} />}
            <AjustSize coordinates={centerInit} />
            <GetZoom onChangeZoom={onChangeZoom} />
            <TileLayer
              attribution='&copy; IoTLog powered <a href="https://www.bykonz.com">Bykonz</a>'
              url={url}
            />
            {isShowSeaMark && (
              <TileLayer
                attribution='&copy; IoTLog powered <a href="https://www.bykonz.com">Bykonz</a>'
                url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
              />
            )}

            {!!positionsValid?.length && (
              <>
                {data?.machines?.map((item, i) => (
                  <MarkerMap
                    key={`mkr_map_${item?.machine?.value}_${i}`}
                    coordinate={getLatLonNormalize(
                      positionsValid.slice(-1)[0]?.value,
                      data?.sizeDecimals
                    )}
                    machine={item}
                    headTransform={
                      headings?.find(
                        (x) => x.idMachine === item?.machine?.value
                      )?.head - 45
                    }
                    lastDate={positionsValid[0].date}
                  />
                ))}
                <Polyline
                  key={`Poly_map_${id}`}
                  positions={coordinatesValid}
                  color={data?.machines[0]?.colorRoute || "red"}
                />
              </>
            )}
          </MapContainer>
        )}
      </ContentMap>

      <div style={{ position: "absolute", bottom: 5, left: 10, zIndex: 999 }}>
        <Button
          style={{ padding: 3 }}
          size="Tiny"
          status={isKeepCenter ? "Primary" : "Basic"}
          onClick={toggleKeepCenter}
        >
          <EvaIcon name={isKeepCenter ? "pin" : "pin-outline"} />
        </Button>
        <Button
          style={{ padding: 3 }}
          className="ml-2"
          size="Tiny"
          status={!isShowSeaMark ? "Basic" : "Success"}
          onClick={toggleSeaMark}
        >
          <EvaIcon name={isShowSeaMark ? "map" : "map-outline"} />
        </Button>
        <FilterData isLoading={isLoading} onApply={onApply}>
          <Button
            style={{ padding: 3 }}
            size="Tiny"
            className="ml-2"
            status={isFiltered ? "Primary" : "Basic"}
          >
            <EvaIcon name={isFiltered ? "funnel" : "funnel-outline"} />
          </Button>
        </FilterData>
      </div>
      {isLoadingFilter && <Spinner size="Small" status="Primary" />}
    </ContentChart>
  );
};

const mapStateToProps = (state) => ({
  mapTheme: state.map.mapTheme,
});

export default connect(mapStateToProps)(MapChart);
