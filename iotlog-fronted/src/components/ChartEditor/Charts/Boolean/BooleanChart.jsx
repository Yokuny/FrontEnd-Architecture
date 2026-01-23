import React from "react";
import TextSpan from "../../../Text/TextSpan";
import { ContentChart } from "../../Utils";

export default function BooleanChart({
  value,
  title,
  description,
  onClick = undefined,
}) {
  return (
    <>
      <ContentChart className="card-shadow" onClick={onClick}>
        <TextSpan apparence="s2" className="mt-2">
          {title || ""}
        </TextSpan>

        <TextSpan apparence="h1">{!!value ? "On" : "Off"}</TextSpan>
        <TextSpan apparence="c1" className="mb-2">
          {description || ""}
        </TextSpan>
      </ContentChart>
    </>
  );
}
