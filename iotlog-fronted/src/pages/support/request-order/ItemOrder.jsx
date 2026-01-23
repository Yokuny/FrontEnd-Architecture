import React from "react";
import { injectIntl } from "react-intl";
import { getStatus } from "../services";
import { ListItem } from "@paljs/ui/List";
import Col from "@paljs/ui/Col";
import styled, { css } from "styled-components";
import { TextSpan } from "../../../components";
import Row from "@paljs/ui/Row";
import Badge from "@paljs/ui/Badge";
import moment from "moment";

const Img = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;

  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
`;

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ColFlexCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ListItemStyle = styled(ListItem)`
  ${({ theme, status }) => css`
    border-left: 6px solid ${theme[`badge${status}BackgroundColor`]};
    width: 100%;
    cursor: pointer;

    &:hover {
      span {
        color: ${theme.tabsetTabHoverTextColor};
        background-color: ${theme.tabsetTabHoverBackgroundColor};
        &::before {
          background-color: ${theme.tabsetTabHoverUnderlineColor};
        }
      }
    }
  `}
`;

const ItemOrder = (props) => {
  const { order, intl } = props;

  const status = getStatus(order.status);

  const getDateSla = (sla) => {
    let dateSla = "";
    if (sla) {
      dateSla = moment(sla).format(
        intl.formatMessage({ id: "format.datetimewithoutss" })
      );
    }

    return dateSla;
  };

  return (
    <>
      <ListItemStyle status={status.badge} onClick={() => props.onClick(order.id)}>
        <Col breakPoint={{ md: 12 }}>
          <Row>
            <ColFlexCenter breakPoint={{ md: 2, sm: 12 }}>
              <Img
                src={order.urlProductServiceImage}
                alt={order.productService}
              />
            </ColFlexCenter>
            <ColFlex breakPoint={{ md: 3, sm: 12 }}>
              <TextSpan apparence="s1">{order.subject}</TextSpan>
              <TextSpan apparence="p2">{order.productService}</TextSpan>
              <TextSpan apparence="p2">{order.enterprise}</TextSpan>
            </ColFlex>
            <ColFlex breakPoint={{ md: 4, sm: 12 }}>
              <TextSpan apparence="p2">{`${intl.formatMessage({
                id: "sla.attendance",
              })}: ${getDateSla(order.dateSlaAttendance)}`}</TextSpan>
              <TextSpan apparence="p2">{`${intl.formatMessage({
                id: "sla.solution",
              })}: ${getDateSla(order.dateSlaSolution)}`}</TextSpan>
            </ColFlex>
            <ColFlexCenter breakPoint={{ md: 3, sm: 12 }}>
              <Badge
                className="mb-1"
                status={status.badge}
                style={{
                  position: "relative",
                }}
              >
                {intl.formatMessage({ id: status.textId }).toUpperCase()}
              </Badge>
              <Row>
                <TextSpan apparence="c2">
                  {intl.formatMessage({
                    id: "support",
                  })}
                  :
                </TextSpan>
                <TextSpan className="ml-1" apparence="label">
                  {order.code || "-"}
                </TextSpan>
              </Row>
              <TextSpan apparence="p2">{`${intl.formatMessage({
                id: "open.in",
              })} ${moment(order.createdAt).format(
                intl.formatMessage({ id: "format.datetimewithoutss" })
              )}`}</TextSpan>
            </ColFlexCenter>
          </Row>
        </Col>
      </ListItemStyle>
    </>
  );
};

export default injectIntl(ItemOrder);
