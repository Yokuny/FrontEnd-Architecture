import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

const lineStyle = {
  color: 'red',      // stroke
  weight: 2,
  fillColor: 'red',  // fill (para polígonos; em linhas não aparece)
  fillOpacity: 1,
};

function makeLabel(len) {
  if (len == null) return undefined;

  // OpenLayers: <1 m -> mm | <1000 m -> m | senão NM + km (duas linhas)
  if (len < 1.0) {
    return `${(len * 1000).toFixed(0)} mm`;
  } else if (len < 1000.0) {
    return `${len.toFixed(3)} m`;
  } else {
    const nm = (len / 1852.0).toFixed(1);
    const km = (len / 1000.0).toFixed(3);
    return `${nm} NM<br/>${km} km`;
  }
}

export default function GeoJsonStyled({
  data
}) {
  const style = (feature) => {
    if (!feature) return;
    // para linhas de medida aplicamos traço/vermelho
    if (feature.properties?.type === 'measure_line') {
      return lineStyle;
    }
    // para outros vetores o estilo default (se necessário)
    return undefined;
  };

  const pointToLayer = (feature, latlng) => {
    // círculo: radius 3, fill red, stroke black width 2 (igual ao OL)
    const circle = L.circleMarker(latlng, {
      radius: 3,
      fillColor: 'red',
      fillOpacity: 1,
      color: 'black',
      weight: 2,
    });

    const length = feature.properties?.length;
    if (typeof length === 'number' && length >= 0) {
      const html = makeLabel(length);
      if (html) {
        circle.bindTooltip(html, {
          permanent: true,
          direction: 'top',
          className: 'label-outline', // CSS abaixo
          sticky: false,
          opacity: 1,
        });
      }
    }
    return circle;
  };

  const onEachFeature = (feature, layer) => {
    // para linhas tipo measure_line adiciona o rótulo como no OL
    if (feature.properties?.type === 'measure_line') {
      const length = feature.properties?.length;
      const html = makeLabel(length);
      if (html && (layer).bindTooltip) {
        (layer).bindTooltip(html, {
          permanent: true,
          direction: 'center',
          className: 'label-outline',
          sticky: false,
          opacity: 1,
        });
      }
    }
  };

  return (
    <>
      {/* CSS “stroke” do texto similar ao Stroke do OL */}
      <style>{`
        .label-outline {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
          font-size: 14px;            /* OL usava scale ~1.5 */
          font-weight: 600;
          color: white;
          text-shadow:
            -1px -1px 0 black,  1px -1px 0 black,
            -1px  1px 0 black,  1px  1px 0 black;
          white-space: nowrap;
          text-align: center;
          line-height: 1.1;
        }
        .label-outline .leaflet-tooltip-content { margin: 0; }
      `}</style>

      <GeoJSON
        data={data}
        style={style}
        onEachFeature={onEachFeature}
        pointToLayer={pointToLayer}
      />
    </>
  );
}
