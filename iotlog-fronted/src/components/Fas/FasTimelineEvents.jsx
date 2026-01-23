import React from "react";
import { EvaIcon } from "@paljs/ui";
import moment from "moment";
import { useIntl } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { Fetch, TextSpan } from "../";
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

export default function FasTimelineEvents({ orderId, fasId, supplierData }) {
  const theme = useTheme();
  const intl = useIntl();
  const [eventsData, setEventsData] = React.useState();

  React.useLayoutEffect(() => {
    if (orderId)
      getEventsAuto(orderId, 'order');
    else if (fasId)
      getEventsAuto(fasId, 'fas');
    else {
      setEventsData([])
    }
  }, [orderId, fasId]);

  const getEventsAuto = (id, type = 'order') => {
    if (id) {
      const endpoint = type === 'order' 
        ? `/fas/order-events/find?id=${id}`
        : `/fas/fas-events/find?id=${id}`;
      
      Fetch.get(endpoint)
        .then((response) => {
          setEventsData(response.data?.length ? response.data : []);
        })
        .catch((e) => {
          setEventsData([]);
        });
    }
  };

  const getIcon = (name) => {
    if (["supplier.cancel.order", "refused.sap", "refuse.order.bms", "refused.contract", "refuse.order.creation"].includes(name))
      return {
        name: "close-outline",
        color: theme.colorDanger500,
        bgColor: theme.colorDanger100,
        text: name,
      };

    if (["confirm.order.creation", "confirm.order.bms", "accept.order", "start.bms", "send.bms"].includes(name))
      return {
        name: "checkmark-outline",
        color: theme.colorSuccess500,
        bgColor: theme.colorSuccess100,
        text: name,
      };

    if (name === "transfer.order")
      return {
        name: "shuffle-2-outline",
        color: theme.colorWarning500,
        bgColor: theme.colorWarning100,
        text: name,
      };
    if (name === "not.realized")
      return {
        name: "shuffle-2-outline",
        color: theme.colorWarning500,
        bgColor: theme.colorWarning100,
        text: name,
      };
    if (["close.order", "confirm.order.payment", "confirmed.contract", "confirmed.sap"].includes(name))
      return {
        name: "done-all-outline",
        color: theme.colorSuccess500,
        bgColor: theme.colorSuccess100,
        text: name,
      };
    if (name === "rate.order")
      return {
        name: "star-outline",
        color: theme.colorInfo500,
        bgColor: theme.colorInfo100,
        text: name,
      };
    if (["add.order.buy.request", "add.order.bms"].includes(name))
      return {
        name: "plus-outline",
        color: theme.colorInfo500,
        bgColor: theme.colorInfo100,
        text: name,
      };
    if (name === "add.order.invoice")
      return {
        name: "file-add-outline",
        color: theme.colorInfo500,
        bgColor: theme.colorInfo100,
        text: name,
      };
    if (name === "request.order")
      return {
        name: "corner-down-right-outline",
        color: theme.colorInfo500,
        bgColor: theme.colorInfo100,
        text: name,
      };
    if (["edit.order", "edit.order.collaborators","edit.fas"].includes(name))
      return {
        name: "edit-outline",
        color: theme.colorInfo500,
        bgColor: theme.colorInfo100,
        text: name,
      };
    if (["other"].includes(name))
      return {
        name: "info-outline",
        color: theme.colorBasic500,
        bgColor: theme.colorBasic100,
        text: name,
      };
    if (["create.order", "create.fas", "add.order"].includes(name))
      return {
        name: "file-add-outline",
        color: theme.colorInfo500,
        bgColor: theme.colorInfo100,
        text: name,
      };
    if (name === "return.order")
      return {
        name: "arrow-back-outline",
        color: theme.colorDanger500,
        bgColor: theme.colorDanger100,
        text: name,
      };
    if (name === "order.supplier.canceled")
      return {
        name: "arrow-back-outline",
        color: theme.colorDanger500,
        bgColor: theme.colorDanger100,
        text: name,
      };
    if (["invoice.rejected", "cancelled"].includes(name))
      return {
        name: "close-outline",
        color: theme.colorDanger500,
        bgColor: theme.colorDanger100,
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
    return (
      eventsData?.map((x) => {
        const iconProps = getIcon(x.name);
        return {
          type: x.name,
          date: x.timeToNextEvent,
          dateSort: moment(x.date).toDate(),
          formatedDate: x.formatedDate,
          user: x.user,
          supplier: x.supplier,
          payload: x.payload,
          iconProps,
          title: intl.formatMessage({ id: iconProps.text }),
        };
      }) || []
    );
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
              <TextSpan
                apparence="p3"
                className="mt-1"
                hint
                style={{ lineHeight: "9px", wordWrap: "break-word" }}
              >
                {x.date}
              </TextSpan>
              {!!x.user && <TextSpan
                apparence="p3"
                className="mt-2"
                hint
                style={{ lineHeight: "9px", wordWrap: "break-word" }}
              >
                {x.user.name}
              </TextSpan>}
              {!!x.supplier &&
                <>
                  <TextSpan
                    apparence="p3"
                    className="mt-2"
                    hint
                    style={{ lineHeight: "9px", wordWrap: "break-word" }}
                  >
                    {x.supplier.name}
                  </TextSpan>
                  <TextSpan
                    apparence="p3"
                    className="mt-2"
                    hint
                    style={{ lineHeight: "9px", wordWrap: "break-word" }}
                  >
                    {x.supplier.razao}
                  </TextSpan>
                </>}
              {!!x.payload && <TextSpan
                apparence="p3"
                className="mt-2"
                hint
                style={{ lineHeight: "9px", wordWrap: "break-word" }}
              >
                {x.payload}
              </TextSpan>}
            </div>
          </Item>
        ))}
      </div>
    </>
  );
}
