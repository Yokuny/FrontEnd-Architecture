import { Badge, Button, Card, CardBody, CardFooter, Col, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";
import { LEVEL_NOTIFICATION } from "../../constants";
import { Fetch } from "../Fetch";
import TextSpan from "../Text/TextSpan";
import { getTokenDecoded } from "../Utils";
import { setNewNotifications } from "../../actions";
import { getColorLevel, getIconLevel } from "../../pages/notifications/NotificationsService";
import Overlay from "../Overlay";
import { formatDateDiff } from "../Utils";
import { useSocket } from "../Contexts/SocketContext";

const NotificationContainer = styled.a`
  cursor: pointer;
  text-decoration: none;
`;

const ColText = styled(Col)`
  display: flex;
  flex-direction: column;
`;

const ColIcon = styled(Col)`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 40px;
`;

const NotificationCard = styled(Card)`
  background: ${(props) => props.theme.backgroundBasicColor1}dd;
  border: 1px solid ${(props) => props.theme.borderBasicColor3 || props.theme.backgroundBasicColor3};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    .card-body {
      padding: 8px;
    }
  }
`;

const NotificationComponent = (props) => {
  const [data, setData] = React.useState([]);
  const [isReady, setIsReady] = React.useState(false);
  const [newNotifications, setNewNotifications] = React.useState([]);

  const navigate = useNavigate();
  const intl = useIntl();
  const theme = useTheme();
  const socket = useSocket();

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    if (!socket) {
      return;
    }
    let tokenDecoded = getTokenDecoded();
    socket.emit("join", {
      topics: [`notification_user_${tokenDecoded?.id}`],
    });
    socket.on(`notification_user_${tokenDecoded?.id}`, setNewNotifications);

    return () => {
      if (socket) {
        socket.emit("leave", {
          topics: [`notification_user_${tokenDecoded?.id}`],
        });
        socket.off(`notification_user_${tokenDecoded?.id}`, setNewNotifications);
      }
    };
  }, [socket]);

  React.useEffect(() => {
    if (newNotifications?.length) {
      setData([...newNotifications, ...data]);
      newNotifications.forEach((x) => {
        switch (x.level) {
          case LEVEL_NOTIFICATION.CRITICAL:
            toast.error(`${x.title?.replaceAll("*", "")} \r\n${getSubtitle(x)?.replaceAll("*", "")}`);
            break;
          case LEVEL_NOTIFICATION.WARNING:
            toast.warn(`${x.title?.replaceAll("*", "")} \r\n${getSubtitle(x)?.replaceAll("*", "")}`);
            break;
          case LEVEL_NOTIFICATION.INFO:
            toast.success(`${x.title?.replaceAll("*", "")} \r\n${getSubtitle(x)?.replaceAll("*", "")}`);
            break;
          default:
            toast.dark(`${x.title?.replaceAll("*", "")} \r\n${getSubtitle(x)?.replaceAll("*", "")}`);
            break;
        }
      });
      if (window.location.pathname === "/my-notification-list") props.setNewNotifications(newNotifications);
    }
  }, [newNotifications]);

  const getData = () => {
    Fetch.get(`/notification/mynotifications?notRead=true`)
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => { });
  };

  const formatString = (text, replaces, intl) => {
    let expression = intl.formatMessage({ id: text });
    if (replaces?.length) {
      replaces.forEach((x, i) => {
        if (!!x?.translate) {
          try {
            expression = expression.replace(`{${i}}`, intl.formatMessage({ id: x.translate }));
          } catch {
            expression = expression.replace(`{${i}}`, "");
          }
        } else {
          expression = expression.replace(`{${i}}`, x);
        }
      });
    }
    return expression;
  };

  const getSubtitle = (notification) => {
    return !!notification.data.subtitleKey
      ? formatString(notification.data.subtitleKey, notification.data.replacesSubtitle, intl)
      : notification.subtitle;
  };

  const getDescription = (notification) => {
    return !!notification.data.descriptionKey
      ? formatString(notification.data.descriptionKey, notification.data.replacesDescription, intl)
      : notification.description;
  };

  const hasNotifications = !!data?.length;
  const animation = hasNotifications ? { type: "shake", infinite: true, hover: false } : { type: "shake", hover: true };

  return (
    <>
      <Overlay
        transformSize={28}
        target={
          <NotificationContainer className="mr-1" onClick={props.onToggle}>
            <EvaIcon
              name="bell-outline"
              status="Basic"
              options={{
                height: 23,
                width: 23,
                animation,
              }}
            />
            {hasNotifications && (
              <Badge position="topEnd"
                style={{
                  top: -15, right: 0,
                  position: "relative"
                }} status="Danger">
                {data.length}
              </Badge>
            )}
          </NotificationContainer>
        }
        contextMenu
        placement="bottom"
        trigger="noop"
        show={props.isOpen}
        offset={8}>
        <NotificationCard theme={theme} className="content-menu-profile">
          <CardBody
            style={{
              maxHeight: 240,
              ...(!data?.length ? { width: "360px" } : {}),
            }}>
            {!!data?.length ? (
              <>
                {data?.map((notification, i) => {
                  let description = notification?.description ? getDescription(notification) : "";
                  let subtitle = getSubtitle(notification);
                  const iconColor = getColorLevel(notification.level);
                  const iconName = getIconLevel(notification.level);
                  return (
                    <Row
                      key={`not-${i}`}
                      className={notification.length - 1 == i && notification.length > 1 ? "" : "mb-4"}
                      style={{ flexWrap: "nowrap" }}>
                      <ColIcon className="mt-1 ml-1">
                        <EvaIcon
                          name={iconName}
                          options={{
                            fill: theme[iconColor],
                            animation: {
                              type: "pulse",
                              infinite: true,
                              hover: false,
                            },
                          }}
                        />
                      </ColIcon>
                      <ColText>
                        <TextSpan apparence="s2">{notification?.title?.replaceAll("*", "")}</TextSpan>
                        <TextSpan apparence="p2">{subtitle?.replaceAll("*", "")}</TextSpan>
                        {!!description && subtitle !== description && (
                          <TextSpan apparence="p2" hint>
                            {description}
                          </TextSpan>
                        )}

                        <TextSpan apparence="s3" hint>
                          {`${formatDateDiff(notification.data.date || notification.createAt, intl)}`}
                        </TextSpan>
                      </ColText>
                    </Row>
                  );
                })}
              </>
            ) : (
              <Row center="xs">
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="notifications.empty" />
                </TextSpan>
              </Row>
            )}
          </CardBody>

          <CardFooter>
            <Row center="xs">
              <Button
                size="Tiny"
                status="Primary"
                appearance="ghost"
                className="flex-between"
                onClick={() => navigate(`/notifications-dashboard`)}>
                <EvaIcon name="eye-outline" className="mr-1" />
                <FormattedMessage id="notifications.viewall" />
              </Button>
            </Row>
          </CardFooter>
        </NotificationCard>
      </Overlay>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setNewNotifications: (notifications) => {
    dispatch(setNewNotifications(notifications));
  },
});

export default connect(undefined, mapDispatchToProps)(NotificationComponent);
