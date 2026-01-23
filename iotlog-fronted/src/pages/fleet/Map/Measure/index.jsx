import { Button } from "@paljs/ui/Button";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useMap } from "react-leaflet";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import { Measure } from "../../../../components/Icons";
import TrackingService from "../../../../services/TrackingService";
import PolylineMeasureComponent from "./PolylineMeasure/PolylineMeasureComponent";
import { setIsShowMeasureLine, setPointsMeasureLine } from "../../../../actions";

const PolylineMeasure = (props) => {
  const intl = useIntl();
  const theme = useTheme();
  const refMeasure = React.useRef();
  const refStarted = React.useRef(false);

  const [points, setPoints] = React.useState([]);

  const { setIsShowMeasureLine, isShowMeasureLine, setPointsMeasureLine, unitMeasureLine } = props;

  const map = useMap();

  const getButtonStyle = (isActive = false) => ({
    padding: 6,
    boxShadow: `0px 2px 8px ${theme.shadowColor || "rgba(0, 0, 0, 0.05)"}`,
    border: `1px solid ${theme.borderBasicColor3 || theme.backgroundBasicColor3}`,
    borderRadius: "0.4rem",
    height: "35px",
    width: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    background: isActive ? theme.colorInfo500 : theme.backgroundBasicColor1,
    color: isActive ? theme.textControlColor : theme.colorInfo500,
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: `0 6px 12px ${theme.shadowColor || "rgba(0, 0, 0, 0.15)"}`,
    },
  });

  useEffect(() => {
    if (refMeasure.current) {
      if (refMeasure.current._measuring) return;
      refMeasure.current._toggleMeasure();
      refStarted.current = true;
    }
  });

  useEffect(() => {
    setPointsMeasureLine(points);
  }, [points]);

  useEffect(() => {
    if (refStarted.current && refMeasure.current) {
      if (unitMeasureLine === "nm") {
        refMeasure.current.options.unit = "nauticalmiles";
      } else {
        refMeasure.current.options.unit = "metres";
      }
      refMeasure.current._changeUnit();
    }
  }, [unitMeasureLine]);

  useEffect(() => {
    if (refStarted.current && !isShowMeasureLine) {
      map.invalidateSize();
    }
  }, [isShowMeasureLine]);

  useEffect(() => {
    map.on("polylinemeasure:start", (currentLine) => {
      setPoints((state) => {
        if (!state.some((point) => point.id === currentLine.id)) {
          return [...state, { id: currentLine.id, points: currentLine.circleCoords || [] }];
        }

        return state;
      });
    });

    map.on("polylinemeasure:change", (currentLine) => {
      setPoints((state) =>
        state.map((point) =>
          point.id === currentLine.id ? { id: currentLine.id, points: currentLine.circleCoords } : point
        )
      );
    });

    map.on("polylinemeasure:clear", () => {
      setPoints([]);
    });
  }, [map]);

  const onChangeMeasureView = (e) => {
    e.preventDefault();
    if (!isShowMeasureLine) {
      TrackingService.saveTracking({
        pathname: window.location.pathname,
        action: "MEASURE",
      });
    } else {
      refMeasure.current._clearAllMeasurements();
    }

    setIsShowMeasureLine(!isShowMeasureLine);
  };

  const changeUnit = () => {
    if (unitMeasureLine === "nm") {
      refMeasure.current.options.unit = "nauticalmiles";
    } else {
      refMeasure.current.options.unit = "metres";
    }
    refMeasure.current._changeUnit();
  };

  return (
    <>
      <Button
        size="Medium"
        status={isShowMeasureLine ? "Info" : "Control"}
        style={getButtonStyle(isShowMeasureLine)}
        onClick={(e) => onChangeMeasureView(e)}>
        <Measure
          style={{
            height: 20,
            width: 20,
            fill: isShowMeasureLine ? theme.textControlColor : theme.colorInfo500,
          }}
        />
      </Button>
      {isShowMeasureLine && (
        <>
          <PolylineMeasureComponent ref={refMeasure} intl={intl} {...props} />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  isShowMeasureLine: state.map.isShowMeasureLine,
  pointsMeasureLine: state.map.pointsMeasureLine,
  unitMeasureLine: state.map.unitMeasureLine,
});

const mapDispatchToProps = (dispatch) => ({
  setIsShowMeasureLine: (isLoading) => {
    dispatch(setIsShowMeasureLine(isLoading));
  },
  setPointsMeasureLine: (points) => {
    dispatch(setPointsMeasureLine(points));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PolylineMeasure);
