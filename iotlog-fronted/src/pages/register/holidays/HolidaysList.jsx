import React from "react";
import Col from "@paljs/ui/Col";
import HolidayAdd from "./HolidayAdd";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

const Column = styled(Col)`
  display: flex;
  flex-direction: column;
`;

export default function HolidayList({
  holidays,
  onRemoveHoliday,
  onAddHoliday,
  onChangeItem,
}) {
  const verifyEmpty = (holiday) => {
    return Object.keys(holiday)
      .filter((x) => x === "id" || x === "holiday")
      .some((x) => !holiday[x]);
  };

  return (
    <>
      <Column className="mt-2">
        {holidays?.map((holiday, i) => {
          return (
            <HolidayAdd
              key={i}
              onRemoveHoliday={() => onRemoveHoliday(i)}
              holiday={holiday}
              onChangeItem={(name, value) => onChangeItem(i, name, value)}
            />
          );
        })}
        <div className="mb-1">
          <Button
            disabled={
              !!(holidays?.length && verifyEmpty(holidays[holidays.length - 1]))
            }
            size="Tiny"
            status="Info"
            onClick={onAddHoliday}
          >
            <FormattedMessage id="new.holidays" />
          </Button>
        </div>
      </Column>
    </>
  );
}
