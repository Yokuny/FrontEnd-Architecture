import { Col, Row } from "@paljs/ui";
import React from "react";
import { useTheme, withTheme } from "styled-components";
import { PowerOnOff } from "../../../../Icons";
import TextSpan from "../../../../Text/TextSpan";
import { ContentChart, urlRedirect } from "../../../Utils";
import { getBreakpointItemsGrouped } from "../../../Utils/SizeItemsGrouped";

const OnOffChart = ({
  title,
  sensorStates,
  data,
}) => {

  const theme = useTheme();

  const getValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return undefined
    }

    if (value === true) {
      return true;
    }

    if (!isNaN(value) && value > 0) {
      return true
    }

    return !!value;
  }

  let breakpoint = getBreakpointItemsGrouped(data.machines?.length)
  return (
    <ContentChart className="card-shadow">
      <TextSpan apparence="p3" hint>{title || ""}</TextSpan>
      <Row center middle="xs"className="pl-2 pr-2">
        {data.machines?.map((machineItem, i) => {
          let value = getValue(sensorStates?.find(
            (x) =>
              x.idMachine === machineItem?.machine?.value &&
              x.idSensor === machineItem?.sensor?.value
          )?.value);

          return (
            <Col
              breakPoint={breakpoint}
              className="mb-4"
              key={i}
              style={{
                cursor: machineItem?.link ? "pointer" : "default",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                display: "flex",
                padding: 4,
                margin: 0
              }}
              onClick={() => urlRedirect(machineItem?.link)}
            >
              <PowerOnOff
                style={{
                  height: '50%',
                  width: '50%',
                  color:
                    value === true
                      ? theme.colorSuccess500
                      : theme.colorDanger500,
                }}
              />
              <TextSpan
                apparence="s3"
                hint
                style={{ width: "100%", textAlign: "center",
                  wordWrap: "anywhere",
                 }}
              >
                {machineItem?.description || machineItem?.sensor?.label}
              </TextSpan>
            </Col>
          );
        })}
      </Row>
    </ContentChart>
  );
};

export default OnOffChart;
