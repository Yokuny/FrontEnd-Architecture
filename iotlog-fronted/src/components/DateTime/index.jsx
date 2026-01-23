import Col from "@paljs/ui/Col";
import { EvaIcon } from "@paljs/ui/Icon";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import React from "react";
import styled from "styled-components";
import moment from "moment";

const ContainerDataTime = styled(InputGroup)`
  input {
    &::-webkit-calendar-picker-indicator {
      position: absolute;
      opacity: 0;
      width: 100%;
      z-index: 99;
      cursor: pointer;
    }
  }
`;

const ContainerIcon = styled.a`
  position: absolute;
  right: 13px;
  top: 12px;
  cursor: pointer;
`;

export default function DateTime({
  onChangeTime,
  onChangeDate,
  date,
  time,
  onlyDate = false,
  onlyTime = false,
  min = undefined,
  max = undefined,
  className = "",
  breakPointDate = undefined,
  breakPointTime = undefined,
  isDisabled = false
}) {
  return (
    <>
      <Row className={className}>
        {!onlyTime && (
          <Col
            breakPoint={
              onlyDate
                ? { md: 12 }
                : breakPointDate
                  ? breakPointDate
                  : { md: 7, sm: 7, xs: 7 }
            }
          >
            <ContainerDataTime fullWidth>
              <input
                onChange={(e) => onChangeDate(e.target.value)}
                value={date}
                className="input-date"
                min={min && moment(min).format("YYYY-MM-DD")}
                max={max && moment(max).format("YYYY-MM-DD")}
                type="date"
                disabled={isDisabled}
              />
              <ContainerIcon>
                <EvaIcon
                  name="calendar-outline"
                  status="Basic"
                  options={{ id: "icondate" }}
                />
              </ContainerIcon>
            </ContainerDataTime>
          </Col>
        )}
        {!onlyDate && (
          <Col
            breakPoint={
              onlyTime
                ? { md: 12 }
                : breakPointTime
                  ? breakPointTime
                  : { md: 5, sm: 5, xs: 5 }
            }
          >
            <ContainerDataTime fullWidth>
              <input
                onChange={(e) => onChangeTime(e.target.value)}
                value={time}
                type="time"
                className="input-date"
                disabled={isDisabled}
              />
              <ContainerIcon>
                <EvaIcon name="clock-outline" status="Basic" options={{ id: "icontime" }} />
              </ContainerIcon>
            </ContainerDataTime>
          </Col>
        )}
      </Row>
    </>
  );
}
