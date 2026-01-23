import React from "react";
import { RadialGauge } from "react-canvas-gauges";
import TextSpan from "../../../../Text/TextSpan";
import { useTheme } from "styled-components";
import { ContentChart, urlRedirect } from "../../../Utils";
import { Row } from "@paljs/ui";
import { getColorConditionList } from "../../../Utils/TriggerCondition";
import { getBreakpointItemsGrouped } from "../../../Utils/SizeItemsGrouped";
// import { getBreakpointItemsGrouped } from "../../../Utils/SizeItemsGrouped";

const GroupedRadialGaugeChart = ({ title, sensorStates, data }) => {
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

  // let size = GetSize({ width, height, expected: 35 });

  let breakpoint = getBreakpointItemsGrouped(data.machines?.length);

  return (
    <ContentChart className="card-shadow" ref={divBoxRef}>
      <TextSpan apparence="s2" className="mt-1">{title || ""}</TextSpan>
      {!!width && !!height && <Row center middle>
        {data.machines?.map((machineItem, i) => {
          let value = sensorStates?.find(
            (x) =>
              x.idMachine === machineItem?.machine?.value &&
              x.idSendor === machineItem?.sensor?.value
          )?.value;


          let color = getColorConditionList(
            machineItem?.colorsConditions,
            value,
            theme.backgroundBasicColor1
          );

          return (
            <div
              className="mb-2 col-flex-center"
              key={i}
              style={{
                margin: 0,
                padding: 4,
                cursor: machineItem?.link ? "pointer" : "default",
                flexGrow: 1
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
                highlights={[]}
                animationDuration={1500}
                width={(width / (data?.machines?.length || 1)) - 15}
                height={height - 60}
                colorUnits={theme.textBasicColor}
                colorPlate={color}
                colorNumbers={theme.textBasicColor}
                colorMajorTicks={theme.textBasicColor}
                colorMinorTicks={theme.textBasicColor}
                fontNumbersWeight={"500"}
                fontNumbersSize={35}
                borderShadowWidth={0}
                numbersMargin={-8}
                valueBox={height > 100 ? -4 : -14}
              />
              <TextSpan apparence="s3">
                {machineItem?.description || machineItem?.machine?.label}
              </TextSpan>
            </div>
          );
        })}
      </Row>}
    </ContentChart>
  );
};

export default GroupedRadialGaugeChart;
