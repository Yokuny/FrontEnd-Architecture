import React from "react";
import { withTheme } from "styled-components";
import TextSpan from "../../../../Text/TextSpan";
import { ContentChart } from "../../../Utils";

import { RadialGauge } from "react-canvas-gauges";
import { nanoid } from "nanoid";

const GaugeCompassChart = ({
  title,
  theme,
  value = 0,
  onClick = undefined,
}) => {
  const divBoxRef = React.useRef();

  const [width, setWidth] = React.useState();
  const [height, setHeight] = React.useState();

  React.useEffect(() => {
    if (divBoxRef.current?.offsetWidth) {
      setWidth(divBoxRef.current.offsetWidth);
      setHeight(divBoxRef.current.offsetHeight);
    }
  }, [divBoxRef?.current]);

  const id = nanoid();
  return (
    <ContentChart
      className="card-shadow"
      onClick={onClick}
      ref={divBoxRef}
    >
      <TextSpan apparence="p3" hint>{title || ""}</TextSpan>
      <div>
        {width && <RadialGauge
          key={id}
          id={id}
          minValue={0}
          maxValue={360}
          value={value || 0}
          majorTicks={["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"]}
          ticksAngle={360}
          startAngle={180}
          minorTicks={5}
          strokeTicks={false}
          highlights={false}
          colorPlate={theme.backgroundBasicColor1}
          colorMajorTicks={theme.textBasicColor}
          colorMinorTicks={theme.backgroundBasicColor1}
          colorNumbers={theme.textBasicColor}
          colorUnits={theme.textBasicColor}
          colorNeedle={theme.colorDanger500}
          colorNeedleEnd={theme.colorDanger500}
          valueBox={false}
          valueTextShadow={false}
          colorCircleInner={theme.backgroundBasicColor1}
          colorNeedleCircleOuter={theme.backgroundBasicColor1}
          needleCircleSize={0}
          needleCircleOuter={false}
          needleType="line"
          needleShadow={false}
          needleStart={70}
          needleEnd={99}
          needleWidth={9}
          borders={true}
          borderInnerWidth={0}
          numbersMargin={-4}
          borderMiddleWidth={0}
          borderOuterWidth={3}
          colorBorderOuter={theme.backgroundBasicColor1}
          colorBorderOuterEnd={theme.backgroundBasicColor1}
          animationDuration={1500}
          width={width - 50}
          height={height - 50}
          fontNumbersSize={35}
          animationTarget="plate"
          animateOnInit={true}
          useMinPath={true}
        />
        }
      </div>

      {!isNaN(value) && (
        <TextSpan style={{ marginTop: -12 }} apparence="s2">
          {value % 1 === 0 ? value : (value || 0)?.toFixed(1)}º
        </TextSpan>
      )}
    </ContentChart>
  );
};

export default withTheme(GaugeCompassChart);
