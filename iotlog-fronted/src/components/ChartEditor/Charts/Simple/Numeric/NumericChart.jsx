import React from "react";
import TextSpan from "../../../../Text/TextSpan";
import { ContentChart } from "../../../Utils";
import { floatToStringBrazilian, floatToStringExtendDot } from "../../../../Utils";

export default function NumericChart({
  value,
  title,
  data,
  description,
  onClick = undefined,
}) {
  return (
    <ContentChart
      className="card-shadow"
      style={{ cursor: !!onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <TextSpan apparence="p3" hint className="mt-2">
        {title || ""}
      </TextSpan>

      <TextSpan apparence="h1" style={{ fontSize: "2.6rem" }}>
        {!!data?.sizeDecimal || data?.sizeDecimal === 0
          ? floatToStringExtendDot(value, data.sizeDecimal)
          : value}
      </TextSpan>

      <TextSpan apparence="c2" hint className="mb-2">
        {description || ""}
      </TextSpan>
    </ContentChart>
  );
}
