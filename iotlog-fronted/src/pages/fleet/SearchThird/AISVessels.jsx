import React from 'react'
import ReactDOM from "react-dom";
import { GeoJSON, useMapEvents } from 'react-leaflet'
import  { Canvas, DivIcon, Popup, Marker } from 'leaflet'
import { Fetch, SpinnerFull } from '../../../components'
import CardDetailsVessel from './CardDetailsVessel'

Canvas.include({
  _updateMarker6Point: function (layer) {
      if (!this._drawing || layer._empty()) { return; }

      const p = layer._point;
      const ctx = this._ctx;
      const r = Math.max(Math.round(layer._radius), 1);

      this._drawnLayers[layer._leaflet_id] = layer;

      ctx.beginPath();
      ctx.moveTo(p.x + r     , p.y );
      ctx.lineTo(p.x + 0.43*r, p.y + 0.25 * r);
      ctx.lineTo(p.x + 0.50*r, p.y + 0.87 * r);
      ctx.lineTo(p.x         , p.y + 0.50 * r);
      ctx.lineTo(p.x - 0.50*r, p.y + 0.87 * r);
      ctx.lineTo(p.x - 0.43*r, p.y + 0.25 * r);
      ctx.lineTo(p.x -      r, p.y );
      ctx.lineTo(p.x - 0.43*r, p.y - 0.25 * r);
      ctx.lineTo(p.x - 0.50*r, p.y - 0.87 * r);
      ctx.lineTo(p.x         , p.y - 0.50 * r);
      ctx.lineTo(p.x + 0.50*r, p.y - 0.87 * r);
      ctx.lineTo(p.x + 0.43*r, p.y - 0.25 * r);
      ctx.closePath();
      this._fillStroke(ctx, layer);
  }
});

const Marker6Point = Marker.extend({
  _updatePath: function () {
      this._renderer._updateMarker6Point(this);
  }
});

function AISVessels(props) {

  const [featureGroup, setFeatureGroup] = React.useState()
  const [isLoading, setIsLoading] = React.useState(false)
  const [zoom, setZoom] = React.useState(4)
  const [featureGroupPolygon, setFeatureGroupPolygon] = React.useState()
  const [renders, setRenders] = React.useState()

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoom(mapEvents.getZoom())
      handleVesselsInBounds()
    },
    moveend: () => {
      handleVesselsInBounds()
    }
  });

  React.useEffect(() => {
    getData()
    return () => {
      setFeatureGroup(undefined)
      setFeatureGroupPolygon(undefined)
    }
  }, [])


  const getData = async () => {
    setIsLoading(true)

    try {
      const pointsPromise = Fetch.get(`/integrationthird/ais/vessels?asPolygon=false`)
      const polygonsPromise = Fetch.get(`/integrationthird/ais/vessels?asPolygon=true`)

      const point = await pointsPromise;
      const polygon = await polygonsPromise;

      setFeatureGroup(point.data);
      setFeatureGroupPolygon(polygon.data);
    }
    catch (error) {
    }
    finally {
      setIsLoading(false)
    }
  }

  const normalizeFeatureGroup = (features) => {
    return {
      type: "FeatureCollection",
      features: features.map((feature) => {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            color: `${feature.properties.color}`
          }
        }
      })
    }
  }

  const customIcon = (color, rotation) => {
    return new DivIcon({
      className: 'custom-div-icon',
      html: `<svg aria-hidden="true" style="transform:rotate(${rotation - 45}deg)" focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${color}" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="${color}80" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`,
      iconSize: [16, 16]
    });
  }

  function handleVesselsInBounds() {
    const bounds = mapEvents.getBounds();

    const northEast = bounds._northEast;
    const southWest = bounds._southWest;

    const vesselsInBounds = featureGroup.features.filter((feature) => {
      const [longitude, latitude] = feature.geometry.coordinates;

      if ((latitude < northEast.lat && latitude > southWest.lat) && (longitude < northEast.lng && longitude > southWest.lng)) {
        return feature;
      }

      return null;
    });

    const normalizedFeatureGroup = normalizeFeatureGroup(vesselsInBounds);

    setRenders(normalizedFeatureGroup);
  }

  return (
    <>
      {!!renders && zoom <= 13 &&
        <>
          <GeoJSON
            pointToLayer={(feature, latlng) => {
              const marker = new Marker6Point(latlng, {
                icon: customIcon(`#${feature.properties.color}`, feature.properties.rotation)
              })
              const layerPopUp = new Popup();
              marker.on("popupopen", () => {
                ReactDOM.render(
                  <CardDetailsVessel
                    imo={feature.properties.imo} />,
                  layerPopUp._contentNode
                );
              });
              marker.bindPopup(layerPopUp);
              return marker
            }}
            data={renders}
            key={renders.features.length}
          />
        </>}
      {!!featureGroupPolygon && zoom > 13 &&
        <GeoJSON
          data={featureGroupPolygon}
          onEachFeature={(feature, layer) => {
            layer.setStyle({
              fillColor: `#${feature.properties.color}`,
              fillOpacity: 0.8,
              color: `#${feature.properties.color}`,
              weight: 2
            })
            const layerPopUp = new Popup();
            layer.on("popupopen", () => {
              ReactDOM.render(
                <CardDetailsVessel
                  imo={feature.properties.imo} />,
                layerPopUp._contentNode
              );
            });
            layer.bindPopup(layerPopUp);
          }}
        />
      }
      <SpinnerFull isLoading={isLoading} />
    </>
  )
}

export default AISVessels
