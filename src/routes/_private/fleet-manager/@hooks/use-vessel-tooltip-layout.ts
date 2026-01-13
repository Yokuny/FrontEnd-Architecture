import L from 'leaflet';
import { useCallback, useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

interface TooltipLayoutProps {
  markers: Map<string, L.Marker | null>;
  enabled: boolean;
}

export function useVesselTooltipLayout({ markers, enabled }: TooltipLayoutProps) {
  const map = useMap();
  const polylineListRef = useRef<L.Polyline[]>([]);

  const getElementPosition = useCallback((el: HTMLElement) => {
    if (!el || !el.style || !el.style.transform) return null;
    try {
      const transform = el.style.transform;
      const match = transform.match(/translate(?:3d)?\((-?\d+)px,\s*(-?\d+)px/);
      if (match) {
        return L.point(parseInt(match[1], 10), parseInt(match[2], 10));
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const removeAllPolylines = useCallback(() => {
    polylineListRef.current.forEach((polyline) => {
      map.removeLayer(polyline);
    });
    polylineListRef.current = [];
  }, [map]);

  const updateLayout = useCallback(() => {
    if (!enabled) {
      removeAllPolylines();
      return;
    }

    const markerArray = Array.from(markers.values()).filter((m): m is L.Marker => !!m && !!m.getTooltip());
    if (markerArray.length === 0) {
      removeAllPolylines();
      return;
    }

    // Force-directed layout constants
    const area = (window.innerWidth * window.innerHeight) / 10;
    const k = Math.sqrt(area / Math.max(1, markerArray.length));
    const iterations = 50;
    const startTemp = Math.ceil(window.innerWidth / 10);

    const fa = (x: number, kVal: number) => (x * x) / kVal;
    const fr = (x: number, kVal: number) => (kVal * kVal) / x;

    // Helper to set random initial positions if needed (or just use current)
    markerArray.forEach((m, i) => {
      const tooltip = m.getTooltip();
      const markerEl = m.getElement();
      const container = (tooltip as any)?._container as HTMLElement;
      if (!container || !markerEl) return;

      const markerPos = getElementPosition(markerEl);
      if (!markerPos) return;

      // Initial offset
      const angle = ((2 * Math.PI) / 6) * i;
      const dest = L.point(Math.ceil(markerPos.x + 50 * Math.sin(angle)), Math.ceil(markerPos.y + 50 * Math.cos(angle)));
      L.DomUtil.setPosition(container, dest);
    });

    const step = (t: number) => {
      // Repulsive forces
      const displacements = new Map<string, L.Point>();

      markerArray.forEach((v, i) => {
        const vTooltip = v.getTooltip();
        const vContainer = (vTooltip as any)?._container as HTMLElement;
        if (!vContainer) return;

        let disp = L.point(0, 0);
        const vPos = getElementPosition(vContainer);
        if (!vPos) return;

        markerArray.forEach((u, j) => {
          if (i === j) return;
          const uTooltip = u.getTooltip();
          const uContainer = (uTooltip as any)?._container as HTMLElement;
          if (!uContainer) return;

          const uPos = getElementPosition(uContainer);
          if (!uPos) return;

          const dpos = vPos.subtract(uPos);
          const distance = dpos.distanceTo(L.point(0, 0));

          if (distance > 0) {
            const normalized = L.point(dpos.x / distance, dpos.y / distance);
            disp = disp.add(normalized.multiplyBy(fr(distance, k)));
          }
        });
        displacements.set((v as any)._leaflet_id, disp);
      });

      // Attractive forces
      markerArray.forEach((v) => {
        const vTooltip = v.getTooltip();
        const vContainer = (vTooltip as any)?._container as HTMLElement;
        const vIcon = v.getElement();
        if (!vContainer || !vIcon) return;

        const vPos = getElementPosition(vContainer);
        const markerPos = getElementPosition(vIcon);
        if (!vPos || !markerPos) return;

        const dpos = vPos.subtract(markerPos);
        const distance = dpos.distanceTo(L.point(0, 0));

        if (distance > 0) {
          const disp = displacements.get((v as any)._leaflet_id) || L.point(0, 0);
          const normalized = L.point(dpos.x / distance, dpos.y / distance);
          displacements.set((v as any)._leaflet_id, disp.subtract(normalized.multiplyBy(fa(distance, k))));
        }
      });

      // Apply
      markerArray.forEach((m) => {
        const tooltip = m.getTooltip();
        const container = (tooltip as any)?._container as HTMLElement;
        if (!container) return;

        const disp = displacements.get((m as any)._leaflet_id);
        const p = getElementPosition(container);
        if (!disp || !p) return;

        const dist = disp.distanceTo(L.point(0, 0));
        if (dist === 0) return;

        const limitedDisp = L.point((disp.x / dist) * Math.min(Math.abs(disp.x), t), (disp.y / dist) * Math.min(Math.abs(disp.y), t));

        const newPos = p.add(limitedDisp);
        L.DomUtil.setTransform(container, L.point(Math.ceil(newPos.x), Math.ceil(newPos.y)));
      });
    };

    for (let i = 0; i < iterations; i++) {
      const t = startTemp * (1 - i / (iterations - 1));
      step(t);
    }

    // Final centering and bounds check
    const bounds = map.getBounds();
    const nw = map.latLngToLayerPoint(bounds.getNorthWest());
    const se = map.latLngToLayerPoint(bounds.getSouthEast());

    markerArray.forEach((m) => {
      const tooltip = m.getTooltip();
      const container = (tooltip as any)?._container as HTMLElement;
      if (!container) return;

      const p = getElementPosition(container);
      if (!p) return;

      const w = container.offsetWidth;
      const h = container.offsetHeight;

      let x = p.x - w / 2;
      let y = p.y - h / 2;

      // Clamp to edges
      x = Math.max(nw.x, Math.min(se.x - w, x));
      y = Math.max(nw.y, Math.min(se.y - h, y));

      L.DomUtil.setTransform(container, L.point(Math.ceil(x), Math.ceil(y)));
    });

    // Draw lines
    removeAllPolylines();
    markerArray.forEach((m) => {
      const tooltip = m.getTooltip();
      if (!tooltip) return;
      const container = (tooltip as any)?._container as HTMLElement;
      const icon = m.getElement();
      if (!container || !icon || !tooltip.isOpen()) return;

      const mPos = getElementPosition(icon);
      const tPos = getElementPosition(container);
      if (!mPos || !tPos) return;

      const w = container.offsetWidth;
      const h = container.offsetHeight;

      // Line start (marker)
      const startLatLng = m.getLatLng();

      // Line end (adjusted tooltip edge)
      let ex = tPos.x;
      let ey = tPos.y + h / 2;

      if (tPos.x + w < mPos.x) {
        ex = tPos.x + w;
      } else if (tPos.x > mPos.x) {
        ex = tPos.x;
      } else {
        ex = tPos.x + w / 2;
      }

      if (tPos.y + h < mPos.y) {
        ey = tPos.y + h;
      } else if (tPos.y > mPos.y) {
        ey = tPos.y;
      }

      const endPoint = L.point(ex, ey);
      const endLatLng = map.layerPointToLatLng(endPoint);

      const polyline = L.polyline([startLatLng, endLatLng], {
        color: '#90A4AE',
        weight: 1,
        dashArray: '4, 4',
        interactive: false,
      }).addTo(map);

      polylineListRef.current.push(polyline);
    });
  }, [enabled, map, markers, removeAllPolylines, getElementPosition]);

  useMapEvents({
    zoomstart: () => removeAllPolylines(),
    zoomend: () => updateLayout(),
    dragend: () => updateLayout(),
    resize: () => updateLayout(),
  });

  useEffect(() => {
    // Initial layout after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      updateLayout();
    }, 500);

    return () => {
      clearTimeout(timer);
      removeAllPolylines();
    };
  }, [updateLayout, removeAllPolylines]);

  return { updateLayout };
}
