import { Col, Row } from "@paljs/ui";
import chroma from 'chroma-js';
import React from "react";
import LiquidFillGauge from "react-liquid-gauge";
import { useTheme } from "styled-components";
import TextSpan from "../../../../Text/TextSpan";
import { ContentChart, urlRedirect } from "../../../Utils";
import { getBreakpointItemsGrouped } from "../../../Utils/SizeItemsGrouped";
import { getColorConditionList } from "../../../Utils/TriggerCondition";

const TankLiquidChart = ({
  title,
  sensorStates,
  data
}) => {
  const theme = useTheme();

  const gradientStops = (color) => [
    {
      key: "0%",
      stopColor: chroma(color).brighten(3),
      stopOpacity: 1,
      offset: "0%",
    },
    {
      key: "50%",
      stopColor: chroma(color).brighten(2),
      stopOpacity: 0.75,
      offset: "50%",
    },
    {
      key: "100%",
      stopColor: chroma(color).saturate(),
      stopOpacity: 0.5,
      offset: "100%",
    },
  ];


  const divBoxRef = React.useRef();
  const [width, setWidth] = React.useState();
  const [height, setHeight] = React.useState();

  React.useEffect(() => {
    if (divBoxRef.current?.offsetWidth) {
      setWidth(divBoxRef.current.offsetWidth);
      setHeight(divBoxRef.current.offsetHeight);
    }
  }, [divBoxRef]);

  // let size = GetSize({ width, height, expected: 33 })
  let breakpoint = getBreakpointItemsGrouped(data.machines?.length);

  function formatValue(value, decimals) {
    if (value === undefined || value === null) return ['0', ''];

    const hasDecimals = value.toString().includes('.');

    if (!hasDecimals) {
      value = parseFloat(value).toFixed(decimals);

    } else {
      const [integerPart, decimalPartDirty] = value.toString().split('.');
      const decimalPart = decimalPartDirty.padEnd(decimals, '0');

      return [integerPart, `,${decimalPart}`];
    };

    const [integerPart, decimalPartDirty] = value.split('.');
    const decimalPart = decimalPartDirty ? `,${decimalPartDirty}` : '';

    return [integerPart, decimalPart];
  };

  function getMeasures(width, height) {

    let integerPartFontSize;
    let decimalPartFontSize;
    let unitAxis;

    if ((width > 100 && width <= 150) && (height > 100 && height <= 150)) {
      integerPartFontSize = '1.25rem';
      decimalPartFontSize = '1rem';
      unitAxis = '1.75rem';

    } else if ((width > 150 && width <= 300) && (height > 150 && height <= 300)) {
      integerPartFontSize = '2rem';
      decimalPartFontSize = '1.75rem';
      unitAxis = '3rem';

    } else if ((width > 300 && width <= 500) && (height > 300 && height <= 500)) {
      integerPartFontSize = '3.5rem';
      decimalPartFontSize = '3rem';
      unitAxis = '6rem';

    } else if ((width > 500 && width <= 750) && (height > 300 && height <= 500)) {
      integerPartFontSize = '5rem';
      decimalPartFontSize = '4rem';
      unitAxis = '6rem';

    } else {
      integerPartFontSize = '1rem';
      decimalPartFontSize = '0.75rem';
      unitAxis = '1.75rem';
    }

    return [integerPartFontSize, decimalPartFontSize, unitAxis];
  }

  return (

    <ContentChart className="card-shadow" ref={divBoxRef}>
      <TextSpan apparence="p3" hint>
        {title || ""}
      </TextSpan>

      <Row middle="xs" center="xs" className="pl-1 pr-1">
        {data.machines?.map((machineItem, i) => {
          let value = sensorStates?.find(
            (x) =>
              x.idMachine == machineItem?.machine?.value &&
              x.idSensor == machineItem?.sensor?.value
          )?.value;

          const percentual = machineItem?.maxValue
            ? (value * 100) / parseInt(machineItem?.maxValue)
            : value

          let color = getColorConditionList(machineItem?.colorsConditions, value, theme.colorPrimary500)
          let colorFill = chroma(color).saturate(2).hex()

          return (
            <Col
              breakPoint={breakpoint}
              className="mb-2 col-flex-center"
              key={i}
              style={{
                cursor: machineItem?.link ? "pointer" : "default",
                padding: 4,
                margin: 0
              }}
              onClick={() => urlRedirect(machineItem?.link)}
            >
              <LiquidFillGauge
                width={(width / (data?.machines?.length || 1)) - 15}
                height={height - 60}
                value={percentual}
                percent="%"
                displayPercent={false}
                textSize={1}
                textOffsetX={0}
                textOffsetY={0}
                textRenderer={(props) => {

                  const [integerPart, decimalPart] = formatValue(value, (machineItem.decimals || '0'))
                  const [integerPartFontSize, decimalPartFontSize, unitAxis] = getMeasures(props.width, props.height);

                  return (
                    <tspan>
                      <tspan
                        x="0"
                        y="0.3em"
                        className="value"
                      >
                        <tspan
                          style={{ fontSize: integerPartFontSize }}
                          className="value"
                        >
                          {integerPart}
                        </tspan>
                        {machineItem.decimals && Number(machineItem.decimals) > 0 && (
                          <tspan
                            style={{ fontSize: decimalPartFontSize }}
                            className="value"
                          >
                            {decimalPart}
                          </tspan>
                        )}
                      </tspan>

                      <tspan
                        x="0"
                        y={unitAxis}
                        style={{ fontSize: '1rem', fontWeight: '700' }}
                        className="value"
                      >
                        {machineItem?.unit || ""}
                      </tspan>
                    </tspan>
                  )
                }}
                riseAnimation
                waveAnimation
                waveFrequency={2}
                waveAmplitude={1}
                gradient
                gradientStops={gradientStops(color)}
                innerRadius={0.94}
                circleStyle={{
                  fill: color,
                }}
                waveStyle={{
                  fill: colorFill,
                }}
                textStyle={{
                  fill: theme.textBasicColor,
                }}
                waveTextStyle={{
                  fill: theme.textBasicColor,
                }}
              />
              <TextSpan
                apparence="s3"
                hint
              >
                {machineItem?.description || machineItem?.machine?.label}
              </TextSpan>
            </Col>
          )
        })}
      </Row>
    </ContentChart >
  );
};

export default TankLiquidChart;
