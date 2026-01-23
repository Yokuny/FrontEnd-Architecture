import React from "react";
import { LinearGauge } from "react-canvas-gauges";
import Row from "@paljs/ui/Row";
import TextSpan from "../../../../Text/TextSpan";
import styled, { useTheme } from "styled-components";
import { ContentChart, urlRedirect } from "../../../Utils";
import { getColorConditionList } from "../../../Utils/TriggerCondition";
import { floatToStringExtendDot } from "../../../../Utils";
import GaugeTemp from "./GaugeTemp";


const GroupedTemperatureChart = ({ title, sensorStates, data }) => {
  const theme = useTheme();

  return (
    <ContentChart className="card-shadow">

      <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'flex-start',
        flexWrap: 'wrap',
        height: '100%',
        gap: 0,
      }}>
        {data.machines?.map((machineItem, i) => {
          let sensorStateItem = sensorStates?.find(
            (x) =>
              x.idMachine === machineItem?.machine?.value &&
              x.idSensor === machineItem?.sensor?.value
          );

          let value = sensorStateItem?.value;

          let color = getColorConditionList(
            machineItem?.colorsConditions,
            value,
            theme.colorInfo500
          );

          return (
            <>
              <GaugeTemp
                key={`${i}-t-l`}
                color={color}
                value={value}
                title={machineItem?.description || machineItem?.machine?.label}
                className="pb-1"
                valueMin={parseInt(machineItem?.minValue || 0)}
                valueMax={parseInt(machineItem?.maxValue || 100)}
              />
            </>

            // <div
            //   className="mb-4 col-flex-center"
            //   key={`${i}`}
            //   style={{
            //     padding: 4,
            //     margin: 0,
            //     cursor: machineItem?.link ? "pointer" : "default",
            //     flexGrow: 1,
            //   }}
            //   onClick={() => urlRedirect(machineItem?.link)}
            // >
            //   <TextSpan apparence="s3" hint style={{ marginTop: -1 }}>
            //     {machineItem?.description || machineItem?.machine?.label}
            //   </TextSpan>
            //   <LinearGauge
            //     value={value}
            //     minValue={parseInt(machineItem?.minValue || 0)}
            //     maxValue={parseInt(machineItem?.maxValue || 100)}
            //     majorTicks={(
            //       machineItem?.pointers || "0,20,40,60,80,100"
            //     ).split(",")}
            //     minorTicks={2}
            //     borders={false}
            //     highlights={[]}
            //     tickSide="left"
            //     numberSide="left"
            //     needleSide="left"
            //     animationRule="linear"
            //     needleType="arrow"
            //     dataType="linear"
            //     strokeTicks={false}
            //     startAngle={90}
            //     ticksAngle={180}
            //     valueBox={false}
            //     animationDuration={1500}
            //     width={75}
            //     barWidth={15}
            //     height={height - 70}
            //     colorUnits={theme.textBasicColor}
            //     colorPlate={theme.backgroundBasicColor1}
            //     colorNumbers={theme.textBasicColor}
            //     colorMajorTicks={theme.textBasicColor}
            //     colorMinorTicks={theme.textBasicColor}
            //     colorBorderShadow={theme.backgroundBasicColor1}
            //     colorBar={theme.colorBasicDefault}
            //     colorBarProgress={color}
            //     fontNumbersWeight={"500"}
            //     fontNumbersSize={35}
            //   />
            //   <TextSpan apparence="s2" style={{ marginTop: -9 }}>
            //     {value !== undefined ? `${floatToStringExtendDot(value,1)} ºC`  : '-'}
            //   </TextSpan>
            // </div>
          );
        })}
      </div>

    </ContentChart>
  );
};

export default GroupedTemperatureChart;
