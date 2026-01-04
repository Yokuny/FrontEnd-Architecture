import { bearing } from '@turf/turf';
import L from 'leaflet';

/**
 * Enumeration for the state of the marker motion.
 */
export enum MarkerMotionState {
  READY = 0,
  MOVING = 1,
  PAUSED = 3,
  ENDED = 4,
}

export interface MarkerMotionOptions extends L.MarkerOptions {
  rotation?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  rotationAngle?: number;
  rotationOrigin?: string;
}

/**
 * Represents a marker that moves along a given path with a configurable speed.
 */
export class MarkerMotion extends L.Marker {
  private _rotation: boolean;
  private _path: L.LatLng[];
  private _speed: number;
  private _state: MarkerMotionState;
  private _currentIndex: number;
  private _startTime: number | null;
  private _segmentStartTime: number | null;
  private _rafId: number | null;
  private _loop: boolean;
  private _pauseTime: number | null = null;
  private _autoplay: boolean = false;

  constructor(path: (L.LatLngExpression | number[])[], speedInKmH: number, options: MarkerMotionOptions = {}) {
    if (!Array.isArray(path)) {
      throw new Error('Path must be an array');
    }
    if (path.length < 2) {
      throw new Error('Path must have at least two points');
    }
    if (speedInKmH <= 0) {
      throw new Error('Speed must be greater than 0');
    }

    const { rotation, autoplay, loop, ...markerOptions } = options;
    const initialLatLng = L.latLng(path[0] as any);

    super(initialLatLng, markerOptions);

    this._rotation = !!rotation;
    this._path = path.map((point) => L.latLng(point as any));
    this._speed = (speedInKmH * 1000) / 3600;
    this._state = MarkerMotionState.READY;
    this._currentIndex = 0;
    this._startTime = null;
    this._segmentStartTime = null;
    this._rafId = null;
    this._loop = !!loop;
    this._autoplay = !!autoplay;

    if (this._rotation) {
      (this.options as any).rotationOrigin ??= 'center center';
      (this.options as any).rotationAngle ??= 0;
      this.on('move', this._applyRotation, this);
    }

    if (this._autoplay) {
      this.start();
    }
  }

  onAdd(map: L.Map): this {
    super.onAdd(map);
    if (this._rotation) {
      this._updateAngle();
      this._applyRotation();
      map.on('zoomend', this._applyRotation, this);
    }
    return this;
  }

  onRemove(map: L.Map): this {
    if (this._rotation) {
      map.off('zoomend', this._applyRotation, this);
    }
    this.pause();
    super.onRemove(map);
    return this;
  }

  private _updateAngle() {
    if (this._currentIndex >= this._path.length - 1) return;

    const origin = this._path[this._currentIndex];
    const destination = this._path[this._currentIndex + 1];
    (this.options as any).rotationAngle = bearing([origin.lng, origin.lat], [destination.lng, destination.lat]);
    this._applyRotation();
  }

  private _applyRotation() {
    const icon = this.getElement();
    if (icon) {
      (icon.style as any)[`${L.DomUtil.TRANSFORM}Origin`] = (this.options as any).rotationOrigin;
      const currentTransform = icon.style[L.DomUtil.TRANSFORM as any];
      const translate = currentTransform.match(/translate3d\([^)]+\)/);
      const rotation = `rotateZ(${(this.options as any).rotationAngle}deg)`;
      (icon.style as any)[L.DomUtil.TRANSFORM as any] = `${translate ? translate[0] : ''} ${rotation}`;
    }
  }

  start() {
    if (this._state === MarkerMotionState.READY || this._state === MarkerMotionState.PAUSED || this._state === MarkerMotionState.ENDED) {
      const now = performance.now();
      if (this._state === MarkerMotionState.PAUSED && this._pauseTime !== null) {
        const pauseDuration = now - this._pauseTime;
        if (this._startTime !== null) this._startTime += pauseDuration;
        if (this._segmentStartTime !== null) this._segmentStartTime += pauseDuration;
      } else {
        this._startTime = now;
        this._segmentStartTime = now;
        this._currentIndex = 0;
        this.setLatLng(this._path[0]);

        if (this._rotation) {
          this._updateAngle();
        }
      }
      this._state = MarkerMotionState.MOVING;
      this._rafId = L.Util.requestAnimFrame(this._animate.bind(this));
      this.fire('motion.start');
    }
  }

  pause() {
    if (this._state !== MarkerMotionState.MOVING) return;
    if (this._rafId !== null) {
      L.Util.cancelAnimFrame(this._rafId);
      this._rafId = null;
    }
    this._state = MarkerMotionState.PAUSED;
    this._pauseTime = performance.now();
    this.fire('motion.pause');
  }

  reset() {
    this._state = MarkerMotionState.READY;
    this._currentIndex = 0;
    this._startTime = null;
    this._segmentStartTime = null;
    this.setLatLng(this._path[0]);
    if (this._rotation) {
      this._updateAngle();
    }
    if (this._autoplay) {
      this.start();
    }
    this.fire('motion.reset');
  }

  setSpeed(speedInKmH: number) {
    if (speedInKmH <= 0) {
      throw new Error('Speed must be greater than 0');
    }

    let segmentProgress = 0;
    const oldSpeed = this._speed;

    if ((this._state === MarkerMotionState.MOVING || this._state === MarkerMotionState.PAUSED) && this._segmentStartTime !== null) {
      const current = this._path[this._currentIndex];
      const next = this._path[this._currentIndex + 1];

      if (next) {
        const segmentDistance = current.distanceTo(next);

        if (segmentDistance > 0) {
          const timeElapsed = (performance.now() - this._segmentStartTime) / 1000;
          const oldDistanceTraveled = timeElapsed * oldSpeed;
          segmentProgress = oldDistanceTraveled / segmentDistance;
        }
      }
    }

    this._speed = (speedInKmH * 1000) / 3600;

    if (this._state === MarkerMotionState.MOVING && this._currentIndex < this._path.length - 1) {
      const current = this._path[this._currentIndex];
      const next = this._path[this._currentIndex + 1];
      const segmentDistance = current.distanceTo(next);

      if (segmentDistance > 0) {
        const newTimeForProgress = (segmentDistance * segmentProgress) / this._speed;
        this._segmentStartTime = performance.now() - newTimeForProgress * 1000;
      } else {
        this._segmentStartTime = performance.now();
      }
    }
  }

  private _animate(timestamp: number) {
    if (this._state !== MarkerMotionState.MOVING || this._segmentStartTime === null) return;

    const timeElapsed = (timestamp - this._segmentStartTime) / 1000;
    let distanceTraveled = timeElapsed * this._speed;

    while (this._currentIndex < this._path.length - 1) {
      const current = this._path[this._currentIndex];
      const next = this._path[this._currentIndex + 1];
      const segmentDistance = current.distanceTo(next);

      if (segmentDistance === 0) {
        this._currentIndex++;
        this.fire('motion.segment', { index: this._currentIndex });
        continue;
      }
      if (distanceTraveled >= segmentDistance) {
        distanceTraveled -= segmentDistance;
        this._currentIndex++;

        this.fire('motion.segment', { index: this._currentIndex });

        if (this._currentIndex >= this._path.length - 1) {
          this.setLatLng(this._path[this._path.length - 1]);
          this._state = MarkerMotionState.ENDED;
          this.fire('motion.end');
          if (this._loop) {
            this.reset();
            this.start();
          }
          return;
        }

        if (this._rotation) {
          this._updateAngle();
        }
      } else {
        break;
      }
    }

    if (this._currentIndex >= this._path.length - 1) {
      if (this._state === MarkerMotionState.MOVING) {
        this._rafId = L.Util.requestAnimFrame(this._animate.bind(this));
      }
      return;
    }

    const currentSegment = this._path[this._currentIndex];
    const nextSegment = this._path[this._currentIndex + 1];
    const segmentDistance = currentSegment.distanceTo(nextSegment);

    const finalProgress = distanceTraveled / segmentDistance;

    const position = this._interpolate(currentSegment, nextSegment, finalProgress);

    this.setLatLng(position);
    this._segmentStartTime = timestamp - (distanceTraveled / this._speed) * 1000;
    this._rafId = L.Util.requestAnimFrame(this._animate.bind(this));
  }

  private _interpolate(start: L.LatLng, end: L.LatLng, factor: number): L.LatLng {
    return L.latLng(start.lat + (end.lat - start.lat) * factor, start.lng + (end.lng - start.lng) * factor);
  }

  isReady() {
    return this._state === MarkerMotionState.READY;
  }
  isMoving() {
    return this._state === MarkerMotionState.MOVING;
  }
  isPaused() {
    return this._state === MarkerMotionState.PAUSED;
  }
  isEnded() {
    return this._state === MarkerMotionState.ENDED;
  }
}

// Extend Leaflet namespace
declare module 'leaflet' {
  interface Marker {
    rotationAngle?: number;
    rotationOrigin?: string;
  }
}

export const markerMotion = (path: (L.LatLngExpression | number[])[], speedInKmH: number, options: MarkerMotionOptions = {}) => new MarkerMotion(path, speedInKmH, options);
