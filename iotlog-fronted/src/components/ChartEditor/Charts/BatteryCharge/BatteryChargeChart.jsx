import React from "react";
import { ContentChart } from "../../Utils";
import TextSpan from "../../../Text/TextSpan";
import CardData from "./CardData";

export default function BatteryChargeChart({
  percentual,
  status,
  title,
  onClick = undefined
}) {
  return (
    <ContentChart
      className="card-shadow"
      style={{ cursor: !!onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <TextSpan apparence="p2" hint className="mt-4">
        {title}
      </TextSpan>
      <CardData percentual={percentual} modeState={status} />
    </ContentChart>
  );
}
