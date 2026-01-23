import React from "react";
import TextSpan from "../../../Text/TextSpan";
import Lottie from "react-lottie";
import { ContentChart } from "../../Utils";

export default function FailureChart({
  value,
  title,
  description,
  onClick = undefined,
}) {

  return (
    <ContentChart
      onClick={onClick}
      className="card-shadow"
    >
      {title && (
        <TextSpan apparence="s2" className="mt-2">
          {title}
        </TextSpan>
      )}
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: require(`./../../../../assets/lotties/${
            value !== true && value !== "true" ? "check" : "fail"
          }.json`),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        isPaused={false}
        isStopped={false}
        style={{ flexGrow: 1 }}
        height={"50%"}
        width={"50%"}
      />

      <TextSpan apparence="c1" className="mb-2">
        {description}
      </TextSpan>
    </ContentChart>
  );
}
