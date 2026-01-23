import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Button,
  EvaIcon,
  Row,
  Select,
} from "@paljs/ui";
import styled, { css, useTheme } from "styled-components";
import { LabelIcon, TextSpan } from "../../../components";
import SensorHistoryChart from "./SensorHistoryChart";
import {
  getColorLevel,
  getColorStatus,
  getIconLevel,
} from "../NotificationsService";
import moment from "moment";

const NotificationDetailsWrapper = styled.div`
  width: 50%;
  right: 0;
  top: 0;
  min-height: 450px;
  height: 100%;
  ${({ theme }) => css`
    background: ${theme.backgroundBasicColor1};
  `}
  display: ${(props) => (props.show ? "block" : "none")};
  overflow-y: auto;
`;

const DetailHeader = styled.div`
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  position: relative;
`;

const HeaderTitle = styled.span`
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  display: block;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailContent = styled.div`
  padding: 0.5rem 1.5rem;
`;

const DetailSection = styled.div`
  ${({ theme }) => css`
    background: ${theme.backgroundBasicColor2}90;
  `}
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.span`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 500;

  .icon {
    margin-right: 0.75rem;
  }
`;

const CloseButton = styled(Button)`
  position: absolute !important;
  right: 1rem;
  top: 1rem;
  padding: 0.5rem;
  min-width: auto;
  height: auto;
  z-index: 2;

  &:hover {
    ${({ theme }) => css`
      background: ${theme.backgroundBasicColor4}50;
    `}
  }

  .eva-icon {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0;
  }
`;

const DataInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin-top: 1rem;
`;

const DataInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${({ theme }) => css`
    color: ${theme.colorTextHint};
  `}

  strong {
    ${({ theme }) => css`
      color: ${theme.colorTextBasic};
    `}
    margin-right: 0.25rem;
  }
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

const StatusSelect = styled(Select)`
  width: 200px;
  min-width: 200px;
  `

const NotificationDetails = ({
  show,
  notification,
  onClose,
  onStatusChange,
  getStatusOptions,
  setItemSelected,
  disabledActions,
}) => {
  const theme = useTheme();
  const intl = useIntl();

  if (!show || !notification) {
    return null;
  }

  const formatDate = (date) => {
    return moment(date).format("DD MMM YYYY, HH:mm");
  };

  return (
    <NotificationDetailsWrapper show={show} className="mb-4">
      <DetailHeader>
        <CloseButton
          appearance="ghost"
          status="Danger"
          size="Small"
          onClick={onClose}
        >
          <EvaIcon name="close-outline" />
        </CloseButton>

        <HeaderTitle>
          {notification.title?.replaceAll("*", " ")}
        </HeaderTitle>

        <HeaderInfo>
          <Button
            status={getColorStatus(notification.level)}
            appearance="outline"
            style={{ border: 0, padding: `0.2rem 0.6rem` }}
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

          <StatusBadge status={notification.status || "pending"}>
            {intl.formatMessage({
              id: `${notification.status || "pending"}`,
            })}
          </StatusBadge>
        </HeaderInfo>
      </DetailHeader>

      <DetailContent>
        <DetailSection>
          <DataInfoSection className="pl-1">
            {notification.description && (
              <>
                <LabelIcon
                  title={<FormattedMessage id="description" />}
                  iconName="text-outline"
                />
                <TextSpan apparence="p1" className="mb-3">
                  {notification.description}
                </TextSpan>
              </>
            )}
            {notification.subtitle && (
              <>
                <LabelIcon
                  title={<FormattedMessage id="observation" />}
                  iconName="file-text-outline"
                />
                <TextSpan apparence="p1" className="mb-3">
                  {notification.subtitle}
                </TextSpan>
              </>
            )}
            {notification.asset?.name && (
              <>
                <LabelIcon
                  title={<FormattedMessage id="machine" />}
                  iconName="wifi-outline"
                />
                <TextSpan apparence="p1" className="mb-3">
                  {notification.asset?.name}
                </TextSpan>
              </>
            )}
            {notification.data?.date && (
              <>
                <LabelIcon
                  title={<FormattedMessage id="datetime" />}
                  iconName="calendar-outline"
                />
                <TextSpan apparence="p1" className="mb-3">
                  {formatDate(notification.data.date)}
                </TextSpan>
              </>
            )}
            {notification.createAt && (
              <>
                <LabelIcon
                  title={<FormattedMessage id="created.at" />}
                  iconName="paper-plane-outline"
                />
                <TextSpan apparence="p2" className="mb-3">
                  {formatDate(notification.createAt)}
                </TextSpan>
              </>
            )}
            {notification.data?.idSensor && (
              <>
                <LabelIcon
                  title={<FormattedMessage id="sensor.history" />}
                  iconName="activity-outline"
                />
                <SensorHistoryChart
                  notificationData={notification.data}
                />
              </>
            )}
          </DataInfoSection>
            {notification.level !== "info" && (

              <div
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem",
                  display: "flex",
                  gap: "0.5rem",
                  flexDirection: "column",
                }}
              >
                <LabelIcon
                  title={<FormattedMessage id="actions" />}
                  iconName="edit-outline"
                />
                <Row className="m-0 pl-1">
                  <StatusSelect
                    options={getStatusOptions()}
                    disabled={disabledActions}
                    menuPosition="fixed"
                    value={
                      notification.status
                        ? {
                            value: notification.status,
                            label: intl.formatMessage({
                              id: `notifications.status.${notification.status}`,
                            }),
                          }
                        : {
                            value: "pending",
                            label: intl.formatMessage({
                              id: "notifications.status.pending",
                            }),
                          }
                    }
                    onChange={(value) => {
                      onStatusChange(notification, value);
                    }}
                    placeholder={intl.formatMessage({
                      id: "notifications.status.select",
                    })}
                  />

                  <Button
                    size="Tiny"
                    status="Info"
                    appearance="ghost"
                    className="flex-between ml-4"
                    disabled={disabledActions}
                    onClick={() => setItemSelected(notification)}
                  >
                    <EvaIcon name="edit-2-outline" className="mr-1" />
                    <FormattedMessage id="justify" />
                  </Button>
                </Row>
              </div>
            )}

        </DetailSection>

        {!!notification.logs?.length && (
          <DetailSection className="mt-4 pt-2 pb-2 mb-2">
            <SectionTitle>
              <LabelIcon
                iconName="info-outline"
                title={<FormattedMessage id="history" />}
              />
            </SectionTitle>
            <DataInfoSection>
              {notification.logs?.map((log, index) => (
                <DataInfoItem key={index} className="mb-1">
                  <EvaIcon name="person" status="Basic" className="icon" />
                  <TextSpan apparence="p2">
                    {log.target === "status" ? (
                      <>
                        {log.userName || `N/A`}
                        {" "}
                        {intl.formatMessage({
                          id: "notifications.log.status.change",
                        })}
                        {" "}
                        <strong>
                          {intl.formatMessage({
                            id: `${log.value || log.status || "other"}`
                          })}
                        </strong>
                        {" "}
                        {intl.formatMessage({ id: "notifications.log.in" })}{" "}
                        {formatDate(log.date)}
                      </>
                    ) : (
                      <>{log.description}</>
                    )}
                  </TextSpan>
                </DataInfoItem>
              ))}
            </DataInfoSection>
          </DetailSection>
        )}
      </DetailContent>
    </NotificationDetailsWrapper>
  );
};

export default NotificationDetails;
