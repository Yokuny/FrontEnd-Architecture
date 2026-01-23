import React from "react";
import { Button, EvaIcon, Row } from "@paljs/ui";
import styled, { css, useTheme } from "styled-components";
import {
  getColorLevel,
  getColorStatus,
  getIconLevel,
} from "../NotificationsService";
import { TextSpan } from "../../../components";
import { useIntl } from "react-intl";
import moment from "moment";

const NotificationRowWrapper = styled.div`
  padding: 0.75rem 1rem;
  ${({ theme, isSelected = false }) => css`
    border-bottom: 0.5px solid ${theme.backgroundBasicColor4};
    background: ${isSelected
      ? `${theme.backgroundBasicColor4}50`
      : "transparent"};
  `}
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;

  &:hover {
    ${({ theme }) => css`
      background: ${theme.backgroundBasicColor4}50;
    `}
  }
`;

const NotificationRowContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const NotificationRowTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  ${({ theme }) => css`
    color: ${theme.colorTextBasic};
  `}
`;

const NotificationRowInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  ${({ theme }) => css`
    color: ${theme.colorTextHint};
  `}
`;

const StatusBadge = styled.div`
  padding: 2px 8px;
  border-radius: 0.875rem;
  font-size: 11px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.status) {
      case "undefined":
        return "#f39c1210"; // Mesmo cor do pending
      case "pending":
        return "#f39c1210";
      case "in_progress":
        return "#3498db10";
      case "not_done":
        return "#e74c3c10";
      case "done":
        return "#2ecc7110"; // Verde para realizado
      default:
        return "#f39c1210"; // Mesmo cor do pending
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "undefined":
        return "#f39c12"; // Mesmo cor do pending
      case "pending":
        return "#f39c12";
      case "in_progress":
        return "#3498db";
      case "not_done":
        return "#e74c3c";
      case "done":
        return "#2ecc71"; // Verde para realizado
      default:
        return "#f39c12"; // Mesmo cor do pending
    }
  }};
  margin-right: 8px;
`;

const NotificationRow = ({
  notification,
  onClick,
  isSelected
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const formatDate = (date) => {
    return moment(date).format("DD MMM YYYY, HH:mm");
  };

  return (
    <NotificationRowWrapper onClick={onClick} isSelected={isSelected}>
      <NotificationRowContent>
        <NotificationRowTitle>
          <Row className="m-0" between="xs" center="xs">
            <TextSpan apparence="s1">
              {notification.title?.replaceAll("*", " ")}
            </TextSpan>
            <Row className="m-0" center="xs">
              <Button
                status={getColorStatus(notification.level)}
                appearance="outline"
                style={{ border: 0, padding: `0.15rem 0.6rem` }}
                size="Tiny"
                className="flex-between ml-3"
              >
                <EvaIcon
                  name={getIconLevel(notification.level)}
                  options={{
                    fill: theme[getColorLevel(notification.level)],
                  }}
                  className="mr-1"
                />
                {notification.level || intl.formatMessage({ id: "other" })}
              </Button>
              <StatusBadge
                className="ml-2"
                status={notification.status || "pending"}
              >
                {intl.formatMessage({
                  id: `${notification.status || "pending"}`,
                })}
              </StatusBadge>
            </Row>
          </Row>
        </NotificationRowTitle>
        <NotificationRowInfo>
          <TextSpan apparence="p2" hint>
            {formatDate(notification.createAt)}
          </TextSpan>
        </NotificationRowInfo>
      </NotificationRowContent>
    </NotificationRowWrapper>
  );
};

export default NotificationRow;
