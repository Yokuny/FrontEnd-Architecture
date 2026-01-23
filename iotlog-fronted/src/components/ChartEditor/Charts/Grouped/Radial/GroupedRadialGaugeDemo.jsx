import React from "react";
import { RadialGauge } from "react-canvas-gauges";
import TextSpan from "../../../../Text/TextSpan";
import { withTheme } from "styled-components";
import { ContainerChart } from "../../../Utils";
import { FormattedMessage } from "react-intl";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(5);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 100));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const GroupedRadialGaugeDemo = ({
  title,
  description,
  theme,
  height = 200,
  width = 200
}) => {

  const { value } = useSetTimeout();

  return (
    <>
      <ContainerChart
        width={width}
        height={height}
        className="card-shadow"
      >
        <TextSpan apparence="s2"><FormattedMessage id="radial"/></TextSpan>
        <div>
          <div style={{ width: "100%" }} className="mb-2">
            <RadialGauge
              units={description}
              value={value}
              minValue={0}
              maxValue={100}
              majorTicks={("0,20,40,60,80,100").split(",")}
              minorTicks={2}
              borders={false}
              highlights={[]}
              animationDuration={1500}
              width={60}
              height={50}
              colorUnits={theme.textBasicColor}
              colorPlate={theme.colorSuccess500}
              colorNumbers={theme.textBasicColor}
              colorMajorTicks={theme.textBasicColor}
              colorMinorTicks={theme.textBasicColor}
              fontNumbersWeight={"500"}
              fontNumbersSize={20}
              borderShadowWidth={0}
              valueBox={false}
            />
            <RadialGauge
              units={description}
              value={value * 0.2}
              minValue={0}
              maxValue={100}
              majorTicks={("0,20,40,60,80,100").split(",")}
              minorTicks={2}
              borders={false}
              highlights={[]}
              animationDuration={1500}
              width={60}
              height={50}
              colorUnits={theme.textBasicColor}
              colorPlate={theme.colorSuccess500}
              colorNumbers={theme.textBasicColor}
              colorMajorTicks={theme.textBasicColor}
              colorMinorTicks={theme.textBasicColor}
              fontNumbersWeight={"500"}
              fontNumbersSize={20}
              borderShadowWidth={0}
              valueBox={false}
            />
            <RadialGauge
              units={description}
              value={value * 0.3}
              minValue={0}
              maxValue={100}
              majorTicks={("0,20,40,60,80,100").split(",")}
              minorTicks={2}
              borders={false}
              highlights={[]}
              animationDuration={1500}
              width={60}
              height={50}
              colorUnits={theme.textBasicColor}
              colorPlate={theme.colorSuccess500}
              colorNumbers={theme.textBasicColor}
              colorMajorTicks={theme.textBasicColor}
              colorMinorTicks={theme.textBasicColor}
              fontNumbersWeight={"500"}
              fontNumbersSize={20}
              borderShadowWidth={0}
              valueBox={false}
            />
          </div>
          <RadialGauge
            units={description}
            value={value * 0.1}
            minValue={0}
            maxValue={100}
            majorTicks={("0,20,40,60,80,100").split(",")}
            minorTicks={2}
            borders={false}
            highlights={[]}
            animationDuration={1500}
            width={60}
            height={50}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.colorSuccess500}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            fontNumbersWeight={"500"}
            fontNumbersSize={20}
            borderShadowWidth={0}
            valueBox={false}
          />
          <RadialGauge
            units={description}
            value={value * 0.4}
            minValue={0}
            maxValue={100}
            majorTicks={("0,20,40,60,80,100").split(",")}
            minorTicks={2}
            borders={false}
            highlights={[]}
            animationDuration={1500}
            width={60}
            height={50}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.colorDanger500}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            fontNumbersWeight={"500"}
            fontNumbersSize={20}
            borderShadowWidth={0}
            valueBox={false}
          />
          <RadialGauge
            units={description}
            value={value * 0.7}
            minValue={0}
            maxValue={100}
            majorTicks={("0,20,40,60,80,100").split(",")}
            minorTicks={2}
            borders={false}
            highlights={[]}
            animationDuration={1500}
            width={60}
            height={50}
            colorUnits={theme.textBasicColor}
            colorPlate={theme.colorSuccess500}
            colorNumbers={theme.textBasicColor}
            colorMajorTicks={theme.textBasicColor}
            colorMinorTicks={theme.textBasicColor}
            fontNumbersWeight={"500"}
            fontNumbersSize={20}
            borderShadowWidth={0}
            valueBox={false}
          />
        </div>
        <div></div>
      </ContainerChart>
    </>
  );
};

export default withTheme(GroupedRadialGaugeDemo);
