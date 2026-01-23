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

export default function InputDateTime({
  onChange,
  value,
  onlyDate = false,
  onlyTime = false,
  min = undefined,
  max = undefined,
  className = "",
  breakPointDate = undefined,
  breakPointTime = undefined,
  isDisabled = false,
  isRequired = false,
}) {
  const [dateInternal, setDateInternal] = React.useState();
  const [timeInternal, setTimeInternal] = React.useState();

  React.useEffect(() => {
    if (value) {
      if (!onlyTime && !dateInternal)
        setDateInternal(moment(value).format("YYYY-MM-DD"));
      if (!onlyDate && !timeInternal)
        setTimeInternal(moment(value).format("HH:mm"));
    } else {
      setDateInternal("");
      setTimeInternal("");
    }
  }, [value, onlyDate, onlyTime, dateInternal, timeInternal]);

  const mountDate = (date, time) => {
    return moment(`${moment(date).format("YYYY-MM-DD")}T${time}`).toDate();
  };

  const onChangeInternal = (dateChoose) => {
    if (dateChoose && dateChoose?.length < 10) {
      setDateInternal(dateChoose);
      return;
    }
    onChange(
      mountDate(dateChoose, onlyDate || !timeInternal ? "00:00" : timeInternal)
    );
    setDateInternal(dateChoose);
  };

  const onChangeInternalTime = (timeChoose) => {
    if (timeChoose?.length < 5) {
      setTimeInternal(timeChoose);
      return;
    }
    onChange(
      mountDate(
        onlyTime || !dateInternal
          ? moment().format("YYYY-MM-DD")
          : dateInternal,
        timeChoose
      )
    );
    setTimeInternal(timeChoose);
  };

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
                onChange={(e) => onChangeInternal(e.target.value)}
                value={dateInternal}
                className="input-date"
                min={min && moment(min).format("YYYY-MM-DD")}
                max={max && moment(max).format("YYYY-MM-DD")}
                type="date"
                disabled={isDisabled}
                required={isRequired}
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
                onChange={(e) => onChangeInternalTime(e.target.value)}
                value={timeInternal}
                type="time"
                className="input-date"
                disabled={isDisabled}
                required={isRequired}
              />
              <ContainerIcon>
                <EvaIcon name="clock-outline" status="Basic"
                  options={{ id: "icontime" }}
                />
              </ContainerIcon>
            </ContainerDataTime>
          </Col>
        )}
      </Row>
    </>
  );
}
