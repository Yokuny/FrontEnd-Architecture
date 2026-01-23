import { useState } from "react";
import { MapContainer, TileLayer, Marker, GeoJSON, useMapEvents, Polygon, Tooltip, Polyline } from "react-leaflet";
import L from "leaflet";
import { Container as MapWrapper } from "../Map/Container";
import { Fetch } from "../../../components";
import { nanoid } from "nanoid";
import PainelInput from "./PainelInput";
import NauticalNAVMap from "../Map/Nautical/NauticalNAV";
import { FormattedMessage } from "react-intl";
import { NMScale } from "../Map/Scale/NMScale";
import ShowCoordinates from "../Map/Coordinates/ShowCoordinates";
import EnterpriseLogoMap from "../Map/EnterpriseLogoMap";

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

const createIcon = (label, color) =>
  L.divIcon({
    html: `<div style="background:${color};color:#fff;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;font-size:12px;">${label}</div>`,
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

const startIcon = createIcon("A", "#2E8B57");
const endIcon = createIcon("B", "#B22222");

export default function Routering() {
  const [routeGeoJson, setRouteGeoJson] = useState();
  const [isRouting, setIsRouting] = useState(false);
  const [selectTarget, setSelectTarget] = useState(null); // 'origin' | 'destination' | null
  const [filterParams, setFilterParams] = useState({
    origin: null,
    destination: null,
  });

  const loadRouteFromHistory = (historyItem) => {
    if (historyItem) {
      const reconstructedGeoJson = {
        type: "FeatureCollection",
        features: historyItem.features,
      };
      setRouteGeoJson(reconstructedGeoJson);
    }
  };

  const handleMapClick = (latlng) => {
    if (selectTarget === "origin") {
      onChange("origin", { lat: latlng.lat, lng: latlng.lng });
      setSelectTarget(null);
    } else if (selectTarget === "destination") {
      onChange("destination", { lat: latlng.lat, lng: latlng.lng });
      setSelectTarget(null);
    }
  };

  const onChange = (field, value) => {
    setFilterParams((prev) => ({ ...prev, [field]: value }));
  };

  const resetRoute = () => {
    setFilterParams({
      origin: null,
      destination: null,
    });
    setRouteGeoJson(null);
  };

  const canRoute =
    filterParams.origin &&
    filterParams.destination &&
    filterParams.origin?.lat !== undefined &&
    filterParams.origin?.lng !== undefined &&
    filterParams.destination?.lat !== undefined &&
    filterParams.destination?.lng !== undefined;

  const calculateRoute = async () => {
    if (!canRoute) return;
    try {
      setIsRouting(true);

      let restrictions = null;
      if (filterParams.draftRestriction) {
        restrictions = {
          draft: filterParams.draftRestriction,
        };
      }
      if (filterParams.waveHeightRestriction) {
        restrictions = {
          ...(restrictions || {}),
          wave: filterParams.waveHeightRestriction,
        };
      }
      const geojson = await Fetch.post(
        "/route",
        {
          departure: {
            latitude: filterParams.origin.lat,
            longitude: filterParams.origin.lng,
          },
          arrival: {
            latitude: filterParams.destination.lat,
            longitude: filterParams.destination.lng,
          },
          restrictions,
        },
        { isV2: true }
      );
      setRouteGeoJson(geojson.data);
    } finally {
      setIsRouting(false);
    }
  };

  return (
    <MapWrapper style={{ position: "relative", height: "100vh" }}>
      <PainelInput
        filterParams={filterParams}
        onChange={onChange}
        calculateRoute={calculateRoute}
        canRoute={canRoute}
        isRouting={isRouting}
        setSelectTarget={setSelectTarget}
        selectTarget={selectTarget}
        resetRoute={resetRoute}
        routeGeoJson={routeGeoJson}
        loadRouteFromHistory={loadRouteFromHistory}
      />

      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={[-26.266658, -45.25586]}
        zoom={5}
        scrollWheelZoom
        zoomControl={false}
        worldCopyJump>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ClickHandler onSelect={handleMapClick} />
        {filterParams.origin && filterParams.origin?.lat !== undefined && filterParams.origin.lng !== undefined && (
          <Marker position={[filterParams.origin.lat, filterParams.origin.lng]} icon={startIcon} />
        )}
        {filterParams.destination &&
          filterParams.destination?.lat !== undefined &&
          filterParams.destination?.lng !== undefined && (
            <Marker position={[filterParams.destination.lat, filterParams.destination.lng]} icon={endIcon} />
          )}

        {/* {routeGeoJson && <GeoJSON
          data={routeGeoJson}
          key={nanoid(4)}
        />} */}

        {/* {!!routeGeoJson
            ?.features
            ?.find(f => f?.properties?.type === 'corridor')
            ?.geometry
            ?.coordinates?.length && <Polygon
          key={nanoid(4)}
          positions={routeGeoJson
            ?.features
            ?.find(f => f?.properties?.type === 'corridor')
            ?.geometry
            ?.coordinates?.[0][0]
            ?.map(coord => [coord[1], coord[0]])
          || []}
        />} */}

        {routeGeoJson?.features?.map((item, i) => {
          if (item?.geometry?.type === "MultiPolygon") {
            return item?.geometry?.coordinates?.map((coords, j) => (
              <Polygon
                key={`${nanoid(4)}-${i}-${j}`}
                positions={coords[0].map((coord) => [coord[1], coord[0]])}
                color={item?.properties?.type?.toLowerCase() === "danger" ? "#d52424" : "#DE33FF"}
                fillOpacity={0.4}
                weight={2}
              />
            ));
          }

          if (item?.geometry?.type === "MultiLineString") {
            return item?.geometry?.coordinates?.map((coords, j) => (
              <Polyline
                key={`${nanoid(4)}-${i}-${j}`}
                positions={coords.map((coord) => [coord[1], coord[0]])}
                color={["ConfinedWaters"].includes(item?.properties?.tag) ? "#d52424" : "#DE33FF"}
                weight={2}
                opacity={0.8}
                fillOpacity={0.4}
              />
            ));
          }

          if (item?.geometry?.type === "LineString") {
            return (
              <GeoJSON
                key={nanoid(4)}
                data={item}
                style={{
                  color: ["ConfinedWaters"].includes(item?.properties?.tag) ? "#d52424" : "#DE33FF",
                  weight: 2,
                  opacity: 0.8,
                  fillOpacity: 0.5,
                }}
              />
            );
          }

          if (item?.geometry?.type === "Point") {
            return (
              <Marker
                key={nanoid(4)}
                position={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
                icon={createIcon(item?.properties?.label || "P", item?.properties?.color || "#55AF15")}>
                <Tooltip>
                  {Object.entries(item?.properties || {}).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                  {item?.properties?.description && (
                    <div>
                      <strong>
                        <FormattedMessage id="description" />
                      </strong> {item?.properties?.description}
                    </div>
                  )}
                </Tooltip>
              </Marker>
            );
          }

          return null;
        })}
        <NauticalNAVMap />
        {/*
        <TileLayer
          url="https://aws-rnw-03.chartworld.com/api/visualization/tile/{x}/{y}/{z}"

        /> */}
        <NMScale metric position="bottomright" />
        <ShowCoordinates />
        <EnterpriseLogoMap />
      </MapContainer>
    </MapWrapper>
  );
}
