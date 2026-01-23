import React from "react";
import { LinearGauge } from "react-canvas-gauges";
import TextSpan from "../../../../Text/TextSpan";
import { withTheme } from "styled-components";
import { FormattedMessage } from "react-intl";
import { ContainerChart } from "../../../Utils";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(5);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 100));
    }, 4000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const GroupedTemperatureDemo = ({
  theme,
  height = 200,
  width = 200,
  onClick = undefined
}) => {

  const { value } = useSetTimeout();

  return (
    <>
      <ContainerChart
        width={width}
        height={height}
        className="card-shadow"
        style={{ cursor: !!onClick ? 'pointer' : 'default' }}
        onClick={onClick}
      >
        <TextSpan apparence="s2"><FormattedMessage id="temperature" /></TextSpan>
        <div>
          <div style={{ width: '100%' }}>
          <LinearGauge
            value={value * 1}
            minValue={0}
            maxValue={100}
            majorTicks={("0,20,40,60,80,100").split(",")}
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
            width={50}
            barWidth={15}
            height={70}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.backgroundBasicColor1}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            colorBorderShadow={theme.backgroundBasicColor1}
            colorBar={theme.colorBasicDefault}
            colorBarProgress={theme.colorSuccess500}
            fontNumbersWeight={"500"}
            fontNumbersSize={35}
          />
          <LinearGauge
            value={value * 2}
            minValue={0}
            maxValue={100}
            majorTicks={("0,20,40,60,80,100").split(",")}
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
            width={50}
            barWidth={15}
            height={70}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.backgroundBasicColor1}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            colorBorderShadow={theme.backgroundBasicColor1}
            colorBar={theme.colorBasicDefault}
            colorBarProgress={theme.colorSuccess500}
            fontNumbersWeight={"500"}
            fontNumbersSize={35}
          />
          <LinearGauge
            value={(value * 1 ) - 10}
            minValue={0}
            maxValue={100}
            majorTicks={("0,20,40,60,80,100").split(",")}
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
            width={50}
            barWidth={15}
            height={70}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.backgroundBasicColor1}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            colorBorderShadow={theme.backgroundBasicColor1}
            colorBar={theme.colorBasicDefault}
            colorBarProgress={theme.colorSuccess500}
            fontNumbersWeight={"500"}
            fontNumbersSize={35}
          />
          </div>
          <LinearGauge
            value={(value * 0.2 )}
            minValue={0}
            maxValue={100}
            majorTicks={("0,20,40,60,80,100").split(",")}
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
            width={50}
            barWidth={15}
            height={70}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.backgroundBasicColor1}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            colorBorderShadow={theme.backgroundBasicColor1}
            colorBar={theme.colorBasicDefault}
            colorBarProgress={theme.colorSuccess500}
            fontNumbersWeight={"500"}
            fontNumbersSize={35}
          />
          <LinearGauge
            value={value * 0.5}
            minValue={0}
            maxValue={100}
            majorTicks={("0,20,40,60,80,100").split(",")}
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
            width={50}
            barWidth={15}
            height={70}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.backgroundBasicColor1}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            colorBorderShadow={theme.backgroundBasicColor1}
            colorBar={theme.colorBasicDefault}
            colorBarProgress={theme.colorSuccess500}
            fontNumbersWeight={"500"}
            fontNumbersSize={35}
          />
          <LinearGauge
            value={value * 0.6}
            minValue={0}
            maxValue={100}
            majorTicks={("0,20,40,60,80,100").split(",")}
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
            width={50}
            barWidth={15}
            height={70}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.backgroundBasicColor1}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            colorBorderShadow={theme.backgroundBasicColor1}
            colorBar={theme.colorBasicDefault}
            colorBarProgress={theme.colorDanger500}
            fontNumbersWeight={"500"}
            fontNumbersSize={35}
          />
        </div>
      </ContainerChart>
    </>
  );
};

export default withTheme(GroupedTemperatureDemo);
