import React from "react";
import { MapContainer, FeatureGroup, TileLayer, Polygon } from "react-leaflet";
import L from "leaflet";
import LayersMap from "./LayersMap";
import EditControl from "./EditControl";
import { NMScale } from "../../fleet/Map/Scale/NMScale";
import ShowCoordinates from "../../fleet/Map/Coordinates/ShowCoordinates";
import PolylineMeasure from "../../fleet/Map/Measure";
import { useThemeSelected } from "../../../components/Hooks/Theme";
import { ChangeView } from "../../fleet/Map/Utils";
import { circleToPolygon } from "./Utils";

const CENTER_DEFAULT = [-26.06093, -36.532229]

export default function MapPolygon({
  onChangeMap,
  color = "",
  dataInitial = undefined,
  fenceReference = undefined,
}) {
  const [draw, setDraw] = React.useState({
    polygon: true,
    circle: true,
  });
  const [center, setCenter] = React.useState()

  const themeSelected = useThemeSelected();
  const editMapRef = React.useRef();

  React.useLayoutEffect(() => {
    if (dataInitial) {
      onMountData(dataInitial);
    }
  }, [dataInitial])

  React.useLayoutEffect(() => {
    if (color) {
      updateColor();
    }
  }, [color])

  const onMountData = (dataInitial) => {
    clearPointersOlds();

    let coordinates = [];
    if (dataInitial.location?.properties?.radius === undefined ||
      dataInitial.location?.properties?.radius === null) {
      coordinates = dataInitial
        ?.location
        ?.coordinates[0]
        ?.filter(x => x.length === 2)?.map((x) => [x[1], x[0]])
      const polygon = new L.polygon(
        [
          coordinates
        ],
        {
          color: color,
        }
      )
      editMapRef.current.addLayer(polygon);
    } else {
      coordinates = [dataInitial
        ?.location
        ?.geometry
        ?.coordinates[1],
      dataInitial
        ?.location
        ?.geometry
        ?.coordinates[0]
      ]
      const circle = new L.Circle(
        coordinates,
        {
          radius: dataInitial
            ?.location
            ?.properties
            ?.radius,
          color: color,
        }
      )
      editMapRef.current.addLayer(circle);
    }

    setDraw({
      polygon: false,
      circle: false,
    })

    setTimeout(() => {
      setCenter(coordinates[0]);
    }, 500)
  }

  const onEdit = (e) => {
    const keys = Object.keys(e.layers._layers)
    const layer = e.layers._layers[keys[0]]
    if (layer?._latlng) {
      const coordinates = circleToPolygon(layer._latlng, layer._mRadius, 60)
      onChangeMap({
        type: "Polygon",
        properties: {
          radius: layer._mRadius,
        },
        geometry: {
          type: "Point",
          coordinates: [layer._latlng.lng, layer._latlng.lat]
        },
        coordinates: [[...coordinates, coordinates[0]]]
      });

    } else {
      const coordinates = layer._latlngs[0].map(x => [x.lng, x.lat])
      onChangeMap({
        coordinates: [[...coordinates, coordinates[0]]],
        type: "Polygon",
      });
    }

  }

  const onNew = (e) => {
    setDraw({
      polygon: false,
      circle: false,
    })

    if (e.layerType === "polygon" && e.layer?._latlngs?.length) {
      const coordinates = e.layer._latlngs[0].map(x => [x.lng, x.lat])
      onChangeMap({
        coordinates: [[...coordinates, coordinates[0]]],
        type: "Polygon",
      });
    }
    else if (e.layerType === "circle" && e.layer?._latlng) {
      const coordinates = circleToPolygon(e.layer._latlng, e.layer._mRadius, 60)
      onChangeMap({
        type: "Polygon",
        properties: {
          radius: e.layer._mRadius,
        },
        geometry: {
          type: "Point",
          coordinates: [e.layer._latlng.lng, e.layer._latlng.lat]
        },
        coordinates: [[...coordinates, coordinates[0]]]
      });
    }
  }

  const onDelete = (e) => {
    setDraw({
      polygon: true,
      circle: true,
    })
    onChangeMap(undefined)
  }

  const updateColor = () => {
    const layers = editMapRef.current?._layers;
    if (layers && Object.keys(layers).length > 0) {
      Object.keys(layers).forEach((layerid, index) => {
        const layer = layers[layerid];
        editMapRef.current.removeLayer(layer);
        layer.options.color = color;
        editMapRef.current.addLayer(layer);
      });
    }
  };

  const clearPointersOlds = () => {
    const layers = editMapRef.current?._layers;
    if (layers && Object.keys(layers).length > 0) {
      Object.keys(layers).forEach((layerid, index) => {
        const layer = layers[layerid];
        editMapRef.current.removeLayer(layer);
      });
    }
  };

  return (
    <>
      <MapContainer
        style={{ height: 580, borderRadius: 4 }}
        center={CENTER_DEFAULT}
        zoom={5}
        zoomControl
        className="map_container"
        key="mapContentFence"
      >
        {!themeSelected.isDark
          ? <TileLayer
            attribution='&copy; IoTLog by <a href="https://www.bykonz.com">Bykonz</a>'
            url={
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          : <TileLayer
            attribution='IoTLog &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={
              "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            }
          />}
        {fenceReference && fenceReference?.location?.type === "Polygon" && (
          <Polygon
            key={`fence-${fenceReference?.value}`}
            color={fenceReference?.color}
            positions={fenceReference?.location?.coordinates[0]?.map(x => [x[1], x[0]])}
          />
        )}

        <LayersMap />

        <ShowCoordinates bottom={5} isThemeDark={themeSelected?.isDark} />
        <NMScale metric position="bottomright" />
        <PolylineMeasure top={150} />

        {!!center?.length && <ChangeView zoom={12} center={center} />}

        <FeatureGroup ref={editMapRef} key="ctRFt">
          <EditControl
            key="editCtr"
            position="topright"
            onEdited={onEdit}
            onCreated={onNew}
            onDeleted={onDelete}
            draw={{
              rectangle: false,
              polyline: false,
              circle: draw?.circle ? {
                shapeOptions: {
                  color: color ?? "red",
                },
                repeatMode: false
              } : false,
              circlemarker: false,
              marker: false,
              polygon: draw?.polygon
                ? {
                  allowIntersection: false,
                  shapeOptions: {
                    color: color ?? "red",
                    stroke: true,
                  },
                  showLength: true
                }
                : false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </>
  );
}
