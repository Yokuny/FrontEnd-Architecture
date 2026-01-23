import L, { Bounds, LatLng, LatLngBounds, Path, Point, Util } from 'leaflet';
import Flatten from '@flatten-js/core';
const Matrix = Flatten.Matrix;

const DEFAULT_SIZE = 24;
const DEFAULT_LEADER_TIME = 60;

/**
 * Track symbol.
 */
export class TrackSymbol
  extends Path {

  /** Default 'withHeading' shape points. */
  static DEFAULT_HEADING_SHAPE_POINTS = [[0.75, 0], [-0.25, 0.3], [-0.25, -0.3]];

  /** Default 'withoutHeading' shape points. */
  static DEFAULT_NOHEADING_SHAPE_POINTS = [[0.3, 0], [0, 0.3], [-0.3, 0], [0, -0.3]];

  /** Default shape set. */
  static DEFAULT_SHAPE_SET = {
    withHeading: {
      points: TrackSymbol.DEFAULT_HEADING_SHAPE_POINTS,
      length: DEFAULT_SIZE,
      breadth: DEFAULT_SIZE,
      units: "pixels",
    },
    withoutHeading: {
      points: TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS,
      length: DEFAULT_SIZE,
      breadth: DEFAULT_SIZE,
      units: "pixels",
    },
  };

  /** Location. */
  _latLng;
  /** Heading (radians, from north, clockwise. */
  _heading;
  /** Course (radians, from north, clockwise. */
  _course;
  /** Speed (m/s). */
  _speed;
  /** Shape options. */
  _shapeOptions;

  /** Current shape points. */
  _currentShapePoints;
  /** Current leader points. */
  _currentLeaderPoints;
  /** Current bounds. */
  _currentBounds;
  /** Current lat/lng bounds. */
  _currentLatLngBounds;

  /**
   * TrackSymbol constructor.
   *
   * @param latLng - Initial location.
   * @param options - Options.
   */
  constructor(latLng, options) {
    super();

    Util.setOptions(this, options);
    if (latLng == undefined) {
      throw Error("latLng required");
    }
    options = options || {};
    this._latLng = L.latLng(latLng);
    this._heading = options.heading;
    this._course = options.course;
    this._speed = options.speed;
    this._setShapeOptions(options.shapeOptions);
  }

  // ---- Leaflet

  /**
   * Project to layer.
   *
   * [Leaflet internal]
   */
  _project() {
    this._currentShapePoints = this._getProjectedShapePoints();
    this._currentLeaderPoints = this._getLeaderShapePoints();

    const bounds = new Bounds();
    for (let i = 0; i < this._currentShapePoints?.length; i++) {
      const point = this._currentShapePoints[i];
      bounds.extend(point);
    }
    if (this._currentLeaderPoints !== undefined) {
      for (let i = 0; i < this._currentLeaderPoints?.length; i++) {
        const point = this._currentShapePoints[i];
        bounds.extend(point);
      }
    }
    this._currentBounds = bounds;
    this._currentLatLngBounds = new LatLngBounds(
      this._map.layerPointToLatLng(bounds.getBottomLeft()),
      this._map.layerPointToLatLng(bounds.getTopRight())
    );
  }

  /**
   * Update element.
   *
   * [Leaflet internal]
   */
  _update() {
    if (!this._map) {
      return;
    }
    let viewPath = TrackSymbol._toSVGPath(this._currentShapePoints, true);
    if (this._currentLeaderPoints !== undefined) {
      viewPath += ' ' + TrackSymbol._toSVGPath(this._currentLeaderPoints, false);
    }
    this.getElement().setAttribute('d', viewPath);
  }

  // ----

  /**
   * Set shape options.
   *
   * @param shapeOptions - Shape options.
   */
  _setShapeOptions(shapeOptions) {
    this._shapeOptions = shapeOptions || {
      leaderTime: DEFAULT_LEADER_TIME,
      defaultShapeSet: TrackSymbol.DEFAULT_SHAPE_SET,
    };
    if (this._shapeOptions.leaderTime === undefined) {
      this._shapeOptions.leaderTime = DEFAULT_LEADER_TIME;
    }
    if (this._shapeOptions.defaultShapeSet === undefined) {
      this._shapeOptions.defaultShapeSet = TrackSymbol.DEFAULT_SHAPE_SET;
    }
    if (this._shapeOptions.shapeSetEntries !== undefined) {
      this._shapeOptions.shapeSetEntries
        .sort((a, b) => b.minZoomLevel - a.minZoomLevel);
    }
  }

  // ---

  /**
   * Sets the location.
   *
   * @param latLng - Location.
   * @returns this
   */
  setLatLng(latLng) {
    const oldLatLng = this._latLng;
    this._latLng = L.latLng(latLng);
    this.fire('move', {
      oldLatLng: oldLatLng,
      latlng: this._latLng,
    });
    return this.redraw();
  }

  /**
   * Sets the heading.
   *
   * @param heading - Heading (unit: radians, from north, clockwise).
   * @returns this
   */
  setHeading(heading) {
    this._heading = heading;
    return this.redraw();
  }

  /**
   * Sets the course over ground.
   *
   * @param course - Course over ground (unit: radians, from north, clockwise).
   * @returns this
   */
  setCourse(course) {
    this._course = course;
    return this.redraw();
  }

  /**
   * Sets the speed.
   *
   * @param speed - Speed (unit: m/s).
   * @returns this
   */
  setSpeed(speed) {
    this._speed = speed;
    return this.redraw();
  }

  /**
   * Sets the shape options.
   *
   * @param shapeOptions - Shape options.
   * @returns this
   */
  setShapeOptions(shapeOptions) {
    this._setShapeOptions(shapeOptions);
    return this.redraw();
  }

  /**
   * Returns the bounding box.
   *
   * @returns The bounding box.
   */
  getBounds() {
    return this._currentLatLngBounds;
  }

  /**
   * Returns the location.
   *
   * @returns The location.
   */
  getLatLng() {
    return this._latLng;
  }

  /**
   * Returns the speed.
   *
   * @returns The speed (m/s).
   */
  getSpeed() {
    return this._speed;
  }

  /**
   * Returns the heading.
   *
   * @returns The heading (radians, from north, clockwise).
   */
  getHeading() {
    return this._heading;
  }

  /**
   * Returns the course.
   *
   * @returns The course (radians, from north, clockwise).
   */
  getCourse() {
    return this._course;
  }

  /**
   * Creates a shape.
   *
   * @param points - Points.
   * @param size - Size (units: pixels).
   * @returns The new shape.
   */
  static createShape(points, size) {
    return {
      points,
      length: size,
      breadth: size,
      units: "pixels",
    };
  }

  /**
   * Creates a shape set.
   *
   * @param size - Size (units: pixels).
   * @returns The new shape set.
   */
  static createShapeSet(size) {
    return {
      withHeading: TrackSymbol.createShape(TrackSymbol.DEFAULT_HEADING_SHAPE_POINTS, size),
      withoutHeading: TrackSymbol.createShape(TrackSymbol.DEFAULT_NOHEADING_SHAPE_POINTS, size),
    };
  }

  /**
   * Get latitude size of y-distance.
   *
   * @param value - Y distance (m).
   * @returns dLat
   */
  _getLatSizeOf(value) {
    return (value / 40075017) * 360;
  }

  /**
   * Get longitude size of x-distance.
   *
   * @param value - X distance (m).
   * @returns dLng
   */
  _getLngSizeOf(value) {
    return ((value / 40075017) * 360) / Math.cos((Math.PI / 180) * this._latLng.lat);
  }

  /**
   * Get view angle from model.
   *
   * @param modelAngle - Model angle (radians).
   * @returns View angle from model (radians).
   */
  _getViewAngleFromModel(modelAngle) {
    return modelAngle - Math.PI / 2.0;
  }

  /**
   * Get leader shape points.
   *
   * @returns Points.
   */
  _getLeaderShapePoints() {
    if ((this._course === undefined) || (this._speed === undefined)) {
      return undefined;
    }
    const angle = this._getViewAngleFromModel(this._course);
    const leaderLength = this._speed * this._shapeOptions.leaderTime;
    const leaderEndLatLng = this._calcRelativeLatLng(this._latLng, leaderLength, angle);
    return this._latLngsToLayerPoints(this._latLng, leaderEndLatLng);
  }

  /**
   * Calculate relative lat/lng.
   *
   * @param latLng - LatLng.
   * @param distance - Distance (meters).
   * @param angle - Angle (radians).
   * @returns Calculated LatLng.
   */
  _calcRelativeLatLng(latLng, distance, angle) {
    return new LatLng(
      latLng.lat - this._getLatSizeOf(distance * Math.sin(angle)),
      latLng.lng + this._getLngSizeOf(distance * Math.cos(angle))
    );
  }

  /**
   * Convert LatLngs to map layer points.
   *
   * @param latLngs - LatLngs.
   * @returns Points.
   */
  _latLngsToLayerPoints(...latLngs) {
    return latLngs.map(latLng => this._map.latLngToLayerPoint(latLng));
  }

  /**
   * Gets the shape set.
   *
   * @returns The shape set.
   */
  _getShapeSet() {
    if ((this._shapeOptions.shapeSetEntries === undefined)
      || (this._shapeOptions.shapeSetEntries?.length == 0)) {
      return this._shapeOptions.defaultShapeSet;
    }
    const zoomLevel = this._map.getZoom();
    const shapeSetEntriesFiltered = this._shapeOptions.shapeSetEntries
      .sort((a, b) => b.minZoomLevel - a.minZoomLevel)
      .filter(shapeSetEntry => zoomLevel >= shapeSetEntry.minZoomLevel);
    if (shapeSetEntriesFiltered?.length > 0) {
      return shapeSetEntriesFiltered[0].shapeSet;
    } else {
      return this._shapeOptions.defaultShapeSet;
    }
  }

  /**
   * Gets the shape.
   *
   * @returns The shape.
   */
  _getShape() {
    const shapeSet = this._getShapeSet();
    return (this._heading !== undefined) ? shapeSet.withHeading : shapeSet.withoutHeading;
  }

  /**
   * Get transformed shape points.
   *
   * @returns Transformed points and units.
   */
  _getTransformedShapePoints() {
    const shape = this._getShape();
    let m = new Matrix();
    if (this._heading !== undefined) {
      const headingAngle = this._getViewAngleFromModel(this._heading);
      m = m.rotate(headingAngle);
    }
    if (shape.center !== undefined) {
      m = m.translate(-shape.center[0], -shape.center[1]);
    }
    m = m.scale(shape.length, shape.breadth);
    const points = shape.points.map(point => m.transform(point));
    return [points, shape.units];
  }

  /**
   * Get projected shape points.
   *
   * @returns Points projected to map layer.
   */
  _getProjectedShapePoints() {
    const [points, units] = this._getTransformedShapePoints();
    switch (units) {
      case "pixels": {
        const p = this._map.latLngToLayerPoint(this._latLng);
        const m = new Matrix().translate(p.x, p.y);
        return points.map(point => {
          const p1 = m.transform(point);
          return new Point(p1[0], p1[1]);
        });
      }
      case "meters": {
        return points.map(point => this._map.latLngToLayerPoint(
          new LatLng(
            this._latLng.lat - this._getLatSizeOf(point[1]),
            this._latLng.lng + this._getLngSizeOf(point[0])
          )
        ));
      }
      default:
        break;
    }
  }

  /**
   * Converts points to an SVG path string.
   *
   * @param points - Points.
   * @param close - Close path.
   * @returns SVG path string.
   */
  static _toSVGPath(points, close) {
    let result = '';
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (result === '') {
        result = `M ${point.x} ${point.y} `;
      } else {
        result += `L ${point.x} ${point.y} `;
      }
    }
    if (close) {
      result += 'Z';
    }
    return result;
  }
}
