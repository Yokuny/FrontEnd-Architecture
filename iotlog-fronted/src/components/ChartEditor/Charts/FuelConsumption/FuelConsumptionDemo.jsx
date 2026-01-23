import React from "react";
import { useTheme } from "styled-components";
import { OilMeter } from "../../../Icons";
import TextSpan from "../../../Text/TextSpan";
import { ContainerChart } from "../../Utils";

export default function FuelConsumptionDemo(props) {

  const { height = 200, width = 200 } = props;

  const theme = useTheme();

  return (
    <ContainerChart height={height} width={width} className="card-shadow">
      <TextSpan apparence="s2" className="mt-3">
        Fuel Consumption
      </TextSpan>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>

        <div
          style={{
            width: 'calc(100% - 2rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 164
          }}
        >

          <div>
            <OilMeter
              style={{
                height: 24,
                width: 24,
                fill: theme.colorPrimary500,
                marginRight: 6
              }}
            />
            <TextSpan apparence="h3">253,7</TextSpan>
            <TextSpan apparence="s3" className="ml-1">L</TextSpan>
          </div>

        </div>

      </div>
    </ContainerChart>
  );
}
