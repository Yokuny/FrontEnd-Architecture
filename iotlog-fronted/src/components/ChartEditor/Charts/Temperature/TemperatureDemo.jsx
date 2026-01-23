import React from "react";
import { LinearGauge } from "react-canvas-gauges";
import TextSpan from "../../../Text/TextSpan";
import { withTheme } from "styled-components";
import { FormattedMessage } from "react-intl";
import { ContainerChart } from "../../Utils";

const TemperatureDemo = ({
  theme,
  value = 20,
  height = 150,
  width = 150,
}) => {
  return (
    <>
      <ContainerChart width={width} height={height} className="card-shadow">
        <TextSpan apparence="s2"><FormattedMessage id="temperature"/></TextSpan>
        <div style={{marginBottom: 15 }}>
          <LinearGauge
            value={value}
            minValue={-20}
            maxValue={40}
            majorTicks={"-20,0,20,40".split(",")}
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
            width={60}
            barWidth={25}
            height={100}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.backgroundBasicColor1}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            colorBorderShadow={theme.backgroundBasicColor1}
            colorBar={theme.colorBasicDefault}
            colorBarProgress={theme.colorPrimary500}
            fontNumbersWeight={"500"}
            fontNumbersSize={35}
          />
        </div>
        <TextSpan style={{ bottom: 35, position: 'absolute' }} apparence="h6">{`${value} ºC`}</TextSpan>
      </ContainerChart>
    </>
  );
};

export default withTheme(TemperatureDemo);
