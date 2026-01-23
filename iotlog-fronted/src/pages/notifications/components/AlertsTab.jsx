import React, { useState } from "react";
import styled, { css } from "styled-components";
import NotificationRow from "./NotificationRow";
import NotificationDetails from "./NotificationDetails";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { JustifyModal } from "../JustifyModal";
import { Fetch, SpinnerFull } from "../../../components";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import { SkeletonThemed } from "../../../components/Skeleton";
import { FormattedMessage, useIntl } from "react-intl";

const NotificationList = styled.div`
  width: ${(props) => (props.isExpanded ? "50%" : "100%")};
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 350px);
  min-height: 300px;
  ${({ theme }) => css`
    background: ${theme.backgroundBasicColor1};
  `}
`;

const NotificationListWrapper = styled.div`
  display: flex;
  ${({ theme }) => css`
    background: ${theme.backgroundBasicColor1};
  `}
`;

const NotificationListContent = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    ${({ theme }) => css`
      background: ${theme.backgroundBasicColor2};
    `}
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    ${({ theme }) => css`
      background: ${theme.backgroundBasicColor4};
    `}
    border-radius: 4px;
  }
`;

const AlertsTab = () => {

  const [itemSelected, setItemSelected] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [notifications, setNotifications] = useState({
    data: [],
    total: 0,
  });
  const [selectedNotificationDetails, setSelectedNotificationDetails] = useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const intl = useIntl();

  const size = 10;

  const dateMin = searchParams.get("dateMin");
  const dateMax = searchParams.get("dateMax");

  React.useEffect(() => {
    loadAllData({ page: 0 });
  }, [searchParams]);

  const loadAllData = async ({ page }) => {
    setIsLoading(true);

    try {
      const data = await getDataNotificationsAsync({ page });
      setNotifications(data);
      setPage(page);
    }
    catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  async function getDataNotificationsAsync({ page }) {
    const idEnterpriseFilter = localStorage.getItem("id_enterprise_filter");
    let url = `/notification/history/list`;

    const params = [
      `page=${page}`,
      `size=${size}`
    ];

    if (dateMin) {
      params.push(`dateMin=${moment(dateMin).format('YYYY-MM-DDTHH:mm:ssZ')}`);
    }
    if (dateMax) {
      params.push(`dateMax=${moment(dateMax).format('YYYY-MM-DDTHH:mm:ssZ')}`);
    }
    if (idEnterpriseFilter) {
      params.push(`idEnterprise=${idEnterpriseFilter}`);
    }

    const finalUrl = `${url}?${params.join("&")}`;

    return (await Fetch.get(finalUrl))?.data;
  }

  const loadMoreNotifications = async () => {
    //if (notifications.data.length >= notifications.total) return;
    setIsLoadingMore(true);
    try {
      const data = await getDataNotificationsAsync({ page: page + 1 });
      setNotifications(prev => ({
        ...prev,
        data: [...prev.data, ...data.data]
      }));
      setPage(prev => prev + 1);
    }
    catch (error) {
    }
    finally {
      setIsLoadingMore(false);
    }
  }

  const handleSaveJustify = (justifyData) => {
    setItemSelected(null);
    handleStatusChange(selectedNotificationDetails, { value: 'done' }, justifyData);
  };

  const handleNotificationClick = (notification) => {
    if (selectedNotificationDetails?.id === notification.id) {
      setSelectedNotificationDetails(null);
      return;
    }

    setSelectedNotificationDetails(notification);
  };

  const handleCloseDetails = () => {
    setSelectedNotificationDetails(null);
  };

  const handleStatusChange = async (notification, newStatus, justify = null) => {
    try {
      if (!notification?.id || !newStatus) return;

      setIsChanging(true);

      const response = await Fetch.put(`/notification/${notification.id}/status`, {
        status: newStatus.value,
        justify
      });

      if (response?.data?.code === "notifications.status.updated") {
        const userResponse = await Fetch.get(`/user/find/details?id=${response.data.data.log.userId}`);

        const updatedNotification = {
          ...notification,
          status: newStatus.value,
          logs: [
            ...(notification.logs || []),
            {
              ...response.data.data.log,
              value: newStatus.value,
              userName: userResponse.data?.name || response.data.data.userName
            }
          ]
        };

        setNotifications(prev => ({
          ...prev,
          data: prev.data.map(item => item.id === notification.id ? updatedNotification : item)
        }));

        if (selectedNotificationDetails?.id === notification.id) {
          setSelectedNotificationDetails(updatedNotification);
        }

        toast.success(intl.formatMessage({ id: "notifications.status.update.success" }));
      }
    } catch (error) {
      toast.error(intl.formatMessage({ id: "notifications.status.update.error" }));
    } finally {
      setIsChanging(false);
    }
  };

  const getStatusOptions = () => [
    { value: 'pending', label: intl.formatMessage({ id: 'notifications.status.pending' }) },
    { value: 'in_progress', label: intl.formatMessage({ id: 'notifications.status.in_progress' }) },
    { value: 'not_done', label: intl.formatMessage({ id: 'notifications.status.not_done' }) },
    { value: 'done', label: intl.formatMessage({ id: 'notifications.status.done' }) }
  ];

  if (isLoading) {
    return <Row className="m-0 pl-2 pr-2 pt-2">
      <Col breakPoint={{ xs: 12, md: 6 }}>
        <SkeletonThemed height={100} />
        <div className="mt-2"></div>
        <SkeletonThemed height={100} />
        <div className="mt-2"></div>
        <SkeletonThemed height={100} />
        <div className="mt-2"></div>
        <SkeletonThemed height={100} />
        <div className="mt-2"></div>
        <SkeletonThemed height={100} />
      </Col>
      <Col breakPoint={{ xs: 12, md: 6 }}>
        <SkeletonThemed height={545} />
      </Col>
    </Row>
  }

  return (
    <>
      <NotificationListWrapper>
        <NotificationList isExpanded={!!selectedNotificationDetails}>
          <NotificationListContent>
            {notifications?.data?.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                isSelected={selectedNotificationDetails?.id === notification.id}
              />
            ))}

          </NotificationListContent>
          {notifications?.data?.length < notifications.total &&
            <Row center="xs" className="m-0 pt-4">
              <Button
                size="Tiny"
                className="mt-1 mb-4 flex-between"
                appearance="ghost"
                status="Basic"
                disabled={isLoadingMore}
                onClick={() => loadMoreNotifications()}
              >
                <EvaIcon name="sync-outline" className="mr-1" />
                <FormattedMessage id="load.olds" />
              </Button>
            </Row>}
        </NotificationList>

        <NotificationDetails
          show={!!selectedNotificationDetails}
          notification={selectedNotificationDetails}
          onClose={handleCloseDetails}
          disabledActions={isChanging}
          onStatusChange={handleStatusChange}
          getStatusOptions={getStatusOptions}
          setItemSelected={setItemSelected}
        />

        <JustifyModal
          isShow={!!itemSelected}
          handleClose={() => setItemSelected(null)}
          handleSave={handleSaveJustify}
        />

        <SpinnerFull isLoading={isChanging} />
      </NotificationListWrapper>
    </>
  );
};

export default AlertsTab;
