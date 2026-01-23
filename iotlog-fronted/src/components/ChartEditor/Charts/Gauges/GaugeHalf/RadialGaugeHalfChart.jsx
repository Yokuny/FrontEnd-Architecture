import React from "react";
import { RadialGauge } from "react-canvas-gauges";
import TextSpan from "../../../../Text/TextSpan";
import { useTheme } from "styled-components";
import { ContentChart } from "../../../Utils";
import { getColorConditionList } from "../../../Utils/TriggerCondition";

const RadialGaugeHalfChart = ({
  value,
  title,
  description,
  data,
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

  const maxvalue = parseInt(data?.maxValue || 0);

  let highlights = []

  let color = getColorConditionList(data?.colorsConditions, value, '')

  if (color) {
    highlights.push({ from: 0, to: maxvalue, color: color })
  }

  return (
    <>
      <ContentChart
        className="card-shadow"
        onClick={onClick}
        ref={divBoxRef}
      >
        <TextSpan apparence="p2" hint>{title || ""}</TextSpan>
        <div style={{ marginTop: -10 }} className="ml-2">
          <RadialGauge
            key="chart-half"
            units={description}
            value={value ?? 0}
            minValue={0}
            maxValue={maxvalue}
            majorTicks={(data?.pointers || "0,20,40,60,80,100").split(",")}
            minorTicks={2}
            borders={false}
            highlights={highlights}
            animationDuration={1500}
            width={width - 25}
            height={height - 40}
            colorUnits={theme.textBasicColor}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            fontNumbersWeight={"500"}
            fontNumbersSize={35}
            animationRule="linear"
            startAngle={0}
            valueBox={false}
            ticksAngle={180}
            borderShadowWidth={0}
            numbersMargin={-4}
            colorPlate={theme.backgroundBasicColor1}
            colorBorderOuter={theme.backgroundBasicColor1}
            colorBorderOuterEnd={theme.backgroundBasicColor}
          />
        </div>
      </ContentChart>
    </>
  );
};

export default RadialGaugeHalfChart;
