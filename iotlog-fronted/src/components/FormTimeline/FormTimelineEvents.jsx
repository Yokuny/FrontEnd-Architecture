import React from "react";
import { EvaIcon } from "@paljs/ui";
import moment from "moment";
import { useIntl } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { TextSpan } from "../";
import { IconBorder } from "../Icons/IconRounded";

const Item = styled.li`
  ${({ theme, color = "", noLine = false }) => css`
    ${!noLine
      ? `border-left: 2px solid ${color ?? theme.colorBasicFocusBorder};`
      : `border-left: 2px solid ${theme.backgroundBasicColor1};`}
  `}
  list-style: none;
`;

const ContainerIcon = styled.div`
  position: absolute;
  margin-left: -1.8rem;
`;

export default function FormTimelineEvents({ events }) {
  const theme = useTheme();
  const intl = useIntl();

  const getIcon = (name) => {
    if (["event.form.send"].includes(name))
      return {
        name: "paper-plane-outline",
        color: theme.colorSuccess500,
        bgColor: theme.colorSuccess100,
        text: name,
      };
    if (["event.form.edit"].includes(name))
      return {
        name: "edit-2-outline",
        color: theme.colorInfo500,
        bgColor: theme.colorInfo100,
        text: name,
      };
    return {
      name: "close",
      color: theme.colorDefault500,
      bgColor: theme.colorDefault100,
      text: "default",
    };
  };

  const eventsManualNormalized = () => {
    let eventsSorted = events?.map((x) => {
        const iconProps = getIcon(x.name);
        return {
          type: x.name,
          date: x.date,
          dateSort: x.date ? moment(x.date).toDate() : null,
          formatedDate: x.date ? moment(x.date).format("DD/MM/YYYY HH:mm") : null,
          user: x.user,
          iconProps,
          title: intl.formatMessage({ id: iconProps.text }),
        };
      }) || [];

    return (eventsSorted.sort((a, b) => b.dateSort - a.dateSort));
  };

  const eventsSorted = eventsManualNormalized();

  return (
    <>
      <div className="pt-4">
        {eventsSorted?.map((x, i) => (
          <Item
            noLine={i === eventsSorted?.length - 1}
            key={`event-${i}`}
            color={x.iconProps.color}
            className="pl-4 pb-4"
          >
            <ContainerIcon>
              <IconBorder
                borderColor={x.iconProps.color}
                color={x.iconProps.color}
                style={{ padding: 1 }}
              >
                <EvaIcon
                  name={x.iconProps.name}
                  options={{ width: 20, fill: "#fff" }}
                />
              </IconBorder>
            </ContainerIcon>
            <div className="col-flex pb-4 pl-2">
              <TextSpan
                apparence="c3"
                style={{ textTransform: "uppercase" }}
              >
                {x.title}
              </TextSpan>
              <TextSpan
                apparence="p3"
                className="mt-0"
                hint
                style={{ lineHeight: "9px", wordWrap: "break-word" }}
              >
                {x.formatedDate}
              </TextSpan>
              {!!x.user && <TextSpan
                apparence="p3"
                className="mt-2"
                hint
                style={{ lineHeight: "9px", wordWrap: "break-word" }}
              >
                {x.user.name}
              </TextSpan>}
            </div>
          </Item>
        ))}
      </div>
    </>
  );
}
