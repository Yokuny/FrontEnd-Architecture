import React from "react";
import { LinearGauge } from "react-canvas-gauges";
import { useTheme } from "styled-components";
import TextSpan from "../../../Text/TextSpan";
import { normalizeSizeDecimals } from "../../OptionsBase/SensorValueUse";
import { ContentChart } from "../../Utils";
import { getColorConditionList } from "../../Utils/TriggerCondition";

const TemperatureChart = ({
  title,
  description,
  data,
  value,
  onClick = undefined,
}) => {
  const divBoxRef = React.useRef();
  const theme = useTheme();
  const [width, setWidth] = React.useState();
  const [height, setHeight] = React.useState();

  React.useEffect(() => {
    if (divBoxRef.current?.offsetWidth) {
      setWidth(divBoxRef.current.offsetWidth);
      setHeight(divBoxRef.current.offsetHeight);
    }
  }, [divBoxRef]);

  let color = getColorConditionList(
    data?.colorsConditions,
    value,
    theme.colorPrimary500
  );

  const valueNormalized = normalizeSizeDecimals(value, data?.sizeDecimals)

  return (
    <ContentChart className="card-shadow" onClick={onClick} ref={divBoxRef}>
      <TextSpan apparence="p3" hint>{title || ""}</TextSpan>
      <div style={{ marginTop: -10, marginBottom: 10 }}>
        {width && (
          <LinearGauge
            value={valueNormalized}
            minValue={parseInt(data?.minValue || 0)}
            maxValue={parseInt(data?.maxValue || 100)}
            majorTicks={(data?.pointers || "0,20,40,60,80,100").split(",")}
            minorTicks={2}
            borders={false}
            highlights={[]}
            tickSide="left"
            numberSide="left"
            needleSide="left"
            animationRule="linear"
            needleType="arrow"
            dataType="linear"
            strokeTicks={false}
            startAngle={90}
            ticksAngle={180}
            valueBox={false}
            animationDuration={1500}
            barWidth={15}
            width={80}
            height={height - 40}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.backgroundBasicColor1}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            colorBorderShadow={theme.backgroundBasicColor1}
            colorBar={theme.colorBasicDefault}
            colorBarProgress={color}
            fontNumbersWeight={"500"}
            fontNumbersSize={35}
          />
        )}
      </div>
      <TextSpan style={{ bottom: 8, position: "absolute" }} apparence="s1">
        {valueNormalized !== undefined && `${valueNormalized} ${description || ''}`}
      </TextSpan>
    </ContentChart>
  );
};

export default TemperatureChart;
