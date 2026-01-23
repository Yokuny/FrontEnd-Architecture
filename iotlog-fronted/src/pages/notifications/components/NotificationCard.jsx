import React, { useState } from "react";
import { Card, Button, Select, EvaIcon, Badge, Row, Col } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { useTheme } from "styled-components";
import { getColorLevel, getColorStatus, getIconLevel } from "../NotificationsService";
import { TextSpan } from "../../../components";

const StyledCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
  padding: 1rem;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const LevelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LevelIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LevelText = styled.span`
  font-weight: 500;
  color: ${props => props.color};
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  color: ${props => props.theme.textHint};
`;

const SubtitleText = styled.span`
  color: ${props => props.theme.textHint};
  font-size: 0.9rem;
`;

const StatusSelect = styled(Select)`
  min-width: 150px;
  position: relative;
  z-index: 2;
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const NotificationCardComponent = ({
  notification,
  getNotificationStatus,
  getStatusLabel,
  getStatusOptions,
  handleStatusChange,
  handleResolveClick,
  intl
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const level = (notification.level || 'INFO').toUpperCase();
  const colorTextTheme = getColorLevel(level);
  const iconName = getIconLevel(level);
  const isNew = !notification.readAt;

  return (
    <StyledCard>
      <Row middle="xs">
        {/* Nível */}
        <Col breakPoint={{ xs: 12, sm: 3 }}>
          <LevelContainer>
            <LevelIcon>
              <EvaIcon
                name={iconName}
                options={{
                  fill: theme[colorTextTheme],
                  height: 24,
                  width: 24
                }}
              />
            </LevelIcon>
            <LevelText color={theme[colorTextTheme]}>
              {level}
            </LevelText>
            {isNew && (
              <Badge
                status={getColorStatus(level)}
              >
                <FormattedMessage id="new" />
              </Badge>
            )}
          </LevelContainer>
        </Col>

        {/* Mensagem */}
        <Col breakPoint={{ xs: 12, sm: 6 }}>
          <MessageContainer>
            <TextSpan>{notification.title}</TextSpan>
            {notification.subtitle && (
              <SubtitleText>
                {notification.subtitle}
              </SubtitleText>
            )}
          </MessageContainer>
        </Col>

        {/* Data/Hora */}
        <Col breakPoint={{ xs: 12, sm: 3 }}>
          <DateContainer>
            <EvaIcon
              name="calendar-outline"
              options={{ height: 18, width: 18 }}
            />
            <span>{formatDate(notification.createAt)}</span>
          </DateContainer>
        </Col>
      </Row>

      {isExpanded && (
        <Row className="mt-3">
          <Col breakPoint={{ xs: 12 }}>
            <div className="d-flex justify-content-end gap-2">
              {!notification.readAt && (
                <Button size="Small" status="Info">
                  <FormattedMessage id="notifications.mark.as.read" />
                </Button>
              )}
              <StatusSelect
                options={getStatusOptions()}
                placeholder={intl.formatMessage({ id: 'notifications.status.select' })}
                onChange={(value) => handleStatusChange(notification, value)}
                value={notification.status ?
                  {
                    value: notification.status,
                    label: intl.formatMessage({ id: `${notification.status}` })
                  } : null
                }
              />
            </div>
          </Col>
        </Row>
      )}
    </StyledCard>
  );
};

export default NotificationCardComponent;
