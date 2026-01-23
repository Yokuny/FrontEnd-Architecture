import { Col, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import Lottie from "react-lottie";
import TextSpan from "../../../../Text/TextSpan";
import { ContentChart, urlRedirect } from "../../../Utils";
import { getBreakpointItemsGrouped } from "../../../Utils/SizeItemsGrouped";

export default function GroupedFailuresCountChart({
  title,
  countSensorStates,
  data,
}) {
  const breakpoint = getBreakpointItemsGrouped(data.machines?.length);

  return (
    <ContentChart className="card-shadow pt-1">
      <TextSpan apparence="s2">{title || ""}</TextSpan>

      <Row
        center
        middle
        className="pl-1 pr-1"
        style={{ display: "flex", flexGrow: 1, flexDirection: 'row', alignItems: "center" }}
      >
        {data.machines?.map((machineItem, i) => {
          let value =
            countSensorStates?.find(
              (x) => x.idMachine == machineItem?.machine?.value
            )?.total ?? 0;

          return (
            <div
              className="mb-1 col-flex-center"
              style={{
                padding: 4,
                margin: 0,
                cursor: machineItem?.link ? "pointer" : "default",
                maxWidth: 100
              }}
              onClick={() => urlRedirect(machineItem?.link)}
            >
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: require(`./../../../../../assets/lotties/${
                    value > 0 ? "fail" : "check"
                  }.json`),
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice",
                  },
                }}
                isPaused={false}
                isStopped={false}
                style={{
                  flexGrow: 1,
                  width: "70%",
                  height: "70%",
                }}
              />
              <TextSpan apparence="s2">
                {`${value} `}
                <FormattedMessage id="failures" />
              </TextSpan>
              <TextSpan apparence="s4">
                {machineItem?.description || machineItem?.machine?.label}
              </TextSpan>
            </div>
          );
        })}
      </Row>
      <div></div>
    </ContentChart>
  );
}
