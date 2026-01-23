import moment from "moment";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { TextSpan } from "../../../../../components";
import { getDiffDateString } from "../../../../travel/Utils";

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DateTimeDifference = ({ start, end }) => {
  const intl = useIntl();
  if (!start && end)
    return (
      <>
        <TextSpan apparence="p3" hint>
          {`${moment(end).format("DD MMM HH:mm")}`}
        </TextSpan>
      </>
    );

  const dateStart = moment(start);
  if (!end)
    return (
      <>
        <TextSpan apparence="p3" hint>
          {`${dateStart.format("DD MMM HH:mm")}`}
        </TextSpan>
      </>
    );

  const dateEnd = moment(end);
  if (dateStart.isSame(dateEnd, "day")) {
    return (
      <>
        <Column>
          <TextSpan apparence="p3" hint>
            {`${dateStart.format("DD MMM")}, ${dateStart.format(
              "HH:mm"
            )} - ${dateEnd.format("HH:mm")}`}
          </TextSpan>
          <TextSpan apparence="c1" hint>
            {`${intl.formatMessage({
              id: "duration",
            })}: ${getDiffDateString(start, end, intl)}`}
          </TextSpan>
        </Column>
      </>
    );
  }

  return (
    <>
      <Column>
        <TextSpan apparence="p3" hint>
          {`${dateStart.format("DD MMM HH:mm")} - ${dateEnd.format(
            "DD MMM HH:mm"
          )}`}
        </TextSpan>
        <TextSpan apparence="c1" hint>
          {`${intl.formatMessage({ id: "duration" })}: ${getDiffDateString(
            start,
            end,
            intl
          )}`}
        </TextSpan>
      </Column>
    </>
  );
};
