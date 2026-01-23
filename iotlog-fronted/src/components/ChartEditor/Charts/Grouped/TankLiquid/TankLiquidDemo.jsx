import { Col, Row } from "@paljs/ui";
import React from "react";
import TextSpan from "../../../../Text/TextSpan";
import LiquidFillGauge from "react-liquid-gauge";
import { ContainerChart } from "../../../Utils";
import { FormattedMessage } from "react-intl";
import { withTheme } from "styled-components";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(5);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 20));
    }, 4000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const TankLiquidDemo = ({
  title,
  description,
  theme,
  height = 200,
  width = 200,
}) => {
  const { value } = useSetTimeout();

  const gradientStops = [
    {
      key: "0%",
      stopColor: theme.colorPrimary100,
      stopOpacity: 1,
      offset: "0%",
    },
    {
      key: "50%",
      stopColor: theme.colorPrimary300,
      stopOpacity: 0.75,
      offset: "50%",
    },
    {
      key: "100%",
      stopColor: theme.colorPrimary600,
      stopOpacity: 0.5,
      offset: "100%",
    },
  ];

  const gradientErro = [
    {
      key: "0%",
      stopColor: theme.colorDanger100,
      stopOpacity: 1,
      offset: "0%",
    },
    {
      key: "50%",
      stopColor: theme.colorDanger300,
      stopOpacity: 0.75,
      offset: "50%",
    },
    {
      key: "100%",
      stopColor: theme.colorDanger600,
      stopOpacity: 0.5,
      offset: "100%",
    },
  ];

  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow">
        <TextSpan apparence="s2">
          <FormattedMessage id="volume" />
        </TextSpan>

        <Row middle="xs" center="xs" style={{ maxWidth: width - 20 }}>
          {new Array(6).fill().map((x, i) => (
            <Col breakPoint={{ md: 4 }} className="pl-2 pr-2" key={i}>
              <LiquidFillGauge
                width={40}
                height={50}
                value={value * i}
                percent="%"
                textSize={1}
                textOffsetX={0}
                textOffsetY={0}
                textRenderer={(props) => {
                  return (
                    <tspan>
                      <tspan
                        x="0"
                        y="0.3em"
                        style={{ fontSize: 20 }}
                        className="value"
                      >
                        {value * i}l
                      </tspan>
                    </tspan>
                  );
                }}
                riseAnimation
                waveAnimation
                waveFrequency={2}
                waveAmplitude={1}
                gradient
                innerRadius={0.94}
                gradientStops={(value * i) % 2 === 0 ? gradientStops : gradientErro}
                circleStyle={{
                  fill: (value * i) % 2 === 0 ? theme.colorPrimary500 : theme.colorDanger500,
                }}
                waveStyle={{
                  fill: "##B4FEF9",
                }}
                textStyle={{
                  fill: theme.textBasicColor,
                }}
                waveTextStyle={{
                  fill: theme.textBasicColor,
                }}
              />
            </Col>
          ))}
        </Row>
        <div></div>
      </ContainerChart>
    </>
  );
};

export default withTheme(TankLiquidDemo);
