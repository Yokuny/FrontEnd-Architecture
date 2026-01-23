import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet.polylinemeasure/Leaflet.PolylineMeasure";
import "leaflet.polylinemeasure/Leaflet.PolylineMeasure.css";
import "./measuse.css";

const createPolylineMeasureLayer = ({ intl }) => {
  const instance = L.control.polylineMeasure({
    position: "topright",
    unit: "nauticalmiles",
    showBearings: false,
    clearMeasurementsOnStop: true,
    showClearControl: false,
    showUnitControl: true,
    clearControlTitle: intl.formatMessage({ id: "clear.measurements" }),
    unitControlTitle: {
      text: intl.formatMessage({ id: "change.unit" }),
      metres: intl.formatMessage({ id: "meters.kilometers" }),
      landmiles: intl.formatMessage({ id: "miles" }),
      nauticalmiles: intl.formatMessage({ id: "nautical.miles" }),
    },
    measureControlTitleOn: intl.formatMessage({ id: "measurement.turn.on" }),
    measureControlTitleOff: intl.formatMessage({ id: "measurement.turn.off" }),
    tooltipTextFinish: intl.formatMessage({ id: "tooltip.text.finish" }),
    tooltipTextDelete: intl.formatMessage({ id: "tooltip.text.delete" }),
    tooltipTextMove: intl.formatMessage({ id: "tooltip.text.move" }),
    tooltipTextResume: intl.formatMessage({ id: "tooltip.text.resume" }),
    tooltipTextAdd: intl.formatMessage({ id: "tooltip.text.add" }),
    measureControlClasses: ["measure-control"]
  });

  instance._getDistance = function(distance) {
    let dist = distance;
    let unit;
    
    if (this.options.unit === 'nauticalmiles') {
      const distInNm = dist / 1852;
      unit = this.options.unitControlLabel.nauticalmiles;
      
      if (distInNm >= 100) {
        dist = distInNm.toFixed(0);
      } else if (distInNm >= 10) {
        dist = distInNm.toFixed(1);
      } else if (distInNm >= 1) {
        dist = distInNm.toFixed(2);
      } else if (distInNm >= 0.01) {
        dist = distInNm.toFixed(3);
      } else {
        dist = distInNm.toFixed(4);
      }
    } else if (this.options.unit === 'landmiles') {
      unit = this.options.unitControlLabel.landmiles;
      if (dist >= 160934.4) {
        dist = (dist/1609.344).toFixed(0);
      } else if (dist >= 16093.44) {
        dist = (dist/1609.344).toFixed(1);
      } else if (dist >= 1609.344) {
        dist = (dist/1609.344).toFixed(2);
      } else {
        dist = (dist/0.3048).toFixed(0);
        unit = this.options.unitControlLabel.feet;
      }
    } else {
      unit = this.options.unitControlLabel.kilometres;
      if (dist >= 100000) {
        dist = (dist/1000).toFixed(0);
      } else if (dist >= 10000) {
        dist = (dist/1000).toFixed(1);
      } else if (dist >= 1000) {
        dist = (dist/1000).toFixed(2);
      } else {
        dist = (dist).toFixed(0);
        unit = this.options.unitControlLabel.metres;
      }
    }
    
    return {
      value: dist,
      unit: unit
    };
  };

  instance._changeUnit = function() {
    const unitControlEl = document.getElementById("unitControlId");
    if (unitControlEl && this._unitControl) {
      if (this.options.unit === "metres") {
        unitControlEl.innerHTML = this.options.unitControlLabel.kilometres || this.options.unitControlLabel.metres;
        this._unitControl.title = this.options.unitControlTitle.text + " [" + this.options.unitControlTitle.metres + "]";
      } else if (this.options.unit === "landmiles") {
        unitControlEl.innerHTML = this.options.unitControlLabel.landmiles;
        this._unitControl.title = this.options.unitControlTitle.text + " [" + this.options.unitControlTitle.landmiles + "]";
      } else if (this.options.unit === "nauticalmiles") {
        unitControlEl.innerHTML = this.options.unitControlLabel.nauticalmiles;
        this._unitControl.title = this.options.unitControlTitle.text + " [" + this.options.unitControlTitle.nauticalmiles + "]";
      }
    }

    if (this._currentLine) {
      this._computeDistance(this._currentLine);
    }
    
    if (this._arrPolylines) {
      this._arrPolylines.map(this._computeDistance.bind(this));
    }
  };

  return instance;
};

export default createControlComponent(
  createPolylineMeasureLayer
);


