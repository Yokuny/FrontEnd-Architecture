import React from "react";
import TextSpan from "../../../Text/TextSpan";
import { ContainerChart } from "../../Utils";
import CardData from "./CardData";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(Math.floor(Math.random() * 100));

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 100) || 1);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const BatteryChargeChartDemo = (props) => {
  const { value } = useSetTimeout();

  return (
    <>
      <ContainerChart height={200} width={200} className="card-shadow">
        <TextSpan apparence="p2" hint style={{ marginTop: '1rem', marginBottom: -4 }}>
          Battery Charge
        </TextSpan>
        <div style={{ height: 180, width: 190 }}>
          <CardData percentual={value} modeState={1} />
        </div>
      </ContainerChart>
    </>
  );
};

export default BatteryChargeChartDemo;
