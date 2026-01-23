import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const MapEventHandler = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.doubleClickZoom.disable();

    const handleDoubleClick = (e) => {
      const target = e.originalEvent?.target;
      const isMapElement = target === map._container || 
                          (target && target.classList && (
                            target.classList.contains('leaflet-tile') ||
                            target.classList.contains('leaflet-container') ||
                            target.classList.contains('leaflet-pane')
                          ));
      
      if (isMapElement) {
        const zoomDelta = e.originalEvent?.shiftKey ? -1 : 1;
        map.setZoomAround(e.latlng, map.getZoom() + zoomDelta);
      }
      
      if (e.originalEvent) {
        e.originalEvent.stopPropagation();
      }
      e.originalEvent?.preventDefault();
      if (typeof e.stop === 'function') {
        e.stop();
      }
    };

    map.on('dblclick', handleDoubleClick);

    return () => {
      map.off('dblclick', handleDoubleClick);
      map.doubleClickZoom.enable();
    };
  }, [map]);

  return null;
};
