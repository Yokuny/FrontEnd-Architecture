// Global variables
let map;
export let markerList = []; // all markers here
let polylineList = []; // all polylines here

// Event callbacks
let _onPolylineCreated = null;
let _onMarkerCreated = null;
let _onTooltipCreated = null;

/**
 * Initializes the tooltip layout system
 * @param {Object} leafletMap - The Leaflet map instance
 * @param {Array} markerlist - List of markers to manage
 * @param {Function} onPolylineCreated - Callback when polylines are created
 */
export function initialize(leafletMap, markerlist, onPolylineCreated) {
  if (!leafletMap) return;

  map = leafletMap;
  markerList = markerlist || [];
  polylineList = [];

  // Default polyline style and events
  _onPolylineCreated = onPolylineCreated || ((ply) => {
    ply.setStyle({
      color: '#90A4AE'
    });
    ply.on('mouseover', (e) => {
      e.target.setStyle({
        color: '#039BE5'
      });
    });
    ply.on('mouseout', (e) => {
      e.target.setStyle({
        color: '#90A4AE'
      });
    });
  });

  // Skip layout if no markers
  if (markerList.length === 0) return;

  setRandomPos();
  layoutByForce();
  setEdgePosition();
  drawLine();

  // Clean up existing event listeners before adding new ones
  removeEventListeners();
  registerEventListeners();
}

/**
 * Removes all event listeners from the map
 */
function removeEventListeners() {
  if (!map) return;
  map.removeEventListener('zoomstart', onZoomStart);
  map.removeEventListener('zoomend', onZoomEnd);
  map.removeEventListener('dragend', onDragEnd);
  map.removeEventListener('resize', onResize);
}

/**
 * Registers all event listeners to the map
 */
function registerEventListeners() {
  if (!map) return;
  map.addEventListener('zoomstart', onZoomStart);
  map.addEventListener('zoomend', onZoomEnd);
  map.addEventListener('dragend', onDragEnd);
  map.addEventListener('resize', onResize);
}

function onZoomStart() {
  removeAllPolyline();
}

function onZoomEnd() {
  if (!markerList || markerList.length === 0) return;
  updateLayout();
}

function onDragEnd() {
  if (!markerList || markerList.length === 0) return;
  updateLayout();
}

function onResize() {
  if (!markerList || markerList.length === 0) return;
  updateLayout();
}

/**
 * Updates the layout completely
 */
function updateLayout() {
  removeAllPolyline();
  setRandomPos();
  layoutByForce();
  setEdgePosition();
  drawLine();
}

/**
 * Removes all polylines from the map
 */
export function removeAllPolyline() {
  if (!map) return;

  polylineList.forEach(polyline => {
    map.removeLayer(polyline);
  });
  polylineList = [];
}

/**
 * Cleans up and removes all event listeners
 * @param {Object} leafletMap - The Leaflet map instance
 */
export function deinitialize(leafletMap) {
  if (!leafletMap) return;

  map = leafletMap;
  removeAllPolyline();
  removeEventListeners();
}

/**
 * Draw lines between markers and tooltips
 */
function drawLine() {
  if (!map) return;

  markerList.forEach(marker => {
    if (marker.__ply && !polylineList.includes(marker.__ply)) {
      polylineList.push(marker.__ply);
    }
  });

  removeAllPolyline();

  markerList.forEach(marker => {
    const markerDom = marker._icon;
    if (!markerDom) return;

    const label = marker.getTooltip();
    if (!label || !label._container) return;

    const labelDom = label._container;

    try {
      const markerPosition = getPosition(markerDom);
      const labelPosition = getPosition(labelDom);

      if (!markerPosition || !labelPosition) return;

      let x1 = labelPosition.x - 5;
      let y1 = labelPosition.y + 2;
      const x = markerPosition.x;
      const y = markerPosition.y;

      // Only draw line if positions are different
      if (x1 - x === 0 && y1 - y === 0) return;

      // Adjust end point of the line based on tooltip position
      if (x1 + labelDom.offsetWidth < markerPosition.x) {
        x1 += labelDom.offsetWidth;
      }
      if (y1 + labelDom.offsetHeight < markerPosition.y) {
        y1 += labelDom.offsetHeight;
      }

      const lineDest = window.L.point(x1, y1);
      const destLatLng = map.layerPointToLatLng(lineDest);

      if (label.isOpen()) {
        const ply = window.L.polyline([marker.getLatLng(), destLatLng], { weight: 1 });
        if (_onPolylineCreated) _onPolylineCreated(ply);
        marker.__ply = ply;
        polylineList.push(ply);
        ply.addTo(map);
      }
    } catch (err) {
    }
  });
}

/**
 * Set random positions for tooltips around markers
 */
function setRandomPos() {
  markerList.forEach((marker, i) => {
    const label = marker.getTooltip();
    if (!label || !label._container || !marker._icon) return;

    const labelDom = label._container;

    try {
      const markerPosition = getPosition(marker._icon);
      if (!markerPosition) return;

      // Distribute tooltips in a circle around the marker
      const angle = ((2 * Math.PI) / 6) * i;
      const x = markerPosition.x;
      const y = markerPosition.y;

      const dest = window.L.point(
        Math.ceil(x + 50 * Math.sin(angle)),
        Math.ceil(y + 50 * Math.cos(angle))
      );

      window.L.DomUtil.setPosition(labelDom, dest);
    } catch (err) {
    }
  });
}

/**
 * Scale a point by multiplying its x and y components
 */
function scaleTo(a, b) {
  return window.L.point(a.x * b.x, a.y * b.y);
}

/**
 * Normalize a point (make its length 1)
 */
function normalize(a) {
  const l = a.distanceTo(window.L.point(0, 0));
  if (l === 0) {
    return a;
  }
  return window.L.point(a.x / l, a.y / l);
}

// Force-directed layout functions
function fa(x, k) {
  return (x * x) / k;
}

function fr(x, k) {
  return (k * k) / x;
}

/**
 * Get position from element's transform style
 * @param {HTMLElement} el - DOM element
 * @returns {L.Point|null} - Position as a Leaflet point or null if not found
 */
function getPosition(el) {
  if (!el || !el.style || !el.style.transform) return null;

  try {
    const translateString = el.style.transform
      .split('(')[1]
      ?.split(')')[0]
      ?.split(',');

    if (!translateString || translateString.length < 2) return null;

    return window.L.point(
      parseInt(translateString[0], 10),
      parseInt(translateString[1], 10)
    );
  } catch (err) {
    return null;
  }
}

/**
 * Compute a single step in the force-directed layout algorithm
 * @param {number} t - Temperature (controls movement amount)
 */
function computePositionStep(t) {
  const area = (window.innerWidth * window.innerHeight) / 10;
  const k = Math.sqrt(area / Math.max(1, markerList.length));

  // Calculate repulsive forces between tooltips
  markerList.forEach((v, i) => {
    const tooltip = v.getTooltip();
    if (!tooltip || !tooltip._container) return;

    // get position of label v
    v.disp = window.L.point(0, 0);
    const v_pos = getPosition(tooltip._container);
    if (!v_pos) return;

    // compute gravitational force with other tooltips
    markerList.forEach((u, j) => {
      if (i === j) return;

      const u_tooltip = u.getTooltip();
      if (!u_tooltip || !u_tooltip._container) return;

      const u_pos = getPosition(u_tooltip._container);
      if (!u_pos) return;

      const dpos = v_pos.subtract(u_pos);
      const distance = dpos.distanceTo(window.L.point(0, 0));

      if (distance > 0) {
        v.disp = v.disp.add(
          normalize(dpos).multiplyBy(fr(distance, k))
        );
      }
    });
  });

  // Compute attractive force between marker and its tooltip
  markerList.forEach(v => {
    const tooltip = v.getTooltip();
    if (!tooltip || !tooltip._container || !v._icon) return;

    const v_pos = getPosition(tooltip._container);
    const marker_pos = getPosition(v._icon);

    if (!v_pos || !marker_pos) return;

    const dpos = v_pos.subtract(marker_pos);
    const distance = dpos.distanceTo(window.L.point(0, 0));

    v.disp = v.disp.subtract(
      normalize(dpos).multiplyBy(fa(distance, k))
    );
  });

  // Apply calculated displacements with temperature limiting
  markerList.forEach(marker => {
    const tooltip = marker.getTooltip();
    if (!tooltip || !tooltip._container || !marker.disp) return;

    const disp = marker.disp;
    const p = getPosition(tooltip._container);
    if (!p) return;

    const d = scaleTo(
      normalize(disp),
      window.L.point(Math.min(Math.abs(disp.x), t), Math.min(Math.abs(disp.y), t))
    );

    const newPos = p.add(d);
    const roundedPos = window.L.point(Math.ceil(newPos.x), Math.ceil(newPos.y));
    window.L.DomUtil.setTransform(tooltip._container, roundedPos);
  });
}

/**
 * Layout tooltips using force-directed algorithm
 */
function layoutByForce() {
  const start = Math.ceil(window.innerWidth / 10);
  const iterations = 50;

  // Run multiple iterations with decreasing temperature
  for (let i = 0; i < iterations; i++) {
    const t = start * (1 - i / (iterations - 1));
    computePositionStep(t);
  }

  // Center tooltips on their calculated positions
  markerList.forEach(marker => {
    const tooltip = marker.getTooltip();
    if (!tooltip || !tooltip._container) return;

    const p = getPosition(tooltip._container);
    if (!p) return;

    const width = tooltip._container.offsetWidth;
    const height = tooltip._container.offsetHeight;

    const centeredPos = window.L.point(
      Math.ceil(p.x - width / 2),
      Math.ceil(p.y - height / 2)
    );

    window.L.DomUtil.setTransform(tooltip._container, centeredPos);
  });
}

/**
 * Ensure tooltips stay within map bounds
 */
function setEdgePosition() {
  if (!map) return;

  const bounds = map.getBounds();
  const northWest = map.latLngToLayerPoint(bounds.getNorthWest());
  const southEast = map.latLngToLayerPoint(bounds.getSouthEast());

  markerList.forEach(marker => {
    const tooltip = marker.getTooltip();
    if (!tooltip || !tooltip._container || !marker._icon) return;

    const tooltipPos = getPosition(tooltip._container);
    const markerPos = getPosition(marker._icon);

    if (!tooltipPos || !markerPos) return;

    const width = tooltip._container.offsetWidth;
    const height = tooltip._container.offsetHeight;

    let isEdge = false;
    const adjustedPos = window.L.point(tooltipPos.x, tooltipPos.y);

    // Adjust horizontal position
    if (markerPos.x > northWest.x && tooltipPos.x < northWest.x) {
      adjustedPos.x = northWest.x;
      isEdge = true;
    } else if (markerPos.x < southEast.x && tooltipPos.x > southEast.x - width) {
      adjustedPos.x = southEast.x - width;
      isEdge = true;
    }

    // Adjust vertical position
    if (markerPos.y > northWest.y && tooltipPos.y < northWest.y) {
      adjustedPos.y = northWest.y;
      isEdge = true;
    } else if (markerPos.y < southEast.y && tooltipPos.y > southEast.y - height) {
      adjustedPos.y = southEast.y - height;
      isEdge = true;
    }

    // Handle special cases for non-edge positions
    if (!isEdge) {
      // Handle horizontal cases
      if (markerPos.x < northWest.x && tooltipPos.x > northWest.x - width) {
        adjustedPos.x = northWest.x - width;
      } else if (markerPos.x > southEast.x && tooltipPos.x < southEast.x) {
        adjustedPos.x = southEast.x;
      }

      // Handle vertical cases
      if (markerPos.y < northWest.y && tooltipPos.y > northWest.y - height) {
        adjustedPos.y = northWest.y - height;
      } else if (markerPos.y > southEast.y && tooltipPos.y < southEast.y) {
        adjustedPos.y = southEast.y;
      }
    }

    window.L.DomUtil.setTransform(tooltip._container, adjustedPos);
  });
}
