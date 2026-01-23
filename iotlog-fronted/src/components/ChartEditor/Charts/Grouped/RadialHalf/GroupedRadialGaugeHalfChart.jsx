import React from "react";
import { RadialGauge } from "react-canvas-gauges";
import TextSpan from "../../../../Text/TextSpan";
import { useTheme, withTheme } from "styled-components";
import { ContainerChart, ContentChart, GetSize, urlRedirect } from "../../../Utils";
import { Col, Row } from "@paljs/ui";
import { getColorConditionList } from "../../../Utils/TriggerCondition";
import { getBreakpointItemsGrouped } from "../../../Utils/SizeItemsGrouped";

const GroupedRadialGaugeHalfChart = ({
  title,
  sensorStates,
  data,
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

  const breakpoint = getBreakpointItemsGrouped(data?.machines?.length);

  return (
      <ContentChart className="card-shadow" ref={divBoxRef}>
        <TextSpan apparence="p3" hint className="mt-1">{title || ""}</TextSpan>
        {width && <Row
          center
          middle
          style={{ alignItems: "start" }}
          className="pl-4 pr-4"
        >
          {data.machines?.map((machineItem, i) => {
            let value = sensorStates?.find(
              (x) =>
                x.idMachine === machineItem?.machine?.value &&
                x.idSensor === machineItem?.sensor?.value
            )?.value;

            let color = getColorConditionList(machineItem?.colorsConditions, value, theme.colorSuccess500)

            return (
              <Col
              breakPoint={breakpoint}
                className="mb-2 col-flex-center"
                key={i}
                style={{
                  margin: 0,
                  padding: 4,
                  cursor: machineItem?.link ? "pointer" : "default",
                }}
                onClick={() => urlRedirect(machineItem?.link)}
              >
                <RadialGauge
                  value={value}
                  minValue={parseInt(machineItem?.minValue || 0)}
                  maxValue={parseInt(machineItem?.maxValue || 0)}
                  majorTicks={(
                    machineItem?.pointers || "0,20,40,60,80,100"
                  ).split(",")}
                  minorTicks={2}
                  borders={false}
                  highlights={[{}]}
                  animationDuration={1500}
                  width={(width / (data?.machines?.length || 1)) - 15}
                  height={height - 60}
                  colorUnits={color}
                  colorPlate={theme.backgroundBasicColor1}
                  colorNumbers={theme.textBasicColor}
                  colorMajorTicks={color}
                  colorMinorTicks={color}
                  fontNumbersWeight={"500"}
                  fontNumbersSize={35}
                  animationRule="linear"
                  startAngle={180}
                  valueBox={false}
                  ticksAngle={180}
                  borderShadowWidth={0}
                  numbersMargin={height > 100 ? -4 : -14}
                />
                <TextSpan apparence="s3" hint className="mt-1">
                {machineItem?.description || machineItem?.machine?.label}
                </TextSpan>
              </Col>
            );
          })}
        </Row>}
      </ContentChart>
  );
};

export default GroupedRadialGaugeHalfChart;
